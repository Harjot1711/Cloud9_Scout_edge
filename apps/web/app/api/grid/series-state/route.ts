import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// GRID SERIES STATE API PROXY
// ============================================================================
// Server-side proxy for GRID Series State GraphQL API
// Returns post-match stats, player performance, game summaries
// ============================================================================

const GRID_SERIES_STATE_API = process.env.GRID_SERIES_STATE_API || "https://api-op.grid.gg/live-data-feed/series-state/graphql";
const TIMEOUT_MS = parseInt(process.env.GRID_TIMEOUT_MS || "10000", 10);

// In-memory cache for series state (immutable after completion)
const stateCache = new Map<string, { data: unknown; cachedAt: number }>();
const CACHE_TTL_MS = parseInt(process.env.GRID_CACHE_TTL_SECONDS || "300", 10) * 1000;

// ============================================================================
// PREDEFINED QUERIES
// ============================================================================

const QUERIES: Record<string, string> = {
    // Full series state - based on GRID hackathon docs
    GetSeriesState: `
        query GetSeriesState($seriesId: ID!) {
            seriesState(id: $seriesId) {
                id
                started
                finished
                teams {
                    id
                    name
                    won
                    score
                }
                games {
                    id
                    map {
                        name
                    }
                    teams {
                        id
                        name
                        won
                        players {
                            id
                            name
                            kills
                            deaths
                            character {
                                name
                            }
                        }
                    }
                }
            }
        }
    `,

    // Lightweight series summary
    GetSeriesSummary: `
        query GetSeriesSummary($seriesId: ID!) {
            seriesState(id: $seriesId) {
                id
                started
                finished
                startedAt
                finishedAt
                
                teams {
                    id
                    name
                    score
                    won
                }
                
                games {
                    sequenceNumber
                    finished
                    map {
                        name
                    }
                    teams {
                        id
                        won
                    }
                }
            }
        }
    `,

    // Player stats only
    GetPlayerStats: `
        query GetPlayerStats($seriesId: ID!) {
            seriesState(id: $seriesId) {
                id
                teams {
                    id
                    name
                    players {
                        id
                        name
                        kills
                        deaths
                        assists
                        
                        character {
                            id
                            name
                        }
                        
                        statsByGame {
                            gameNumber
                            kills
                            deaths
                            assists
                            damageDealt
                        }
                    }
                }
            }
        }
    `,
};

// ============================================================================
// ROUTE HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.GRID_API_KEY;

        if (!apiKey) {
            console.warn("[GRID SeriesState] API key not configured");
            return NextResponse.json(
                { error: "GRID API key not configured" },
                { status: 503 }
            );
        }

        const body = await request.json();
        const { operation, variables = {} } = body;
        const seriesId = variables.seriesId;

        // Get predefined query
        const query = QUERIES[operation];

        if (!query) {
            return NextResponse.json(
                { error: `Unknown operation: ${operation}` },
                { status: 400 }
            );
        }

        // Check cache for this series
        const cacheKey = `${operation}:${seriesId}`;
        const cached = stateCache.get(cacheKey);

        if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
            return NextResponse.json({
                success: true,
                data: cached.data,
                operation,
                cached: true,
            });
        }

        // Execute with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        try {
            const response = await fetch(GRID_SERIES_STATE_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey,
                },
                body: JSON.stringify({ query, variables }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                console.error(`[GRID SeriesState] API error: ${response.status}`);
                return NextResponse.json(
                    { error: `GRID API error: ${response.status}` },
                    { status: response.status }
                );
            }

            const data = await response.json();

            if (data.errors?.length > 0) {
                console.error("[GRID SeriesState] GraphQL errors:", data.errors);
                return NextResponse.json(
                    { error: data.errors[0].message, errors: data.errors },
                    { status: 400 }
                );
            }

            // Cache the result
            stateCache.set(cacheKey, {
                data: data.data,
                cachedAt: Date.now(),
            });

            return NextResponse.json({
                success: true,
                data: data.data,
                operation,
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

            console.error("[GRID SeriesState] Fetch error:", fetchError);
            return NextResponse.json(
                { error: "GRID API unreachable" },
                { status: 503 }
            );
        }

    } catch (error) {
        console.error("[GRID SeriesState] Request error:", error);
        return NextResponse.json(
            { error: "Invalid request" },
            { status: 400 }
        );
    }
}
