// ScoutEdge Type Definitions
// Comprehensive type system for scouting reports

import { z } from "zod";

// ============================================================================
// Base Entities
// ============================================================================

export interface Team {
    id: string;
    name: string;
    region?: string;
    logo?: string;
}

export interface Player {
    id: string;
    name: string;
    teamId: string;
    role?: string;
    agentPool?: string[];
}

export interface Map {
    id: string;
    name: string;
}

export interface Round {
    roundNumber: number;
    winner: "attack" | "defense";
    site?: string;
    roundType: "pistol" | "eco" | "force" | "full";
    playerStats?: Record<string, {
        kills: number;
        deaths: number;
        assists: number;
    }>;
}

export interface Match {
    id: string;
    date: string;
    teamId: string;
    opponentId: string;
    opponentName: string;
    map: string;
    rounds: Round[];
    score: {
        team: number;
        opponent: number;
    };
    won: boolean;
}

// ============================================================================
// Insights & Evidence
// ============================================================================

export interface Evidence {
    metric: string;              // Definition of what was measured
    sampleSize: {
        matches: number;
        rounds?: number;
    };
    numerator: number;           // Count of occurrences
    denominator: number;         // Total opportunities
    matchIds: string[];          // Supporting match IDs
    details?: any;               // Optional: charts, tables, etc.
}

export interface Insight {
    id: string;                  // Stable, deterministic ID
    category: "team" | "player" | "comp" | "exploit";
    title: string;               // Short title
    claim: string;               // One-liner explanation
    value: string | number;      // Display value (e.g., "73%" or 0.73)
    confidence: number;          // 0-100
    evidence: Evidence;
}

export interface Counter {
    id: string;
    title: string;
    condition: string;           // When to apply (e.g., "When opponent forces")
    action: string;              // What to do
    expectedOutcome: string;     // Expected result
    confidence: number;          // 0-100
    evidence: Evidence;
}

// ============================================================================
// Scouting Report
// ============================================================================

export interface OverviewSection {
    teamName: string;
    teamId: string;
    matchWindow: {
        first: string;             // ISO date
        last: string;              // ISO date
    };
    matchesAnalyzed: number;
    mapsPlayed: string[];
    overallWinRate: number;
}

export interface ScoutingReport {
    metadata: {
        reportId: string;
        teamId: string;
        teamName: string;
        generatedAt: string;       // ISO timestamp
        mode: "demo" | "live";
        lastN: number;
    };
    sections: {
        overview: OverviewSection;
        teamInsights: Insight[];    // 5 insights
        playerInsights: Insight[];  // 4 insights
        compInsights: Insight[];    // 2 insights
        exploits: Insight[];        // 1 red flag
        howToWin: Counter[];        // 3-5 counters
    };
}

// ============================================================================
// API Contracts
// ============================================================================

export interface APIResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
    meta?: {
        cached: boolean;
        generatedAt: string;
    };
}

export interface GenerateReportRequest {
    teamId: string;
    lastN: number;
    mode: "demo" | "live";
}

export interface TeamSearchResult {
    id: string;
    name: string;
    region: string;
    logo?: string;
}

// ============================================================================
// Zod Schemas (for validation)
// ============================================================================

export const TeamSchema = z.object({
    id: z.string(),
    name: z.string(),
    region: z.string().optional(),
    logo: z.string().optional(),
});

export const MatchSchema = z.object({
    id: z.string(),
    date: z.string(),
    teamId: z.string(),
    opponentId: z.string(),
    opponentName: z.string(),
    map: z.string(),
    rounds: z.array(z.any()),
    score: z.object({
        team: z.number(),
        opponent: z.number(),
    }),
    won: z.boolean(),
});

export const InsightSchema = z.object({
    id: z.string(),
    category: z.enum(["team", "player", "comp", "exploit"]),
    title: z.string(),
    claim: z.string(),
    value: z.union([z.string(), z.number()]),
    confidence: z.number().min(0).max(100),
    evidence: z.object({
        metric: z.string(),
        sampleSize: z.object({
            matches: z.number(),
            rounds: z.number().optional(),
        }),
        numerator: z.number(),
        denominator: z.number(),
        matchIds: z.array(z.string()),
        details: z.any().optional(),
    }),
});

export const ScoutingReportSchema = z.object({
    metadata: z.object({
        reportId: z.string(),
        teamId: z.string(),
        teamName: z.string(),
        generatedAt: z.string(),
        mode: z.enum(["demo", "live"]),
        lastN: z.number(),
    }),
    sections: z.object({
        overview: z.any(),
        teamInsights: z.array(InsightSchema),
        playerInsights: z.array(InsightSchema),
        compInsights: z.array(InsightSchema),
        exploits: z.array(InsightSchema),
        howToWin: z.array(z.any()),
    }),
});

export const GenerateReportRequestSchema = z.object({
    teamId: z.string(),
    lastN: z.number().min(5).max(20),
    mode: z.enum(["demo", "live"]),
});
