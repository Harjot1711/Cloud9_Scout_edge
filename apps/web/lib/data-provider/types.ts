// ============================================================================
// SCOUTEDGE — DATA PROVIDER TYPES
// ============================================================================
// Unified interface for both Demo and GRID data sources
// ============================================================================

// ============================================================================
// CORE TYPES
// ============================================================================

export type DataSource = "demo" | "grid";

export interface DataSourceConfig {
    source: DataSource;
    isAvailable: boolean;
    lastChecked: Date | null;
    error?: string;
}

// ============================================================================
// DIRECTORY TYPES (Central Data API)
// ============================================================================

export interface GameTitle {
    id: string;
    name: string;
    nameShortened?: string;
}

export interface Tournament {
    id: string;
    name: string;
    nameShortened?: string;
    startDate: string;
    endDate?: string;
    logoUrl?: string;
    region?: string;
    tier?: string;
}

export interface Team {
    id: string;
    name: string;
    shortName?: string;
    logo?: string;
    logoUrl?: string;
    colorPrimary?: string;
    colorSecondary?: string;
    region?: string;
    externalLinks?: {
        vlr?: string;
        liquipedia?: string;
        opgg?: string;
        leaguepedia?: string;
    };
}

export interface Series {
    id: string;
    tournamentId: string;
    tournamentName: string;
    titleId?: string;
    titleName?: string;
    format?: {
        type: string;
        bestOf: number;
    };
    teams: [Team, Team] | Team[];
    startTime: string;
    startTimeActual?: string;
    status: "upcoming" | "live" | "completed";
    score?: [number, number];
}

// ============================================================================
// SERIES STATE TYPES (Series State API)
// ============================================================================

export interface SeriesState {
    id: string;
    titleId?: string;
    titleName?: string;
    format?: {
        type: string;
        bestOf: number;
    };
    started: boolean;
    finished: boolean;
    startedAt?: string;
    finishedAt?: string;
    teams: SeriesTeamState[];
    games: GameState[];
}

export interface SeriesTeamState {
    id: string;
    name: string;
    score: number;
    won: boolean;
    side?: string;
    kills?: number;
    deaths?: number;
    assists?: number;
    players: PlayerState[];
}

export interface PlayerState {
    id: string;
    name: string;
    nickname?: string;
    character?: {
        id: string;
        name: string;
    };
    kills?: number;
    deaths?: number;
    assists?: number;
    damageDealt?: number;
    statsByGame?: {
        gameNumber: number;
        kills: number;
        deaths: number;
        assists: number;
        damageDealt?: number;
    }[];
}

export interface GameState {
    id: string;
    sequenceNumber: number;
    started: boolean;
    finished: boolean;
    startedAt?: string;
    finishedAt?: string;
    map?: {
        id: string;
        name: string;
    };
    teams: {
        id: string;
        name?: string;
        score: number;
        won: boolean;
        side?: string;
    }[];
    players?: PlayerState[];
}

// ============================================================================
// FILE DOWNLOAD TYPES
// ============================================================================

export interface FileInfo {
    type: string;
    fullURL: string;
    name?: string;
    size?: number;
}

export interface TimelineEvent {
    id?: string;
    sequenceNumber?: number;
    type: string;
    timestamp: string;
    gameNumber?: number;
    actor?: {
        type: string;
        id: string;
        name?: string;
        teamId?: string;
    };
    target?: {
        type: string;
        id: string;
        name?: string;
        teamId?: string;
    };
    position?: {
        x: number;
        y: number;
        z?: number;
    };
    payload?: Record<string, unknown>;
}

// ============================================================================
// SCOUTING REPORT TYPES
// ============================================================================

export interface ScoutingReportInput {
    opponentTeamId: string;
    opponentTeamName: string;
    gameTitle: "valorant" | "league_of_legends";
    dateRange?: {
        start: string;
        end: string;
    };
    matchCount?: number;
    seriesIds?: string[];  // Specific series to analyze
}

export interface PlayerProfile {
    id: string;
    ign: string;
    realName?: string;
    role: string;
    agents?: string[];  // Valorant
    champions?: string[]; // LoL
    tendencies: string[];
    stats?: {
        kills: number;
        deaths: number;
        assists: number;
        kda?: number;
    };
    externalLinks?: {
        vlr?: string;
        liquipedia?: string;
        opgg?: string;
        leaguepedia?: string;
    };
}

export interface InsightEvidence {
    metric: string;
    definition: string;
    sampleSize: {
        matches: number;
        rounds?: number;
        games?: number;
    };
    numerator: number;
    denominator: number;
    matchIds: string[];
    seriesIds?: string[];  // GRID series IDs
    dataSource: DataSource;
    rawPayload?: Record<string, unknown>;
    timelineAnchor?: {
        seriesId: string;
        eventIndex?: number;
    };
    externalLinks?: {
        vlr?: string;
        liquipedia?: string;
        opgg?: string;
        leaguepedia?: string;
        grid?: string;
    };
}

export interface Insight {
    id: string;
    category: "critical_weakness" | "key_strength" | "tactical_pattern" | "economy_tendency" | "how_to_win";
    severity: "critical" | "high" | "medium" | "low";
    title: string;
    claim: string;
    value: string;
    confidence: number;
    evidence: InsightEvidence;
    actionable?: string;
}

export interface ScoutingReport {
    id: string;
    generatedAt: string;
    dataSource: DataSource;
    opponent: {
        id: string;
        name: string;
        logo?: string;
        region?: string;
    };
    gameTitle: "valorant" | "league_of_legends";
    dateRange: {
        start: string;
        end: string;
    };
    matchCount: number;
    seriesIds: string[];  // GRID series IDs when using live data
    roster: PlayerProfile[];
    insights: Insight[];
    summary?: {
        criticalWeaknesses: number;
        keyStrengths: number;
        tacticalPatterns: number;
        economyTendencies: number;
        overallConfidence: number;
    };
}

// ============================================================================
// PROVIDER INTERFACE
// ============================================================================

export interface ScoutingDataProvider {
    readonly source: DataSource;

    // Health check
    checkAvailability(): Promise<boolean>;

    // Core scouting
    getScoutingReport(input: ScoutingReportInput): Promise<ScoutingReport>;
    getEvidence(insightId: string, reportId: string): Promise<InsightEvidence>;

    // Team discovery
    searchTeams(query: string, gameTitle?: string): Promise<Team[]>;
    getTeam(teamId: string): Promise<Team | null>;

    // Directory data (Central Data API)
    getDirectoryTitles?(): Promise<GameTitle[]>;
    getTournaments?(titleId: string): Promise<Tournament[]>;
    getSeriesByTournament?(tournamentId: string, options?: { first?: number; after?: string }): Promise<{ series: Series[]; hasMore: boolean; cursor?: string }>;
    getSeriesDetails?(seriesId: string): Promise<Series | null>;
    getRecentSeries?(teamId: string, limit?: number): Promise<Series[]>;

    // Series State data (Series State API)
    getSeriesState?(seriesId: string): Promise<SeriesState | null>;
    getSeriesSummary?(seriesId: string): Promise<SeriesState | null>;
    getPlayerStats?(seriesId: string): Promise<SeriesTeamState[] | null>;

    // File Download data (File Download API)
    getFileList?(seriesId: string): Promise<FileInfo[]>;
    getTimelineEvents?(seriesId: string): Promise<TimelineEvent[]>;
    getEndState?(seriesId: string): Promise<Record<string, unknown> | null>;
}

// ============================================================================
// PROVIDER RESULT WRAPPER
// ============================================================================

export interface ProviderResult<T> {
    success: boolean;
    data?: T;
    error?: string;
    source: DataSource;
    fallbackUsed: boolean;
    latencyMs: number;
}

