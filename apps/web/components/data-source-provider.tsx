"use client";

import * as React from "react";
import { toast } from "sonner";
import type { DataSource, DataSourceConfig } from "@/lib/data-provider/types";

// ============================================================================
// CONTEXT
// ============================================================================

interface DataSourceContextValue {
    source: DataSource;
    config: DataSourceConfig;
    isLoading: boolean;
    setSource: (source: DataSource) => Promise<boolean>;
    refresh: () => Promise<void>;
}

const DataSourceContext = React.createContext<DataSourceContextValue>({
    source: "demo",
    config: { source: "demo", isAvailable: true, lastChecked: null },
    isLoading: false,
    setSource: async () => false,
    refresh: async () => { },
});

export function useDataSource() {
    return React.useContext(DataSourceContext);
}

// ============================================================================
// PROVIDER
// ============================================================================

interface DataSourceProviderProps {
    children: React.ReactNode;
    defaultSource?: DataSource;
}

export function DataSourceProvider({
    children,
    defaultSource = "demo"
}: DataSourceProviderProps) {
    const [source, setSourceState] = React.useState<DataSource>(defaultSource);
    const [config, setConfig] = React.useState<DataSourceConfig>({
        source: defaultSource,
        isAvailable: true,
        lastChecked: null,
    });
    const [isLoading, setIsLoading] = React.useState(false);

    // Load saved preference
    React.useEffect(() => {
        const saved = localStorage.getItem("scoutedge_data_source") as DataSource | null;
        if (saved && (saved === "demo" || saved === "grid")) {
            setSourceState(saved);
            setConfig(prev => ({ ...prev, source: saved }));
        }
    }, []);

    // Set data source
    const setSource = React.useCallback(async (newSource: DataSource): Promise<boolean> => {
        setIsLoading(true);

        try {
            if (newSource === "demo") {
                setSourceState("demo");
                setConfig({ source: "demo", isAvailable: true, lastChecked: new Date() });
                localStorage.setItem("scoutedge_data_source", "demo");
                toast.success("Switched to Demo Data", {
                    description: "Using local fixtures for instant reliability",
                });
                return true;
            }

            if (newSource === "grid") {
                // Check if GRID is available via API route
                const response = await fetch("/api/data-source/check", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ source: "grid" }),
                });

                const result = await response.json();

                if (result.available) {
                    setSourceState("grid");
                    setConfig({
                        source: "grid",
                        isAvailable: true,
                        lastChecked: new Date()
                    });
                    localStorage.setItem("scoutedge_data_source", "grid");
                    toast.success("Switched to Live GRID Data", {
                        description: "Using real esports data from GRID",
                    });
                    return true;
                } else {
                    toast.error("GRID unavailable", {
                        description: result.error || "Falling back to Demo data",
                    });
                    setConfig(prev => ({
                        ...prev,
                        isAvailable: false,
                        error: result.error,
                        lastChecked: new Date()
                    }));
                    return false;
                }
            }

            return false;
        } catch (error) {
            toast.error("Failed to switch data source", {
                description: "Please try again",
            });
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Refresh availability
    const refresh = React.useCallback(async () => {
        if (source === "grid") {
            await setSource("grid");
        }
    }, [source, setSource]);

    return (
        <DataSourceContext.Provider value={{ source, config, isLoading, setSource, refresh }}>
            {children}
        </DataSourceContext.Provider>
    );
}

// ============================================================================
// DATA SOURCE TOGGLE COMPONENT
// ============================================================================

interface DataSourceToggleProps {
    className?: string;
    showLabel?: boolean;
}

export function DataSourceToggle({ className = "", showLabel = true }: DataSourceToggleProps) {
    const { source, config, isLoading, setSource } = useDataSource();

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {showLabel && (
                <span className="text-xs text-muted-foreground">Data Source:</span>
            )}

            <div className="flex rounded-lg border border-border overflow-hidden">
                <button
                    onClick={() => setSource("demo")}
                    disabled={isLoading}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${source === "demo"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80 text-muted-foreground"
                        }`}
                >
                    Demo
                </button>
                <button
                    onClick={() => setSource("grid")}
                    disabled={isLoading}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5 ${source === "grid"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80 text-muted-foreground"
                        }`}
                >
                    {isLoading && source !== "grid" ? (
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <span className={`w-2 h-2 rounded-full ${source === "grid" && config.isAvailable
                                ? "bg-success animate-pulse"
                                : "bg-muted-foreground"
                            }`} />
                    )}
                    GRID
                </button>
            </div>

            {/* Status indicator */}
            {source === "grid" && !config.isAvailable && (
                <span className="text-xs text-warning">Unavailable</span>
            )}
        </div>
    );
}

// ============================================================================
// DATA SOURCE INDICATOR (For sidebar/footer)
// ============================================================================

interface DataSourceIndicatorProps {
    compact?: boolean;
    className?: string;
}

export function DataSourceIndicator({ compact = false, className = "" }: DataSourceIndicatorProps) {
    const { source, config } = useDataSource();

    if (compact) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <span className={`w-2 h-2 rounded-full ${source === "demo"
                        ? "bg-success"
                        : config.isAvailable
                            ? "bg-primary animate-pulse"
                            : "bg-warning"
                    }`} />
                <span className="text-xs font-medium text-muted-foreground">
                    {source === "demo" ? "Demo" : "GRID"}
                </span>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50 ${className}`}>
            <span className={`w-2 h-2 rounded-full ${source === "demo"
                    ? "bg-success"
                    : config.isAvailable
                        ? "bg-primary animate-pulse"
                        : "bg-warning"
                }`} />
            <div className="flex-1">
                <p className="text-xs font-medium text-foreground">
                    {source === "demo" ? "Demo Mode" : "GRID Live"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                    {source === "demo"
                        ? "Using local fixtures"
                        : config.isAvailable
                            ? "Powered by GRID"
                            : "Connection issue"
                    }
                </p>
            </div>
        </div>
    );
}
