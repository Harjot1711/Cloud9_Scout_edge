"use client";

import { AppShell } from "@/components/app-shell";
import { TrendingUp, TrendingDown, Minus, ArrowRight, ExternalLink, AlertCircle } from "lucide-react";

const metaTrends = [
    {
        name: "Double Initiator Meta",
        trend: "up",
        change: "+28%",
        description: "Double Initiator comps surging on Sunset and Lotus. Fade+Gekko or Sova+Fade most common.",
        confidence: 91,
        patchRef: "Patch 9.06",
    },
    {
        name: "Aggressive A-Takes on Haven",
        trend: "up",
        change: "+15%",
        description: "Teams favoring fast A-site executes with Raze satchel entry.",
        confidence: 84,
        patchRef: "Patch 9.05",
    },
    {
        name: "Operator Economy",
        trend: "down",
        change: "-18%",
        description: "Operator usage declining due to increased anti-OP utility (flashes, recon).",
        confidence: 78,
        patchRef: "Patch 9.04",
    },
    {
        name: "Chamber Pick Rate",
        trend: "down",
        change: "-22%",
        description: "Post-nerf Chamber seeing reduced pro play, replaced by Cypher/Killjoy.",
        confidence: 92,
        patchRef: "Patch 9.03",
    },
];

const agentStats = [
    { agent: "Jett", pickRate: 42, winRate: 51.2, trend: "neutral", delta: "±1%" },
    { agent: "Omen", pickRate: 38, winRate: 49.8, trend: "down", delta: "-4%" },
    { agent: "Sova", pickRate: 35, winRate: 52.1, trend: "up", delta: "+3%" },
    { agent: "Killjoy", pickRate: 44, winRate: 50.5, trend: "up", delta: "+6%" },
    { agent: "Gekko", pickRate: 31, winRate: 53.2, trend: "up", delta: "+8%" },
    { agent: "Clove", pickRate: 28, winRate: 48.7, trend: "up", delta: "+12%" },
];

export default function TrendsPage() {
    return (
        <AppShell title="Meta Analysis" subtitle="Track meta shifts and emerging patterns">
            <div className="p-6 max-w-6xl mx-auto">
                {/* Source Notice */}
                <div className="mb-6 p-4 rounded-lg bg-muted border border-border flex items-center gap-4 animate-fade-in">
                    <AlertCircle className="w-5 h-5 text-primary" />
                    <div>
                        <p className="text-sm text-foreground">
                            Meta data aggregated from{" "}
                            <a href="https://www.vlr.gg/stats" target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline hover:text-primary">VLR.gg Stats</a>
                            {" "}and processed through <span className="font-bold text-primary">GRID API</span>.
                        </p>
                    </div>
                </div>

                {/* Trending Strategies */}
                <section className="mb-10">
                    <h2 className="text-headline text-foreground mb-5">Trending Strategies</h2>
                    <div className="space-y-3">
                        {metaTrends.map((item, index) => {
                            const TrendIcon = item.trend === "up" ? TrendingUp : item.trend === "down" ? TrendingDown : Minus;
                            const trendColor = item.trend === "up" ? "text-primary" : item.trend === "down" ? "text-destructive" : "text-muted-foreground";

                            return (
                                <div
                                    key={item.name}
                                    className={`card-base card-interactive p-5 animate-slide-up stagger-${index + 1}`}
                                    style={{ opacity: 0 }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-base font-semibold text-foreground">{item.name}</h3>
                                                <span className={`flex items-center gap-1 text-sm font-bold ${trendColor}`}>
                                                    <TrendIcon className="w-4 h-4" />
                                                    {item.change}
                                                </span>
                                                <span className="badge badge-muted text-[10px]">{item.patchRef}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                                            <div className="flex items-center gap-4">
                                                <div className={`confidence-meter w-24 ${item.confidence >= 85 ? "confidence-high" : item.confidence >= 70 ? "confidence-medium" : "confidence-low"
                                                    }`}>
                                                    <div className="confidence-meter-fill" style={{ width: `${item.confidence}%` }} />
                                                </div>
                                                <span className="text-xs text-muted-foreground">{item.confidence}% confidence</span>
                                            </div>
                                        </div>
                                        <a
                                            href="https://liquipedia.net/valorant/Patches"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-secondary transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Agent Stats Table */}
                <section>
                    <h2 className="text-headline text-foreground mb-5">Agent Pick Rate Shifts</h2>
                    <div className="card-base overflow-hidden animate-slide-up" style={{ opacity: 0, animationDelay: "0.3s" }}>
                        <div className="overflow-x-auto scrollbar-thin">
                            <table className="table-tactical w-full">
                                <thead>
                                    <tr>
                                        <th>Agent</th>
                                        <th>Pick Rate</th>
                                        <th>Win Rate</th>
                                        <th>Trend</th>
                                        <th>Change</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {agentStats.map((agent) => (
                                        <tr key={agent.agent}>
                                            <td>
                                                <span className="font-medium text-foreground">{agent.agent}</span>
                                            </td>
                                            <td>
                                                <span className="text-numeric">{agent.pickRate}%</span>
                                            </td>
                                            <td>
                                                <span className={`text-numeric ${agent.winRate >= 51 ? "text-primary" : agent.winRate < 49 ? "text-destructive" : ""}`}>
                                                    {agent.winRate}%
                                                </span>
                                            </td>
                                            <td>
                                                {agent.trend === "up" ? (
                                                    <TrendingUp className="w-4 h-4 text-primary" />
                                                ) : agent.trend === "down" ? (
                                                    <TrendingDown className="w-4 h-4 text-destructive" />
                                                ) : (
                                                    <Minus className="w-4 h-4 text-muted-foreground" />
                                                )}
                                            </td>
                                            <td>
                                                <span className={`text-sm font-medium ${agent.trend === "up" ? "text-primary" : agent.trend === "down" ? "text-destructive" : "text-muted-foreground"
                                                    }`}>
                                                    {agent.delta}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-4 text-right">
                        <a
                            href="https://www.vlr.gg/stats"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="external-link"
                        >
                            Full stats on VLR.gg
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </section>
            </div>
        </AppShell>
    );
}
