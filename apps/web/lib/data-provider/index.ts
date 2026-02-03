// ============================================================================
// SCOUTEDGE — DATA PROVIDER MANAGER
// ============================================================================
// Unified access point for all data operations
// Handles provider selection, fallback, and caching
// ============================================================================

import type {
    ScoutingDataProvider,
    ScoutingReportInput,
    ScoutingReport,
    InsightEvidence,
    Team,
    DataSource,
    ProviderResult,
    DataSourceConfig
} from "./types";
import { demoProvider } from "./demo-provider";
import { createGRIDProvider } from "./grid-provider";

// ============================================================================
// PROVIDER MANAGER
// ============================================================================

class DataProviderManager {
    private currentSource: DataSource = "demo";
    private demoProvider = demoProvider;
    private gridProvider: ScoutingDataProvider | null = null;
    private gridAvailable = false;
    private lastHealthCheck: Date | null = null;

    constructor() {
        this.initializeProviders();
    }

    private async initializeProviders() {
        // Check if GRID should be enabled
        const enableGrid = typeof window !== "undefined"
            ? false // Client-side: never initialize GRID directly
            : process.env.ENABLE_GRID_INTEGRATION === "true";

        if (enableGrid && process.env.GRID_API_KEY) {
            // Create provider with empty baseUrl - it will use relative paths to /api/grid/*
            this.gridProvider = createGRIDProvider("");
            this.gridAvailable = await this.gridProvider.checkAvailability();
            this.lastHealthCheck = new Date();
        }
    }

    // ============================================================================
    // PUBLIC API
    // ============================================================================

    getSourceConfig(): DataSourceConfig {
        return {
            source: this.currentSource,
            isAvailable: this.currentSource === "demo" ? true : this.gridAvailable,
            lastChecked: this.lastHealthCheck,
        };
    }

    async setSource(source: DataSource): Promise<boolean> {
        if (source === "demo") {
            this.currentSource = "demo";
            return true;
        }

        if (source === "grid") {
            if (!this.gridProvider) {
                console.warn("GRID provider not initialized");
                return false;
            }

            const available = await this.gridProvider.checkAvailability();
            this.gridAvailable = available;
            this.lastHealthCheck = new Date();

            if (available) {
                this.currentSource = "grid";
                return true;
            }

            console.warn("GRID not available, staying on demo");
            return false;
        }

        return false;
    }

    getProvider(): ScoutingDataProvider {
        if (this.currentSource === "grid" && this.gridProvider && this.gridAvailable) {
            return this.gridProvider;
        }
        return this.demoProvider;
    }

    // ============================================================================
    // WRAPPED METHODS WITH FALLBACK
    // ============================================================================

    async getScoutingReport(input: ScoutingReportInput): Promise<ProviderResult<ScoutingReport>> {
        const startTime = Date.now();
        const provider = this.getProvider();

        try {
            const data = await provider.getScoutingReport(input);
            return {
                success: true,
                data,
                source: provider.source,
                fallbackUsed: false,
                latencyMs: Date.now() - startTime,
            };
        } catch (error) {
            console.error(`${provider.source} provider failed:`, error);

            // Fallback to demo if GRID failed
            if (provider.source === "grid") {
                try {
                    const data = await this.demoProvider.getScoutingReport(input);
                    return {
                        success: true,
                        data,
                        source: "demo",
                        fallbackUsed: true,
                        latencyMs: Date.now() - startTime,
                        error: error instanceof Error ? error.message : "GRID unavailable",
                    };
                } catch (fallbackError) {
                    return {
                        success: false,
                        source: "demo",
                        fallbackUsed: true,
                        latencyMs: Date.now() - startTime,
                        error: "All data sources failed",
                    };
                }
            }

            return {
                success: false,
                source: provider.source,
                fallbackUsed: false,
                latencyMs: Date.now() - startTime,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    async getEvidence(insightId: string, reportId: string): Promise<ProviderResult<InsightEvidence>> {
        const startTime = Date.now();
        const provider = this.getProvider();

        try {
            const data = await provider.getEvidence(insightId, reportId);
            return {
                success: true,
                data,
                source: provider.source,
                fallbackUsed: false,
                latencyMs: Date.now() - startTime,
            };
        } catch (error) {
            if (provider.source === "grid") {
                const data = await this.demoProvider.getEvidence(insightId, reportId);
                return {
                    success: true,
                    data,
                    source: "demo",
                    fallbackUsed: true,
                    latencyMs: Date.now() - startTime,
                };
            }
            return {
                success: false,
                source: provider.source,
                fallbackUsed: false,
                latencyMs: Date.now() - startTime,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    async searchTeams(query: string, gameTitle?: string): Promise<ProviderResult<Team[]>> {
        const startTime = Date.now();
        const provider = this.getProvider();

        try {
            const data = await provider.searchTeams(query, gameTitle);
            return {
                success: true,
                data,
                source: provider.source,
                fallbackUsed: false,
                latencyMs: Date.now() - startTime,
            };
        } catch (error) {
            if (provider.source === "grid") {
                const data = await this.demoProvider.searchTeams(query, gameTitle);
                return {
                    success: true,
                    data,
                    source: "demo",
                    fallbackUsed: true,
                    latencyMs: Date.now() - startTime,
                };
            }
            return {
                success: false,
                source: provider.source,
                fallbackUsed: false,
                latencyMs: Date.now() - startTime,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

let manager: DataProviderManager | null = null;

export function getDataProviderManager(): DataProviderManager {
    if (!manager) {
        manager = new DataProviderManager();
    }
    return manager;
}

// Re-export types
export * from "./types";
