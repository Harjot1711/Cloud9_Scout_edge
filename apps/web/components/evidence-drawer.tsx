"use client";

import * as React from "react";
import {
    X, Database, Info, BarChart3, Hash, TrendingUp, Clock,
    ExternalLink, Copy, FileText, Code, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/primitives";

// ============================================================================
// TYPES
// ============================================================================

interface Evidence {
    metric: string;
    sampleSize: { matches: number; rounds?: number };
    numerator: number;
    denominator: number;
    matchIds: string[];
    seriesIds?: string[];  // GRID series IDs
    dataSource?: "demo" | "grid";
    timelineAnchor?: { seriesId: string; eventIndex?: number };
    externalLinks?: {
        vlr?: string;
        liquipedia?: string;
        opgg?: string;
        leaguepedia?: string;
        grid?: string;
    };
    rawPayload?: object;
}

interface Insight {
    id: string;
    category: string;
    title: string;
    claim: string;
    value: string;
    confidence: number;
    evidence: Evidence;
}

// ============================================================================
// EVIDENCE DRAWER WITH TABS
// ============================================================================

interface EvidenceDrawerProps {
    insight: Insight | null;
    onClose: () => void;
}

type TabId = "evidence" | "matches" | "raw";

export function EvidenceDrawer({ insight, onClose }: EvidenceDrawerProps) {
    const [activeTab, setActiveTab] = React.useState<TabId>("evidence");

    // Close on Escape
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (insight) {
            document.addEventListener("keydown", handleKeyDown);
            return () => document.removeEventListener("keydown", handleKeyDown);
        }
    }, [insight, onClose]);

    if (!insight) return null;

    const confLevel = insight.confidence >= 85 ? "High" : insight.confidence >= 70 ? "Medium" : "Low";
    const confClass = insight.confidence >= 85 ? "confidence-high" : insight.confidence >= 70 ? "confidence-medium" : "confidence-low";

    const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
        { id: "evidence", label: "Evidence", icon: BarChart3 },
        { id: "matches", label: "Matches", icon: FileText },
        { id: "raw", label: "Raw", icon: Code },
    ];

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="absolute top-0 right-0 bottom-0 w-full max-w-lg bg-popover border-l border-border shadow-2xl animate-slide-in-right flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between p-5 border-b border-border">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Database className="w-4 h-4 text-primary" />
                            <span className="text-overline">Evidence Report</span>
                            {insight.evidence.dataSource === "grid" && (
                                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded border border-emerald-500/30">
                                    GRID
                                </span>
                            )}
                            {insight.evidence.dataSource === "demo" && (
                                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded border border-amber-500/30">
                                    Demo
                                </span>
                            )}
                        </div>
                        <h2 className="text-title text-foreground">{insight.title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === tab.id
                                ? "text-primary"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
                    {activeTab === "evidence" && (
                        <EvidenceTab insight={insight} confLevel={confLevel} confClass={confClass} />
                    )}
                    {activeTab === "matches" && (
                        <MatchesTab matchIds={insight.evidence.matchIds} />
                    )}
                    {activeTab === "raw" && (
                        <RawTab evidence={insight.evidence} />
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border flex gap-3">
                    <CopyButton
                        value={JSON.stringify(insight.evidence, null, 2)}
                        label="Copy JSON"
                        className="flex-1 justify-center"
                    />
                    <Button variant="ghost" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// TAB CONTENTS
// ============================================================================

function EvidenceTab({
    insight,
    confLevel,
    confClass
}: {
    insight: Insight;
    confLevel: string;
    confClass: string;
}) {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Metric Definition */}
            <section>
                <h3 className="text-caption font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    Metric Definition
                </h3>
                <div className="p-4 rounded-lg bg-muted border border-border">
                    <p className="text-body text-muted-foreground">{insight.evidence.metric}</p>
                </div>
            </section>

            {/* Statistical Breakdown */}
            <section>
                <h3 className="text-caption font-semibold text-foreground mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Statistical Breakdown
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    <div className="stat-card text-center">
                        <div className="stat-value stat-value-primary text-xl">{insight.evidence.numerator}</div>
                        <div className="stat-label">Occurrences</div>
                    </div>
                    <div className="stat-card text-center">
                        <div className="stat-value text-xl">{insight.evidence.denominator}</div>
                        <div className="stat-label">Opportunities</div>
                    </div>
                    <div className="stat-card text-center">
                        <div className="stat-value stat-value-primary text-xl">
                            {((insight.evidence.numerator / insight.evidence.denominator) * 100).toFixed(0)}%
                        </div>
                        <div className="stat-label">Rate</div>
                    </div>
                </div>
            </section>

            {/* Sample Size */}
            <section>
                <h3 className="text-caption font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-primary" />
                    Sample Size
                </h3>
                <div className="flex gap-3">
                    <div className="flex-1 p-3 rounded-lg bg-muted border border-border">
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-foreground">{insight.evidence.sampleSize.matches}</span>
                            <span className="text-sm text-muted-foreground">matches</span>
                        </div>
                    </div>
                    {insight.evidence.sampleSize.rounds && (
                        <div className="flex-1 p-3 rounded-lg bg-muted border border-border">
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-foreground">{insight.evidence.sampleSize.rounds}</span>
                                <span className="text-sm text-muted-foreground">rounds</span>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Confidence */}
            <section>
                <h3 className="text-caption font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Confidence Assessment
                </h3>
                <div className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold gradient-primary-text">{insight.confidence}%</span>
                        <span className={`badge ${confLevel === "High" ? "badge-success" :
                            confLevel === "Medium" ? "badge-warning" : "badge-danger"
                            } badge-dot`}>
                            {confLevel} Confidence
                        </span>
                    </div>
                    <div className={`confidence-meter ${confClass}`}>
                        <div className="confidence-meter-fill" style={{ width: `${insight.confidence}%` }} />
                    </div>
                </div>
            </section>

            {/* Series IDs (GRID) */}
            {insight.evidence.seriesIds && insight.evidence.seriesIds.length > 0 && (
                <section>
                    <h3 className="text-caption font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        GRID Series IDs
                    </h3>
                    <div className="space-y-2">
                        {insight.evidence.seriesIds.slice(0, 5).map((seriesId) => (
                            <div key={seriesId} className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border">
                                <span className="text-sm font-mono text-foreground">{seriesId}</span>
                                <div className="flex items-center gap-2">
                                    <CopyButton value={seriesId} label="Copy" />
                                    <a
                                        href={`/timeline/${seriesId}`}
                                        className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary flex items-center gap-1 text-xs"
                                    >
                                        Timeline
                                        <ChevronRight className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        ))}
                        {insight.evidence.seriesIds.length > 5 && (
                            <span className="text-xs text-muted-foreground">
                                +{insight.evidence.seriesIds.length - 5} more series
                            </span>
                        )}
                    </div>
                </section>
            )}

            {/* Data Sources & External Links */}
            <section>
                <h3 className="text-caption font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Database className="w-4 h-4 text-primary" />
                    Data Sources & References
                </h3>
                <div className="space-y-2">
                    {/* GRID Link */}
                    <a
                        href={insight.evidence.externalLinks?.grid || "https://grid.gg/"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-xs px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded font-medium">GRID</span>
                            <span className="text-sm text-foreground">GRID Esports Data Platform</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-emerald-400" />
                    </a>

                    {/* VLR/Google Link */}
                    <a
                        href={insight.evidence.externalLinks?.vlr || `https://www.google.com/search?q=${encodeURIComponent(insight.title + " verified match stats")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border hover:border-primary/30 transition-colors"
                    >
                        <span className="text-sm text-foreground">Verify Match Data</span>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </a>

                    {/* Liquipedia Link */}
                    <a
                        href={insight.evidence.externalLinks?.liquipedia || "https://liquipedia.net/valorant/"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border hover:border-primary/30 transition-colors"
                    >
                        <span className="text-sm text-foreground">Liquipedia</span>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </a>

                    {/* OP.GG Link (for LoL) */}
                    {insight.evidence.externalLinks?.opgg && (
                        <a
                            href={insight.evidence.externalLinks.opgg}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border hover:border-primary/30 transition-colors"
                        >
                            <span className="text-sm text-foreground">OP.GG Stats</span>
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </a>
                    )}

                    {/* Leaguepedia Link (for LoL) */}
                    {insight.evidence.externalLinks?.leaguepedia && (
                        <a
                            href={insight.evidence.externalLinks.leaguepedia}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border hover:border-primary/30 transition-colors"
                        >
                            <span className="text-sm text-foreground">Leaguepedia</span>
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </a>
                    )}
                </div>
            </section>
        </div>
    );
}

function MatchesTab({ matchIds }: { matchIds: string[] }) {
    return (
        <div className="space-y-4 animate-fade-in">
            <p className="text-sm text-muted-foreground">
                {matchIds.length} matches contributed to this insight.
            </p>

            <div className="rounded-lg border border-border overflow-hidden">
                <div className="max-h-96 overflow-y-auto scrollbar-thin">
                    {matchIds.map((id, idx) => (
                        <div
                            key={id}
                            className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground w-6">{idx + 1}.</span>
                                <span className="text-sm font-mono text-foreground">{id}</span>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <CopyButton value={id} label="Copy" />
                                <a
                                    href={`https://www.google.com/search?q=valorant+match+${id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function RawTab({ evidence }: { evidence: Evidence }) {
    const jsonString = JSON.stringify(evidence, null, 2);

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Raw evidence payload</p>
                <CopyButton value={jsonString} label="Copy" />
            </div>

            <pre className="p-4 rounded-lg bg-muted border border-border overflow-x-auto text-xs font-mono text-foreground scrollbar-thin">
                {jsonString}
            </pre>
        </div>
    );
}
