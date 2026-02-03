"use client";

import { AppShell } from "@/components/app-shell";
import { Moon, Database, Shield, ExternalLink, Zap } from "lucide-react";

export default function SettingsPage() {
    return (
        <AppShell title="Settings" subtitle="Configure ScoutEdge preferences">
            <div className="p-6 max-w-3xl mx-auto">
                <div className="space-y-6">
                    {/* Appearance */}
                    <div className="card-base p-6 animate-slide-up" style={{ opacity: 0 }}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Moon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-title text-foreground">Appearance</h3>
                                <p className="text-sm text-muted-foreground">Visual preferences</p>
                            </div>
                        </div>

                        <div className="space-y-4 pl-14">
                            <div className="flex items-center justify-between py-3 border-b border-border">
                                <div>
                                    <p className="text-sm font-medium text-foreground">Theme</p>
                                    <p className="text-xs text-muted-foreground">GRID Pro Theme (Active)</p>
                                </div>
                                <span className="badge badge-primary">Active</span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <p className="text-sm font-medium text-foreground">Animations</p>
                                    <p className="text-xs text-muted-foreground">Enable smooth transitions</p>
                                </div>
                                <button className="relative w-11 h-6 rounded-full bg-primary transition-colors">
                                    <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-background shadow" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Data Sources */}
                    <div className="card-base p-6 animate-slide-up" style={{ opacity: 0, animationDelay: "0.1s" }}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-secondary/30 flex items-center justify-center">
                                <Database className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-title text-foreground">Data Sources</h3>
                                <p className="text-sm text-muted-foreground">Connected APIs and references</p>
                            </div>
                        </div>

                        <div className="space-y-3 pl-14">
                            <a
                                href="https://grid.gg/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border hover:border-secondary transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="data-source-dot" />
                                    <span className="text-sm font-medium text-foreground">GRID Esports Data Platform</span>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                            </a>
                            <a
                                href="https://www.vlr.gg/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border hover:border-secondary transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="data-source-dot" />
                                    <span className="text-sm font-medium text-foreground">VLR.gg Match Data</span>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                            </a>
                            <a
                                href="https://liquipedia.net/valorant/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border hover:border-secondary transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="data-source-dot" />
                                    <span className="text-sm font-medium text-foreground">Liquipedia Reference</span>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                            </a>
                        </div>
                    </div>

                    {/* About */}
                    <div className="card-base p-6 animate-slide-up" style={{ opacity: 0, animationDelay: "0.2s" }}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                <Shield className="w-5 h-5 text-foreground" />
                            </div>
                            <div>
                                <h3 className="text-title text-foreground">About ScoutEdge</h3>
                                <p className="text-sm text-muted-foreground">v1.0.0 — Hackathon Edition</p>
                            </div>
                        </div>

                        <div className="pl-14 space-y-4">
                            <p className="text-sm text-muted-foreground">
                                ScoutEdge is an automated tactical intelligence platform for competitive Valorant.
                                Generate data-backed scouting reports with evidence-first insights.
                            </p>
                            <div className="flex gap-4">
                                <a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="external-link"
                                >
                                    GitHub
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <a
                                    href="https://devpost.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="external-link"
                                >
                                    Devpost
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                            <div className="pt-4 border-t border-border">
                                <p className="text-xs text-muted-foreground">
                                    Built for Cloud9 x JetBrains Hackathon
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
