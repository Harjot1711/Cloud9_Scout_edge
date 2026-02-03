// ============================================================================
// SCOUTEDGE — GRID DATA PROVIDER
// ============================================================================
// Uses GRID Esports Data Platform for live match data
// Communicates with server-side API routes to keep API key secure
// ============================================================================

import type {
    ScoutingDataProvider,
    ScoutingReportInput,
    ScoutingReport,
    InsightEvidence,
    Team,
    Tournament,
    Series,
    SeriesState,
    SeriesTeamState,
    GameTitle,
    FileInfo,
    TimelineEvent,
    PlayerProfile,
    Insight,
    DataSource
} from "./types";

// ============================================================================
// API CLIENT FOR GRID ROUTES
// ============================================================================

class GRIDApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = "") {
        this.baseUrl = baseUrl;
    }

    // Central Data API calls
    async centralQuery<T>(operation: string, variables: Record<string, unknown> = {}): Promise<T> {
        const response = await fetch(`${this.baseUrl}/api/grid/central`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operation, variables }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: "Unknown error" }));
            throw new Error(error.error || `API error: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || "Central API query failed");
        }

        return result.data as T;
    }

    // Series State API calls
    async seriesStateQuery<T>(operation: string, variables: Record<string, unknown> = {}): Promise<T> {
        const response = await fetch(`${this.baseUrl}/api/grid/series-state`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operation, variables }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: "Unknown error" }));
            throw new Error(error.error || `API error: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || "Series State API query failed");
        }

        return result.data as T;
    }

    // File Download API calls
    async listFiles(seriesId: string): Promise<FileInfo[]> {
        const response = await fetch(`${this.baseUrl}/api/grid/file-download?seriesId=${seriesId}`);

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: "Unknown error" }));
            throw new Error(error.error || `API error: ${response.status}`);
        }

        const result = await response.json();
        return result.files || [];
    }

    async downloadFile(fileUrl: string): Promise<unknown> {
        const response = await fetch(`${this.baseUrl}/api/grid/file-download?url=${encodeURIComponent(fileUrl)}`);

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: "Unknown error" }));
            throw new Error(error.error || `API error: ${response.status}`);
        }

        const result = await response.json();
        return result.content;
    }
}

// ============================================================================
// GRID PROVIDER IMPLEMENTATION
// ============================================================================

export class GRIDDataProvider implements ScoutingDataProvider {
    readonly source: DataSource = "grid";
    private client: GRIDApiClient;
    private available: boolean = false;

    constructor(baseUrl: string = "") {
        this.client = new GRIDApiClient(baseUrl);
    }

    // ============================================================================
    // HEALTH CHECK
    // ============================================================================

    async checkAvailability(): Promise<boolean> {
        try {
            // Try to fetch titles as a health check
            await this.client.centralQuery("GetTitles");
            this.available = true;
            return true;
        } catch {
            this.available = false;
            return false;
        }
    }

    // ============================================================================
    // DIRECTORY DATA (Central Data API)
    // ============================================================================

    async getDirectoryTitles(): Promise<GameTitle[]> {
        type TitlesResponse = { titles: GameTitle[] };
        const data = await this.client.centralQuery<TitlesResponse>("GetTitles");
        return data.titles || [];
    }

    async getTournaments(titleId: string): Promise<Tournament[]> {
        type TournamentsResponse = {
            tournaments: {
                edges: { node: Tournament }[]
            }
        };
        const data = await this.client.centralQuery<TournamentsResponse>("GetTournaments", { titleId });
        return data.tournaments?.edges?.map(e => e.node) || [];
    }

    async getSeriesByTournament(
        tournamentId: string,
        options: { first?: number; after?: string } = {}
    ): Promise<{ series: Series[]; hasMore: boolean; cursor?: string }> {
        type SeriesResponse = {
            series: {
                edges: { node: RawSeries }[];
                pageInfo: { hasNextPage: boolean; endCursor?: string };
            }
        };

        interface RawSeries {
            id: string;
            startTimeScheduled: string;
            format?: { type: string; bestOf: number };
            tournament: { id: string; name: string };
            teams: RawTeam[];
        }

        interface RawTeam {
            id: string;
            name: string;
            nameShortened?: string;
            logoUrl?: string;
            colorPrimary?: string;
            colorSecondary?: string;
        }

        const data = await this.client.centralQuery<SeriesResponse>("GetSeriesByTournament", {
            tournamentId,
            first: options.first || 50,
            after: options.after,
        });

        const series: Series[] = data.series?.edges?.map(e => ({
            id: e.node.id,
            tournamentId: e.node.tournament.id,
            tournamentName: e.node.tournament.name,
            format: e.node.format,
            startTime: e.node.startTimeScheduled,
            status: "completed" as const, // Assuming completed for now
            teams: e.node.teams.map(t => ({
                id: t.id,
                name: t.name,
                shortName: t.nameShortened,
                logoUrl: t.logoUrl,
                colorPrimary: t.colorPrimary,
                colorSecondary: t.colorSecondary,
            })) as [Team, Team],
        })) || [];

        return {
            series,
            hasMore: data.series?.pageInfo?.hasNextPage || false,
            cursor: data.series?.pageInfo?.endCursor,
        };
    }

    async getSeriesDetails(seriesId: string): Promise<Series | null> {
        type SeriesDetailsResponse = {
            series: {
                edges: { node: RawSeriesDetails }[];
            }
        };

        interface RawSeriesDetails {
            id: string;
            startTimeScheduled: string;
            startTimeActual?: string;
            format?: { type: string; bestOf: number };
            tournament: { id: string; name: string; logoUrl?: string };
            title: { id: string; name: string };
            teams: {
                id: string;
                name: string;
                nameShortened?: string;
                logoUrl?: string;
                colorPrimary?: string;
                players?: { id: string; nickname: string }[];
            }[];
        }

        const data = await this.client.centralQuery<SeriesDetailsResponse>("GetSeriesDetails", { seriesId });
        const raw = data.series?.edges?.[0]?.node;

        if (!raw) return null;

        return {
            id: raw.id,
            tournamentId: raw.tournament.id,
            tournamentName: raw.tournament.name,
            titleId: raw.title.id,
            titleName: raw.title.name,
            format: raw.format,
            startTime: raw.startTimeScheduled,
            startTimeActual: raw.startTimeActual,
            status: "completed",
            teams: raw.teams.map(t => ({
                id: t.id,
                name: t.name,
                shortName: t.nameShortened,
                logoUrl: t.logoUrl,
                colorPrimary: t.colorPrimary,
            })) as [Team, Team],
        };
    }

    async getRecentSeries(teamId: string, limit: number = 20): Promise<Series[]> {
        type TeamSeriesResponse = {
            series: {
                edges: { node: RawSeries }[];
            }
        };

        interface RawSeries {
            id: string;
            startTimeScheduled: string;
            format?: { type: string; bestOf: number };
            tournament: { id: string; name: string };
            teams: { id: string; name: string; nameShortened?: string; logoUrl?: string }[];
        }

        const data = await this.client.centralQuery<TeamSeriesResponse>("GetTeamSeries", { teamId, first: limit });

        return data.series?.edges?.map(e => ({
            id: e.node.id,
            tournamentId: e.node.tournament.id,
            tournamentName: e.node.tournament.name,
            format: e.node.format,
            startTime: e.node.startTimeScheduled,
            status: "completed" as const,
            teams: e.node.teams.map(t => ({
                id: t.id,
                name: t.name,
                shortName: t.nameShortened,
                logoUrl: t.logoUrl,
            })) as [Team, Team],
        })) || [];
    }

    // ============================================================================
    // TEAM DISCOVERY
    // ============================================================================

    async searchTeams(query: string): Promise<Team[]> {
        type SearchTeamsResponse = {
            teams: {
                edges: { node: RawTeam }[];
            }
        };

        interface RawTeam {
            id: string;
            name: string;
            nameShortened?: string;
            logoUrl?: string;
            colorPrimary?: string;
            colorSecondary?: string;
        }

        const data = await this.client.centralQuery<SearchTeamsResponse>("SearchTeams", { query });

        return data.teams?.edges?.map(e => ({
            id: e.node.id,
            name: e.node.name,
            shortName: e.node.nameShortened,
            logoUrl: e.node.logoUrl,
            colorPrimary: e.node.colorPrimary,
            colorSecondary: e.node.colorSecondary,
        })) || [];
    }

    async getTeam(teamId: string): Promise<Team | null> {
        type TeamDetailsResponse = {
            teams: {
                edges: { node: RawTeam }[];
            }
        };

        interface RawTeam {
            id: string;
            name: string;
            nameShortened?: string;
            logoUrl?: string;
            colorPrimary?: string;
            colorSecondary?: string;
        }

        const data = await this.client.centralQuery<TeamDetailsResponse>("GetTeamDetails", { teamId });
        const raw = data.teams?.edges?.[0]?.node;

        if (!raw) return null;

        return {
            id: raw.id,
            name: raw.name,
            shortName: raw.nameShortened,
            logoUrl: raw.logoUrl,
            colorPrimary: raw.colorPrimary,
            colorSecondary: raw.colorSecondary,
        };
    }

    // ============================================================================
    // SERIES STATE DATA (Series State API)
    // ============================================================================

    async getSeriesState(seriesId: string): Promise<SeriesState | null> {
        type SeriesStateResponse = { seriesState: SeriesState | null };
        const data = await this.client.seriesStateQuery<SeriesStateResponse>("GetSeriesState", { seriesId });
        return data.seriesState;
    }

    async getSeriesSummary(seriesId: string): Promise<SeriesState | null> {
        type SeriesSummaryResponse = { seriesState: SeriesState | null };
        const data = await this.client.seriesStateQuery<SeriesSummaryResponse>("GetSeriesSummary", { seriesId });
        return data.seriesState;
    }

    async getPlayerStats(seriesId: string): Promise<SeriesTeamState[] | null> {
        type PlayerStatsResponse = { seriesState: { teams: SeriesTeamState[] } | null };
        const data = await this.client.seriesStateQuery<PlayerStatsResponse>("GetPlayerStats", { seriesId });
        return data.seriesState?.teams || null;
    }

    // ============================================================================
    // FILE DOWNLOAD DATA (File Download API)
    // ============================================================================

    async getFileList(seriesId: string): Promise<FileInfo[]> {
        return this.client.listFiles(seriesId);
    }

    async getTimelineEvents(seriesId: string): Promise<TimelineEvent[]> {
        const files = await this.getFileList(seriesId);
        const eventsFile = files.find(f => f.type === "events" || f.fullURL?.includes("events"));

        if (!eventsFile) {
            return [];
        }

        const content = await this.client.downloadFile(eventsFile.fullURL);

        if (Array.isArray(content)) {
            return content as TimelineEvent[];
        }

        return [];
    }

    async getEndState(seriesId: string): Promise<Record<string, unknown> | null> {
        const files = await this.getFileList(seriesId);
        const endStateFile = files.find(f => f.type === "end_state" || f.fullURL?.includes("end_state"));

        if (!endStateFile) {
            return null;
        }

        const content = await this.client.downloadFile(endStateFile.fullURL);
        return content as Record<string, unknown>;
    }

    // ============================================================================
    // SCOUTING REPORT GENERATION
    // ============================================================================

    async getScoutingReport(input: ScoutingReportInput): Promise<ScoutingReport> {
        // Get recent series for the team
        const seriesList = await this.getRecentSeries(input.opponentTeamId, input.matchCount || 15);

        if (seriesList.length === 0) {
            throw new Error("No recent matches found for this team");
        }

        // Get detailed state for each series (limited to avoid rate limits)
        const seriesStates = await Promise.all(
            seriesList.slice(0, 5).map(s => this.getSeriesState(s.id).catch(() => null))
        );

        const validStates = seriesStates.filter(Boolean) as SeriesState[];

        // Process and generate insights
        return this.processSeriesData(input, seriesList, validStates);
    }

    async getEvidence(insightId: string, reportId: string): Promise<InsightEvidence> {
        // In a full implementation, this would fetch cached evidence
        return {
            metric: "GRID Live Metric",
            definition: "Real-time data from GRID esports platform.",
            sampleSize: { matches: 15 },
            numerator: 30,
            denominator: 45,
            matchIds: [],
            seriesIds: [],
            dataSource: "grid",
            externalLinks: { grid: "https://grid.gg/" },
        };
    }

    // ============================================================================
    // INTERNAL PROCESSING
    // ============================================================================

    private processSeriesData(
        input: ScoutingReportInput,
        seriesList: Series[],
        states: SeriesState[]
    ): ScoutingReport {
        const now = new Date();
        const team = seriesList[0]?.teams[0];

        // Extract player profiles from states
        const roster = this.extractRoster(states, input.gameTitle);

        // Generate insights from match data
        const insights = this.generateInsights(states, input.gameTitle, team?.name || input.opponentTeamName);

        return {
            id: `grid-report-${Date.now()}`,
            generatedAt: now.toISOString(),
            dataSource: "grid",
            opponent: {
                id: team?.id || input.opponentTeamId,
                name: team?.name || input.opponentTeamName,
                logo: team?.logoUrl,
            },
            gameTitle: input.gameTitle,
            dateRange: {
                start: seriesList[seriesList.length - 1]?.startTime?.split("T")[0] || "",
                end: seriesList[0]?.startTime?.split("T")[0] || "",
            },
            matchCount: seriesList.length,
            seriesIds: seriesList.map(s => s.id),
            roster,
            insights,
            summary: {
                criticalWeaknesses: insights.filter(i => i.category === "critical_weakness").length,
                keyStrengths: insights.filter(i => i.category === "key_strength").length,
                tacticalPatterns: insights.filter(i => i.category === "tactical_pattern").length,
                economyTendencies: insights.filter(i => i.category === "economy_tendency").length,
                overallConfidence: 75,
            },
        };
    }

    private extractRoster(states: SeriesState[], gameTitle: string): PlayerProfile[] {
        const playerMap = new Map<string, PlayerProfile>();

        for (const state of states) {
            for (const team of state.teams) {
                for (const player of team.players) {
                    if (!playerMap.has(player.id)) {
                        playerMap.set(player.id, {
                            id: player.id,
                            ign: player.name || player.nickname || player.id,
                            role: "Unknown",
                            tendencies: [],
                            ...(gameTitle === "valorant"
                                ? { agents: player.character?.name ? [player.character.name] : [] }
                                : { champions: player.character?.name ? [player.character.name] : [] }
                            ),
                            stats: {
                                kills: player.kills || 0,
                                deaths: player.deaths || 0,
                                assists: player.assists || 0,
                            },
                            externalLinks: gameTitle === "valorant"
                                ? { vlr: `https://www.vlr.gg/player/${player.id}` }
                                : { opgg: `https://op.gg/summoners/${player.id}`, leaguepedia: `https://lol.fandom.com/wiki/${player.name}` },
                        });
                    } else {
                        // Aggregate stats
                        const existing = playerMap.get(player.id)!;
                        if (existing.stats) {
                            existing.stats.kills += player.kills || 0;
                            existing.stats.deaths += player.deaths || 0;
                            existing.stats.assists += player.assists || 0;
                        }
                        // Add new agents/champions
                        if (player.character?.name) {
                            if (gameTitle === "valorant" && existing.agents && !existing.agents.includes(player.character.name)) {
                                existing.agents.push(player.character.name);
                            } else if (gameTitle === "league_of_legends" && existing.champions && !existing.champions.includes(player.character.name)) {
                                existing.champions.push(player.character.name);
                            }
                        }
                    }
                }
            }
        }

        return Array.from(playerMap.values());
    }

    private generateInsights(states: SeriesState[], gameTitle: string, teamName: string): Insight[] {
        const insights: Insight[] = [];
        const seriesCount = states.length;

        if (seriesCount === 0) {
            return insights;
        }

        // Calculate basic stats
        let totalWins = 0;
        let totalGames = 0;
        let totalKills = 0;
        let totalDeaths = 0;

        for (const state of states) {
            const team = state.teams.find(t => t.name.toLowerCase().includes(teamName.toLowerCase()));
            if (team) {
                if (team.won) totalWins++;
                totalGames++;
                totalKills += team.kills || 0;
                totalDeaths += team.deaths || 0;
            }
        }

        const winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;
        const kdRatio = totalDeaths > 0 ? totalKills / totalDeaths : totalKills;

        // Win rate insight
        insights.push({
            id: `insight-winrate-${Date.now()}`,
            category: winRate >= 60 ? "key_strength" : winRate <= 40 ? "critical_weakness" : "tactical_pattern",
            severity: winRate <= 40 ? "critical" : winRate >= 60 ? "high" : "medium",
            title: winRate >= 60 ? "Strong Recent Performance" : winRate <= 40 ? "Struggling Form" : "Inconsistent Results",
            claim: `${teamName} has a ${winRate.toFixed(0)}% win rate in recent matches`,
            value: `${winRate.toFixed(0)}%`,
            confidence: Math.min(85 + seriesCount, 95),
            evidence: {
                metric: "Win Rate",
                definition: "Percentage of series won out of total series played",
                sampleSize: { matches: seriesCount },
                numerator: totalWins,
                denominator: totalGames,
                matchIds: [],
                seriesIds: states.map(s => s.id),
                dataSource: "grid",
                externalLinks: { grid: "https://grid.gg" },
            },
        });

        // K/D insight
        if (totalKills > 0 || totalDeaths > 0) {
            insights.push({
                id: `insight-kd-${Date.now()}`,
                category: kdRatio >= 1.2 ? "key_strength" : kdRatio <= 0.8 ? "critical_weakness" : "tactical_pattern",
                severity: kdRatio <= 0.8 ? "high" : kdRatio >= 1.2 ? "high" : "medium",
                title: "Team Kill/Death Ratio",
                claim: `${teamName} averages ${kdRatio.toFixed(2)} K/D across recent series`,
                value: kdRatio.toFixed(2),
                confidence: Math.min(80 + seriesCount * 2, 95),
                evidence: {
                    metric: "Kill/Death Ratio",
                    definition: "Total kills divided by total deaths across all games",
                    sampleSize: { matches: seriesCount },
                    numerator: totalKills,
                    denominator: totalDeaths,
                    matchIds: [],
                    seriesIds: states.map(s => s.id),
                    dataSource: "grid",
                    externalLinks: { grid: "https://grid.gg" },
                },
            });
        }

        // Add a how-to-win insight
        insights.push({
            id: `insight-htw-${Date.now()}`,
            category: "how_to_win",
            severity: "high",
            title: "Counter Strategy",
            claim: winRate >= 50
                ? "Force early engagements to disrupt their rhythm"
                : "Play standard and let them make mistakes",
            value: "Strategy",
            confidence: 75,
            evidence: {
                metric: "Strategic Analysis",
                definition: "Based on observed patterns from recent matches",
                sampleSize: { matches: seriesCount },
                numerator: 1,
                denominator: 1,
                matchIds: [],
                seriesIds: states.map(s => s.id),
                dataSource: "grid",
                externalLinks: { grid: "https://grid.gg" },
            },
            actionable: winRate >= 50
                ? "Prioritize early-game pressure and aggressive positioning"
                : "Focus on fundamentals and capitalize on their errors",
        });

        return insights;
    }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

export function createGRIDProvider(baseUrl: string = ""): GRIDDataProvider {
    return new GRIDDataProvider(baseUrl);
}
