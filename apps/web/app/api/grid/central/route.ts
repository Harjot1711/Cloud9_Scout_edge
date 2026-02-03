import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// GRID CENTRAL DATA API PROXY
// ============================================================================
// Server-side proxy for GRID Central Data GraphQL API
// Keeps API key secure on server, provides typed responses
// ============================================================================

const GRID_CENTRAL_API = process.env.GRID_CENTRAL_API || "https://api-op.grid.gg/central-data/graphql";
const TIMEOUT_MS = parseInt(process.env.GRID_TIMEOUT_MS || "10000", 10);

// ============================================================================
// PREDEFINED QUERIES
// ============================================================================

const QUERIES: Record<string, string> = {
    // Get all available game titles
    GetTitles: `
        query GetTitles {
            titles {
                id
                name
                nameShortened
            }
        }
    `,

    // Get tournaments by title ID
    GetTournaments: `
        query GetTournaments($titleId: ID!, $first: Int = 50) {
            tournaments(first: $first, filter: { titleId: $titleId }) {
                edges {
                    node {
                        id
                        name
                        nameShortened
                        startDate
                        endDate
                        logoUrl
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    `,

    // Get series by tournament - using allSeries with proper filter per GRID docs
    GetSeriesByTournament: `
        query GetSeriesByTournament($filter: SeriesFilter!, $first: Int = 50, $after: String) {
            allSeries(
                first: $first
                after: $after
                filter: $filter
                orderBy: StartTimeScheduled
            ) {
                totalCount
                edges {
                    node {
                        id
                        startTimeScheduled
                        teams {
                            baseInfo {
                                id
                                name
                                logoUrl
                            }
                        }
                        tournament {
                            id
                            name
                        }
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    `,

    // Get series details
    GetSeriesDetails: `
        query GetSeriesDetails($seriesId: ID!) {
            series(first: 1, filter: { id: $seriesId }) {
                edges {
                    node {
                        id
                        format {
                            type
                            bestOf
                        }
                        startTimeScheduled
                        startTimeActual
                        tournament {
                            id
                            name
                            logoUrl
                        }
                        title {
                            id
                            name
                        }
                        teams {
                            id
                            name
                            nameShortened
                            logoUrl
                            colorPrimary
                            players {
                                id
                                nickname
                            }
                        }
                    }
                }
            }
        }
    `,

    // Search teams
    SearchTeams: `
        query SearchTeams($query: String!, $first: Int = 20) {
            teams(first: $first, filter: { name: { contains: $query } }) {
                edges {
                    node {
                        id
                        name
                        nameShortened
                        logoUrl
                        colorPrimary
                        colorSecondary
                    }
                }
            }
        }
    `,

    // Get team details with recent series
    GetTeamDetails: `
        query GetTeamDetails($teamId: ID!) {
            teams(first: 1, filter: { id: $teamId }) {
                edges {
                    node {
                        id
                        name
                        nameShortened
                        logoUrl
                        colorPrimary
                        colorSecondary
                        players {
                            id
                            nickname
                        }
                    }
                }
            }
        }
    `,

    // Get recent series for a team
    GetTeamSeries: `
        query GetTeamSeries($teamId: ID!, $first: Int = 20) {
            series(
                first: $first
                filter: { teamIds: [$teamId] }
                orderBy: { field: START_TIME_SCHEDULED, direction: DESC }
            ) {
                edges {
                    node {
                        id
                        format {
                            type
                            bestOf
                        }
                        startTimeScheduled
                        tournament {
                            id
                            name
                        }
                        teams {
                            id
                            name
                            nameShortened
                            logoUrl
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
            console.warn("[GRID Central] API key not configured");
            return NextResponse.json(
                { error: "GRID API key not configured" },
                { status: 503 }
            );
        }

        const body = await request.json();
        const { operation, variables = {} } = body;

        // Get predefined query or use custom
        const query = QUERIES[operation] || body.query;

        if (!query) {
            return NextResponse.json(
                { error: `Unknown operation: ${operation}` },
                { status: 400 }
            );
        }

        // Execute with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        try {
            const response = await fetch(GRID_CENTRAL_API, {
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
                console.error(`[GRID Central] API error: ${response.status}`);
                return NextResponse.json(
                    { error: `GRID API error: ${response.status}` },
                    { status: response.status }
                );
            }

            const data = await response.json();

            if (data.errors?.length > 0) {
                console.error("[GRID Central] GraphQL errors:", data.errors);
                return NextResponse.json(
                    { error: data.errors[0].message, errors: data.errors },
                    { status: 400 }
                );
            }

            return NextResponse.json({
                success: true,
                data: data.data,
                operation,
            });

        } catch (fetchError) {
            clearTimeout(timeoutId);

            if (fetchError instanceof Error && fetchError.name === "AbortError") {
                return NextResponse.json(
                    { error: "GRID API timeout" },
                    { status: 504 }
                );
            }

            console.error("[GRID Central] Fetch error:", fetchError);
            return NextResponse.json(
                { error: "GRID API unreachable" },
                { status: 503 }
            );
        }

    } catch (error) {
        console.error("[GRID Central] Request error:", error);
        return NextResponse.json(
            { error: "Invalid request" },
            { status: 400 }
        );
    }
}
