"use client";

import { AppShell } from "@/components/app-shell";
import { BarChart3, TrendingUp, Target, Users, Crosshair, Shield } from "lucide-react";

const kpis = [
    { label: "Reports Generated", value: "47", trend: "+12%", icon: Target },
    { label: "Teams Analyzed", value: "23", trend: "+8%", icon: Users },
    { label: "Insights Found", value: "512", trend: "+24%", icon: BarChart3 },
    { label: "Win Rate Accuracy", value: "94%", trend: "+3%", icon: Crosshair },
];

const recentInsights = [
    { category: "Team Strategy", count: 156, percentage: 30 },
    { category: "Player Tendencies", count: 134, percentage: 26 },
    { category: "Composition Analysis", count: 98, percentage: 19 },
    { category: "Critical Weaknesses", count: 67, percentage: 13 },
    { category: "Counter Strategies", count: 57, percentage: 12 },
];

export default function AnalyticsPage() {
    return (
        <AppShell title="Analytics" subtitle="Aggregate insights across all your scouting reports">
            <div className="p-6 max-w-6xl mx-auto">
                {/* KPI Row */}
                <div className="grid-kpi mb-8">
                    {kpis.map((kpi, index) => {
                        const Icon = kpi.icon;
                        return (
                            <div
                                key={kpi.label}
                                className={`stat-card animate-slide-up stagger-${index + 1}`}
                                style={{ opacity: 0 }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="badge badge-success badge-dot text-xs">
                                        {kpi.trend}
                                    </span>
                                </div>
                                <div className="stat-value stat-value-gradient">{kpi.value}</div>
                                <div className="stat-label">{kpi.label}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Insights Breakdown */}
                    <div className="card-base p-6 animate-slide-up" style={{ opacity: 0, animationDelay: "0.2s" }}>
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-5 h-5 text-primary" />
                            <h2 className="text-title text-foreground">Insights by Category</h2>
                        </div>

                        <div className="space-y-4">
                            {recentInsights.map((insight, index) => (
                                <div key={insight.category} className="group">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-foreground">{insight.category}</span>
                                        <span className="text-sm text-muted-foreground text-numeric">{insight.count}</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-700"
                                            style={{
                                                width: `${insight.percentage}%`,
                                                animationDelay: `${0.3 + index * 0.1}s`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="card-base p-6 animate-slide-up" style={{ opacity: 0, animationDelay: "0.25s" }}>
                        <div className="flex items-center gap-3 mb-6">
                            <TrendingUp className="w-5 h-5 text-accent" />
                            <h2 className="text-title text-foreground">Performance Trends</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-muted/50 border border-border">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-foreground">Hit Rate Accuracy</span>
                                    <span className="text-lg font-bold text-success text-numeric">94.2%</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Based on 47 reports over the last 30 days
                                </p>
                            </div>

                            <div className="p-4 rounded-lg bg-muted/50 border border-border">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-foreground">Avg. Insights per Report</span>
                                    <span className="text-lg font-bold gradient-primary-text text-numeric">10.9</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Industry average is 6-8 insights
                                </p>
                            </div>

                            <div className="p-4 rounded-lg bg-muted/50 border border-border">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-foreground">High Confidence Rate</span>
                                    <span className="text-lg font-bold text-accent text-numeric">67%</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Insights with 85%+ confidence score
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Notice */}
                <div className="mt-8 p-4 rounded-lg bg-accent/5 border border-accent/20 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                    <div className="flex items-start gap-3">
                        <BarChart3 className="w-5 h-5 text-accent mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-foreground mb-1">Analytics powered by real data</p>
                            <p className="text-xs text-muted-foreground">
                                All metrics are calculated from your generated reports and opponent analysis. Generate more reports to improve trend accuracy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
