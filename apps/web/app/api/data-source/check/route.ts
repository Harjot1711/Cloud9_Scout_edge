import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// DATA SOURCE CHECK API
// ============================================================================
// Server-side endpoint to check GRID availability
// API key never exposed to client
// ============================================================================

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { source } = body;

        if (source === "demo") {
            return NextResponse.json({ available: true, source: "demo" });
        }

        if (source === "grid") {
            // Check if GRID is configured
            const apiKey = process.env.GRID_API_KEY;
            const enabled = process.env.ENABLE_GRID_INTEGRATION === "true";

            if (!enabled) {
                return NextResponse.json({
                    available: false,
                    source: "grid",
                    error: "GRID integration not enabled"
                });
            }

            if (!apiKey) {
                return NextResponse.json({
                    available: false,
                    source: "grid",
                    error: "GRID API key not configured"
                });
            }

            // Health check GRID API
            const centralApi = process.env.GRID_CENTRAL_API || "https://api-op.grid.gg/central-data/graphql";
            const timeoutMs = parseInt(process.env.GRID_TIMEOUT_MS || "10000", 10);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

            try {
                const response = await fetch(centralApi, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": apiKey,
                    },
                    body: JSON.stringify({
                        query: `query HealthCheck { __typename }`,
                    }),
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    if (!data.errors) {
                        return NextResponse.json({
                            available: true,
                            source: "grid",
                            latencyMs: Date.now()
                        });
                    }
                }

                return NextResponse.json({
                    available: false,
                    source: "grid",
                    error: `GRID API returned ${response.status}`
                });

            } catch (fetchError) {
                clearTimeout(timeoutId);

                if (fetchError instanceof Error && fetchError.name === "AbortError") {
                    return NextResponse.json({
                        available: false,
                        source: "grid",
                        error: "GRID API timeout"
                    });
                }

                return NextResponse.json({
                    available: false,
                    source: "grid",
                    error: "GRID API unreachable"
                });
            }
        }

        return NextResponse.json({
            available: false,
            error: "Unknown data source"
        });

    } catch {
        return NextResponse.json({
            available: false,
            error: "Request failed"
        }, { status: 400 });
    }
}
