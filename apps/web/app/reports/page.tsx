"use client";

import { AppShell } from "@/components/app-shell";
import {
    FileText, Plus, Clock, MoreHorizontal, Download, Trash2, ExternalLink, Eye, ShieldCheck, Database
} from "lucide-react";
import Link from "next/link";

const reports = [
    {
        id: "rpt-001",
        opponent: "Sentinels",
        source: "grid",
        createdAt: "2025-02-02T18:30:00Z",
        matchesAnalyzed: 15,
        insightCount: 18,
        winRate: 0.68,
        vlrUrl: "https://www.vlr.gg/team/2/sentinels",
    },
    {
        id: "rpt-002",
        opponent: "Phantom Tactics",
        source: "demo",
        createdAt: "2025-01-26T10:30:00Z",
        matchesAnalyzed: 10,
        insightCount: 14,
        winRate: 0.62,
        vlrUrl: "https://www.vlr.gg/",
    },
    {
        id: "rpt-003",
        opponent: "Shadow Strike Gaming",
        source: "demo",
        createdAt: "2025-01-25T14:15:00Z",
        matchesAnalyzed: 8,
        insightCount: 11,
        winRate: 0.55,
        vlrUrl: "https://www.vlr.gg/",
    },
    {
        id: "rpt-004",
        opponent: "T1",
        source: "grid",
        createdAt: "2025-02-01T09:00:00Z",
        matchesAnalyzed: 20,
        insightCount: 22,
        winRate: 0.72,
        vlrUrl: "https://www.vlr.gg/team/14/t1",
    },
];

export default function ReportsPage() {
    return (
        <AppShell title="Saved Reports" subtitle="Your generated scouting intelligence">
            <div className="p-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="data-source">
                        <span className="data-source-dot" />
                        <span>{reports.length} reports</span>
                    </div>
                    <Link
                        href="/generate"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-background text-sm font-medium hover:opacity-90 shadow-lg"
                    >
                        <Plus className="w-4 h-4" />
                        New Report
                    </Link>
                </div>

                {/* Reports List */}
                <div className="space-y-3">
                    {reports.map((report, index) => (
                        <div
                            key={report.id}
                            className={`card-base p-5 hover-lift animate-slide-up stagger-${index + 1}`}
                            style={{ opacity: 0 }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-foreground mb-1">
                                            vs. {report.opponent}
                                            {report.source === "grid" ? (
                                                <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold tracking-wide border border-emerald-500/20 uppercase">
                                                    <ShieldCheck className="w-3 h-3" />
                                                    GRID Verified
                                                </span>
                                            ) : (
                                                <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-bold tracking-wide border border-orange-500/20 uppercase">
                                                    <Database className="w-3 h-3" />
                                                    Demo Sim
                                                </span>
                                            )}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(report.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </span>
                                            <span>{report.matchesAnalyzed} matches</span>
                                            <span>{report.insightCount} insights</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <span className={`text-lg font-bold text-numeric ${report.winRate >= 0.55 ? "text-primary" : report.winRate < 0.45 ? "text-destructive" : "text-muted-foreground"
                                            }`}>
                                            {Math.round(report.winRate * 100)}%
                                        </span>
                                        <p className="text-xs text-muted-foreground">Win Rate</p>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={`/generate?team=${encodeURIComponent(report.opponent)}`}
                                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                            title="View Report"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <a
                                            href={report.vlrUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-secondary transition-colors"
                                            title="VLR.gg"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                        <button
                                            onClick={() => window.print()}
                                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                            title="Download as PDF"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {reports.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <FileText className="w-8 h-8" />
                        </div>
                        <h3 className="text-title text-foreground mb-2">No reports yet</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Generate your first scouting report for tactical intelligence.
                        </p>
                        <Link
                            href="/generate"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-primary text-background text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Generate Report
                        </Link>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
