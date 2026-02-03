// ============================================================================
// SCOUTEDGE — DEMO DATA PROVIDER
// ============================================================================
// Uses local JSON fixtures - always available, no network required
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
    DataSource
} from "./types";

// ============================================================================
// DEMO DATA FIXTURES
// ============================================================================

const DEMO_TEAMS: Team[] = [
    {
        id: "phantom-tactics",
        name: "Phantom Tactics",
        shortName: "PT",
        region: "NA",
        externalLinks: { vlr: "https://www.vlr.gg/team/phantom-tactics", liquipedia: "https://liquipedia.net/valorant/Phantom_Tactics" }
    },
    {
        id: "shadow-strike",
        name: "Shadow Strike Gaming",
        shortName: "SSG",
        region: "EU",
        externalLinks: { vlr: "https://www.vlr.gg/team/shadow-strike", liquipedia: "https://liquipedia.net/valorant/Shadow_Strike_Gaming" }
    },
    {
        id: "nova-esports",
        name: "Nova Esports",
        shortName: "NOVA",
        region: "KR",
        externalLinks: { vlr: "https://www.vlr.gg/team/nova-esports", liquipedia: "https://liquipedia.net/valorant/Nova_Esports" }
    },
    {
        id: "crimson-force",
        name: "Crimson Force",
        shortName: "CF",
        region: "APAC",
        externalLinks: { vlr: "https://www.vlr.gg/team/crimson-force", liquipedia: "https://liquipedia.net/valorant/Crimson_Force" }
    },
    {
        id: "azure-dragons",
        name: "Azure Dragons",
        shortName: "AZD",
        region: "CN",
        externalLinks: { vlr: "https://www.vlr.gg/team/azure-dragons", liquipedia: "https://liquipedia.net/valorant/Azure_Dragons" }
    },
];

const DEMO_TITLES: GameTitle[] = [
    { id: "valorant", name: "VALORANT", nameShortened: "VAL" },
    { id: "lol", name: "League of Legends", nameShortened: "LoL" },
];

const DEMO_TOURNAMENTS: Tournament[] = [
    { id: "demo-vct-2024", name: "VCT Champions 2024", startDate: "2024-08-01", endDate: "2024-08-25", region: "International", tier: "S" },
    { id: "demo-lcs-spring", name: "LCS Spring 2024", startDate: "2024-01-20", endDate: "2024-04-14", region: "NA", tier: "A" },
    { id: "demo-challengers", name: "VCT Challengers NA", startDate: "2024-02-01", endDate: "2024-06-30", region: "NA", tier: "B" },
];

const DEMO_SERIES: Series[] = [
    {
        id: "demo-series-001",
        tournamentId: "demo-vct-2024",
        tournamentName: "VCT Champions 2024",
        format: { type: "BO3", bestOf: 3 },
        startTime: "2024-08-15T18:00:00Z",
        status: "completed",
        teams: [DEMO_TEAMS[0], DEMO_TEAMS[1]],
        score: [2, 1],
    },
    {
        id: "demo-series-002",
        tournamentId: "demo-vct-2024",
        tournamentName: "VCT Champions 2024",
        format: { type: "BO3", bestOf: 3 },
        startTime: "2024-08-14T15:00:00Z",
        status: "completed",
        teams: [DEMO_TEAMS[2], DEMO_TEAMS[0]],
        score: [1, 2],
    },
    {
        id: "demo-series-003",
        tournamentId: "demo-vct-2024",
        tournamentName: "VCT Champions 2024",
        format: { type: "BO3", bestOf: 3 },
        startTime: "2024-08-13T20:00:00Z",
        status: "completed",
        teams: [DEMO_TEAMS[1], DEMO_TEAMS[3]],
        score: [2, 0],
    },
];

const generateDemoReport = (input: ScoutingReportInput): ScoutingReport => {
    const team = DEMO_TEAMS.find(t => t.id === input.opponentTeamId) || DEMO_TEAMS[0];
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
        id: `demo-report-${Date.now()}`,
        generatedAt: now.toISOString(),
        dataSource: "demo",
        opponent: {
            id: team.id,
            name: team.name,
            logo: undefined,
            region: team.region,
        },
        gameTitle: input.gameTitle,
        dateRange: {
            start: input.dateRange?.start || thirtyDaysAgo.toISOString().split("T")[0],
            end: input.dateRange?.end || now.toISOString().split("T")[0],
        },
        matchCount: input.matchCount || 15,
        seriesIds: ["demo-series-001", "demo-series-002", "demo-series-003"],
        roster: [
            {
                id: "player-1",
                ign: "Viper_Main",
                realName: "Alex Chen",
                role: "Controller",
                agents: ["Viper", "Brimstone", "Omen"],
                tendencies: ["Late rotates on defense", "Heavy lineups on Ascent", "Economy-focused"],
                externalLinks: { vlr: "https://www.vlr.gg/player/viper-main" },
            },
            {
                id: "player-2",
                ign: "FlashBang",
                realName: "Marcus Johnson",
                role: "Initiator",
                agents: ["Sova", "Fade", "KAY/O"],
                tendencies: ["Aggressive early clears", "Drone-heavy on Haven", "High ADR"],
                externalLinks: { vlr: "https://www.vlr.gg/player/flashbang" },
            },
            {
                id: "player-3",
                ign: "Entry_King",
                realName: "Kim Sung-woo",
                role: "Duelist",
                agents: ["Jett", "Raze", "Phoenix"],
                tendencies: ["Window pushes on Bind", "Fast operator peeks", "Trade-focused"],
                externalLinks: { vlr: "https://www.vlr.gg/player/entry-king" },
            },
            {
                id: "player-4",
                ign: "SilentWall",
                realName: "Emma Rodriguez",
                role: "Sentinel",
                agents: ["Cypher", "Killjoy", "Sage"],
                tendencies: ["Late trips on B site", "Passive anchor", "High clutch rate"],
                externalLinks: { vlr: "https://www.vlr.gg/player/silentwall" },
            },
            {
                id: "player-5",
                ign: "X_Factor",
                realName: "David Park",
                role: "Flex",
                agents: ["Skye", "Breach", "Astra"],
                tendencies: ["Off-angle holder", "Aggressive flashes", "Eco specialist"],
                externalLinks: { vlr: "https://www.vlr.gg/player/x-factor" },
            },
        ],
        insights: [
            {
                id: "insight-1",
                category: "critical_weakness",
                severity: "critical",
                title: "B Site Defense Collapse",
                claim: `${team.name} loses 73% of B site retakes when Viper ult is unavailable`,
                value: "73%",
                confidence: 92,
                evidence: {
                    metric: "B Site Retake Success Rate (No Viper Ult)",
                    definition: "Percentage of rounds where the team successfully retakes B site when Viper ultimate is not available.",
                    sampleSize: { matches: 15, rounds: 89 },
                    numerator: 24,
                    denominator: 89,
                    matchIds: ["demo-match-001", "demo-match-002", "demo-match-003"],
                    seriesIds: ["demo-series-001", "demo-series-002"],
                    dataSource: "demo",
                    externalLinks: { vlr: "https://www.vlr.gg/stats" },
                },
                actionable: "Force fights to burn Viper ult early, then execute B",
            },
            {
                id: "insight-2",
                category: "critical_weakness",
                severity: "high",
                title: "Eco Round Predictability",
                claim: `${team.name} runs Marshal on eco 89% of the time on Ascent`,
                value: "89%",
                confidence: 88,
                evidence: {
                    metric: "Eco Round Weapon Selection (Ascent)",
                    definition: "Weapon selection patterns during economy rounds on Ascent map.",
                    sampleSize: { matches: 8, rounds: 34 },
                    numerator: 30,
                    denominator: 34,
                    matchIds: ["demo-match-004", "demo-match-005"],
                    dataSource: "demo",
                },
                actionable: "Play close angles on eco rounds to counter Marshal",
            },
            {
                id: "insight-3",
                category: "key_strength",
                severity: "high",
                title: "First Blood Conversion",
                claim: `${team.name} converts first blood to round win at 81% rate`,
                value: "81%",
                confidence: 95,
                evidence: {
                    metric: "First Blood to Round Win Conversion",
                    definition: "Percentage of rounds won when team gets first blood.",
                    sampleSize: { matches: 15, rounds: 156 },
                    numerator: 126,
                    denominator: 156,
                    matchIds: ["demo-match-001", "demo-match-002", "demo-match-003", "demo-match-004", "demo-match-005"],
                    dataSource: "demo",
                },
            },
            {
                id: "insight-4",
                category: "tactical_pattern",
                severity: "medium",
                title: "Split Execute Timing",
                claim: `${team.name} executes Split A within first 45 seconds 67% of the time`,
                value: "67%",
                confidence: 78,
                evidence: {
                    metric: "Execute Timing Distribution (Split A Site)",
                    definition: "Time distribution of A site executes on Split map.",
                    sampleSize: { matches: 6, rounds: 42 },
                    numerator: 28,
                    denominator: 42,
                    matchIds: ["demo-match-006"],
                    dataSource: "demo",
                },
                actionable: "Stack A early on Split or play retake",
            },
            {
                id: "insight-5",
                category: "how_to_win",
                severity: "high",
                title: "Counter Strategy: Force Rotates",
                claim: "Create mid pressure to force early rotates, then hit opposite site",
                value: "Strategy",
                confidence: 85,
                evidence: {
                    metric: "Rotation Time Analysis",
                    definition: "Average rotation time when mid control is contested vs uncontested.",
                    sampleSize: { matches: 15, rounds: 230 },
                    numerator: 4,
                    denominator: 7,
                    matchIds: ["demo-match-001", "demo-match-002", "demo-match-003"],
                    dataSource: "demo",
                },
                actionable: "Take mid control, fake execute, then rotate opposite",
            },
        ],
        summary: {
            criticalWeaknesses: 2,
            keyStrengths: 1,
            tacticalPatterns: 1,
            economyTendencies: 1,
            overallConfidence: 87,
        },
    };
};

// ============================================================================
// DEMO PROVIDER IMPLEMENTATION
// ============================================================================

export class DemoDataProvider implements ScoutingDataProvider {
    readonly source: DataSource = "demo";

    async checkAvailability(): Promise<boolean> {
        // Demo data is always available
        return true;
    }

    async getScoutingReport(input: ScoutingReportInput): Promise<ScoutingReport> {
        // Simulate network latency for realism
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
        return generateDemoReport(input);
    }

    async getEvidence(insightId: string, _reportId: string): Promise<InsightEvidence> {
        // Return mock evidence
        await new Promise(resolve => setTimeout(resolve, 100));
        return {
            metric: "Demo Metric",
            definition: "This is demo evidence data.",
            sampleSize: { matches: 10, rounds: 150 },
            numerator: 45,
            denominator: 60,
            matchIds: ["demo-match-001", "demo-match-002"],
            seriesIds: ["demo-series-001"],
            dataSource: "demo",
        };
    }

    async searchTeams(query: string, _gameTitle?: string): Promise<Team[]> {
        await new Promise(resolve => setTimeout(resolve, 100));
        const q = query.toLowerCase();
        return DEMO_TEAMS.filter(t =>
            t.name.toLowerCase().includes(q) ||
            t.shortName?.toLowerCase().includes(q)
        );
    }

    async getTeam(teamId: string): Promise<Team | null> {
        await new Promise(resolve => setTimeout(resolve, 50));
        return DEMO_TEAMS.find(t => t.id === teamId) || null;
    }

    // ============================================================================
    // DIRECTORY DATA (Demo stubs)
    // ============================================================================

    async getDirectoryTitles(): Promise<GameTitle[]> {
        await new Promise(resolve => setTimeout(resolve, 50));
        return DEMO_TITLES;
    }

    async getTournaments(_titleId: string): Promise<Tournament[]> {
        await new Promise(resolve => setTimeout(resolve, 100));
        return DEMO_TOURNAMENTS;
    }

    async getSeriesByTournament(
        tournamentId: string,
        _options: { first?: number; after?: string } = {}
    ): Promise<{ series: Series[]; hasMore: boolean; cursor?: string }> {
        await new Promise(resolve => setTimeout(resolve, 150));
        const filtered = DEMO_SERIES.filter(s => s.tournamentId === tournamentId);
        return { series: filtered, hasMore: false };
    }

    async getSeriesDetails(seriesId: string): Promise<Series | null> {
        await new Promise(resolve => setTimeout(resolve, 100));
        return DEMO_SERIES.find(s => s.id === seriesId) || null;
    }

    async getRecentSeries(teamId: string, limit: number = 20): Promise<Series[]> {
        await new Promise(resolve => setTimeout(resolve, 100));
        return DEMO_SERIES.filter(s =>
            s.teams.some(t => t.id === teamId)
        ).slice(0, limit);
    }

    // ============================================================================
    // SERIES STATE DATA (Demo stubs)
    // ============================================================================

    async getSeriesState(seriesId: string): Promise<SeriesState | null> {
        await new Promise(resolve => setTimeout(resolve, 150));
        const series = DEMO_SERIES.find(s => s.id === seriesId);
        if (!series) return null;

        return {
            id: seriesId,
            titleId: "valorant",
            titleName: "VALORANT",
            format: series.format,
            started: true,
            finished: true,
            startedAt: series.startTime,
            finishedAt: series.startTime,
            teams: series.teams.map((t, i) => ({
                id: t.id,
                name: t.name,
                score: series.score?.[i] || 0,
                won: series.score ? series.score[i] > series.score[1 - i] : false,
                kills: 45 + Math.floor(Math.random() * 20),
                deaths: 40 + Math.floor(Math.random() * 15),
                assists: 25 + Math.floor(Math.random() * 10),
                players: [],
            })),
            games: [
                { id: "game-1", sequenceNumber: 1, started: true, finished: true, map: { id: "ascent", name: "Ascent" }, teams: [], players: [] },
                { id: "game-2", sequenceNumber: 2, started: true, finished: true, map: { id: "haven", name: "Haven" }, teams: [], players: [] },
            ],
        };
    }

    async getSeriesSummary(seriesId: string): Promise<SeriesState | null> {
        return this.getSeriesState(seriesId);
    }

    async getPlayerStats(_seriesId: string): Promise<SeriesTeamState[] | null> {
        await new Promise(resolve => setTimeout(resolve, 100));
        return null;
    }

    // ============================================================================
    // FILE DOWNLOAD DATA (Demo stubs)
    // ============================================================================

    async getFileList(_seriesId: string): Promise<FileInfo[]> {
        await new Promise(resolve => setTimeout(resolve, 50));
        return [
            { type: "events", fullURL: "demo://events.jsonl", name: "events.jsonl" },
            { type: "end_state", fullURL: "demo://end_state.json", name: "end_state.json" },
        ];
    }

    async getTimelineEvents(_seriesId: string): Promise<TimelineEvent[]> {
        await new Promise(resolve => setTimeout(resolve, 200));
        return [
            { id: "evt-1", sequenceNumber: 1, type: "round_start", timestamp: "00:01:30", gameNumber: 1 },
            { id: "evt-2", sequenceNumber: 2, type: "kill", timestamp: "00:02:15", gameNumber: 1, actor: { type: "player", id: "p1", name: "Viper_Main", teamId: "phantom-tactics" } },
            { id: "evt-3", sequenceNumber: 3, type: "plant", timestamp: "00:02:45", gameNumber: 1, actor: { type: "player", id: "p3", name: "Entry_King", teamId: "phantom-tactics" } },
            { id: "evt-4", sequenceNumber: 4, type: "round_end", timestamp: "00:03:30", gameNumber: 1 },
        ];
    }

    async getEndState(_seriesId: string): Promise<Record<string, unknown> | null> {
        await new Promise(resolve => setTimeout(resolve, 100));
        return { demoEndState: true, finalScore: [13, 11] };
    }
}

// Export singleton instance
export const demoProvider = new DemoDataProvider();

