import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// GRID FILE DOWNLOAD API PROXY
// ============================================================================
// Server-side proxy for GRID File Download REST API
// Provides file listing and download for events JSONL and end_state
// ============================================================================

const GRID_FILE_API = process.env.GRID_FILE_API || "https://api.grid.gg";
const TIMEOUT_MS = parseInt(process.env.GRID_TIMEOUT_MS || "15000", 10);

// In-memory cache for file lists and downloaded content
const fileListCache = new Map<string, { data: unknown; cachedAt: number }>();
const fileContentCache = new Map<string, { data: unknown; cachedAt: number }>();
const CACHE_TTL_MS = parseInt(process.env.GRID_CACHE_TTL_SECONDS || "600", 10) * 1000;

// ============================================================================
// LIST FILES FOR A SERIES
// ============================================================================

async function listFiles(seriesId: string, apiKey: string): Promise<NextResponse> {
    // Check cache
    const cached = fileListCache.get(seriesId);
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
        return NextResponse.json({
            success: true,
            seriesId,
            files: cached.data,
            cached: true,
        });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await fetch(
            `${GRID_FILE_API}/file-download/list/${seriesId}`,
            {
                headers: {
                    "x-api-key": apiKey,
                },
                signal: controller.signal,
            }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json({
                    success: true,
                    seriesId,
                    files: [],
                    message: "No files available for this series",
                });
            }
            console.error(`[GRID FileDownload] List error: ${response.status}`);
            return NextResponse.json(
                { error: `GRID API error: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Cache the file list
        fileListCache.set(seriesId, {
            data: data.files || data,
            cachedAt: Date.now(),
        });

        return NextResponse.json({
            success: true,
            seriesId,
            files: data.files || data,
            cached: false,
        });

    } catch (fetchError) {
        clearTimeout(timeoutId);

        if (fetchError instanceof Error && fetchError.name === "AbortError") {
            return NextResponse.json(
                { error: "GRID API timeout" },
                { status: 504 }
            );
        }

        console.error("[GRID FileDownload] Fetch error:", fetchError);
        return NextResponse.json(
            { error: "GRID API unreachable" },
            { status: 503 }
        );
    }
}

// ============================================================================
// DOWNLOAD FILE CONTENT
// ============================================================================

async function downloadFile(fileUrl: string, apiKey: string): Promise<NextResponse> {
    // Check cache
    const cached = fileContentCache.get(fileUrl);
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
        return NextResponse.json({
            success: true,
            content: cached.data,
            cached: true,
        });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS * 2); // Longer timeout for downloads

    try {
        const response = await fetch(fileUrl, {
            headers: {
                "x-api-key": apiKey,
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.error(`[GRID FileDownload] Download error: ${response.status}`);
            return NextResponse.json(
                { error: `GRID API error: ${response.status}` },
                { status: response.status }
            );
        }

        const contentType = response.headers.get("content-type") || "";

        // Handle different file types
        if (contentType.includes("application/json")) {
            const data = await response.json();
            fileContentCache.set(fileUrl, {
                data,
                cachedAt: Date.now(),
            });
            return NextResponse.json({
                success: true,
                content: data,
                contentType: "json",
                cached: false,
            });
        }

        // For JSONL or other text content
        const text = await response.text();

        // Parse JSONL into array of events
        if (fileUrl.includes("events") || contentType.includes("jsonl")) {
            const events = text
                .split("\n")
                .filter(line => line.trim())
                .map(line => {
                    try {
                        return JSON.parse(line);
                    } catch {
                        return null;
                    }
                })
                .filter(Boolean);

            fileContentCache.set(fileUrl, {
                data: events,
                cachedAt: Date.now(),
            });

            return NextResponse.json({
                success: true,
                content: events,
                contentType: "jsonl",
                eventCount: events.length,
                cached: false,
            });
        }

        // Return as raw text
        return NextResponse.json({
            success: true,
            content: text,
            contentType: "text",
            cached: false,
        });

    } catch (fetchError) {
        clearTimeout(timeoutId);

        if (fetchError instanceof Error && fetchError.name === "AbortError") {
            return NextResponse.json(
                { error: "GRID API timeout" },
                { status: 504 }
            );
        }

        console.error("[GRID FileDownload] Fetch error:", fetchError);
        return NextResponse.json(
            { error: "GRID API unreachable" },
            { status: 503 }
        );
    }
}

// ============================================================================
// ROUTE HANDLERS
// ============================================================================

export async function GET(request: NextRequest) {
    const apiKey = process.env.GRID_API_KEY;

    if (!apiKey) {
        console.warn("[GRID FileDownload] API key not configured");
        return NextResponse.json(
            { error: "GRID API key not configured" },
            { status: 503 }
        );
    }

    const { searchParams } = new URL(request.url);
    const seriesId = searchParams.get("seriesId");
    const fileUrl = searchParams.get("url");

    if (fileUrl) {
        // Download specific file
        return downloadFile(fileUrl, apiKey);
    }

    if (seriesId) {
        // List files for series
        return listFiles(seriesId, apiKey);
    }

    return NextResponse.json(
        { error: "Missing seriesId or url parameter" },
        { status: 400 }
    );
}

export async function POST(request: NextRequest) {
    const apiKey = process.env.GRID_API_KEY;

    if (!apiKey) {
        console.warn("[GRID FileDownload] API key not configured");
        return NextResponse.json(
            { error: "GRID API key not configured" },
            { status: 503 }
        );
    }

    try {
        const body = await request.json();
        const { action, seriesId, fileUrl } = body;

        if (action === "list" && seriesId) {
            return listFiles(seriesId, apiKey);
        }

        if (action === "download" && fileUrl) {
            return downloadFile(fileUrl, apiKey);
        }

        return NextResponse.json(
            { error: "Invalid action or missing parameters" },
            { status: 400 }
        );

    } catch {
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 }
        );
    }
}
