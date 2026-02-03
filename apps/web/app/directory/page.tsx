"use client";

import { useState, useEffect, useCallback } from "react";
import { useDataSource } from "@/components/data-source-provider";
import {
    Search,
    Calendar,
    Trophy,
    Users,
    ChevronRight,
    Loader2,
    Database,
    ExternalLink,
    Gamepad2
} from "lucide-react";
import Link from "next/link";
import type { GameTitle, Tournament, Series, Team } from "@/lib/data-provider/types";

// ============================================================================
// DATA DIRECTORY PAGE
// ============================================================================
// Browse GRID content: Titles -> Tournaments -> Series
// ============================================================================

interface DirectoryState {
    titles: GameTitle[];
    tournaments: Tournament[];
    series: Series[];
    selectedTitleId: string | null;
    selectedTournamentId: string | null;
    loading: boolean;
    error: string | null;
}

export default function DirectoryPage() {
    const { source, config } = useDataSource();
    const [state, setState] = useState<DirectoryState>({
        titles: [],
        tournaments: [],
        series: [],
        selectedTitleId: null,
        selectedTournamentId: null,
        loading: true,
        error: null,
    });
    const [searchQuery, setSearchQuery] = useState("");

    // Load titles on mount
    useEffect(() => {
        loadTitles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [source]);

    const loadTitles = async () => {
        setState(s => ({ ...s, loading: true, error: null }));
        try {
            const response = await fetch("/api/grid/central", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ operation: "GetTitles" }),
            });

            if (!response.ok) {
                // Fallback to demo titles
                setState(s => ({
                    ...s,
                    titles: [
                        { id: "valorant", name: "VALORANT", nameShortened: "VAL" },
                        { id: "lol", name: "League of Legends", nameShortened: "LoL" },
                    ],
                    loading: false,
                }));
                return;
            }

            const data = await response.json();
            setState(s => ({
                ...s,
                titles: data.data?.titles || [],
                loading: false,
            }));
        } catch (error) {
            // Fallback to demo titles
            setState(s => ({
                ...s,
                titles: [
                    { id: "valorant", name: "VALORANT", nameShortened: "VAL" },
                    { id: "lol", name: "League of Legends", nameShortened: "LoL" },
                ],
                loading: false,
            }));
        }
    };

    const loadTournaments = useCallback(async (titleId: string) => {
        setState(s => ({
            ...s,
            selectedTitleId: titleId,
            selectedTournamentId: null,
            series: [],
            loading: true
        }));

        try {
            const response = await fetch("/api/grid/central", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    operation: "GetTournaments",
                    variables: { titleId }
                }),
            });

            if (!response.ok) {
                // Demo fallback
                setState(s => ({
                    ...s,
                    tournaments: [
                        { id: "demo-vct-2024", name: "VCT Champions 2024", startDate: "2024-08-01", region: "International" },
                        { id: "demo-challengers", name: "VCT Challengers NA", startDate: "2024-02-01", region: "NA" },
                    ],
                    loading: false,
                }));
                return;
            }

            const data = await response.json();
            const tournaments = data.data?.tournaments?.edges?.map((e: { node: Tournament }) => e.node) || [];
            setState(s => ({
                ...s,
                tournaments,
                loading: false,
            }));
        } catch {
            setState(s => ({
                ...s,
                tournaments: [
                    { id: "demo-vct-2024", name: "VCT Champions 2024", startDate: "2024-08-01", region: "International" },
                ],
                loading: false,
            }));
        }
    }, []);

    const loadSeries = useCallback(async (tournamentId: string) => {
        setState(s => ({
            ...s,
            selectedTournamentId: tournamentId,
            loading: true
        }));

        try {
            const response = await fetch("/api/grid/central", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    operation: "GetSeriesByTournament",
                    variables: { tournamentId, first: 50 }
                }),
            });

            if (!response.ok) {
                setState(s => ({ ...s, series: [], loading: false }));
                return;
            }

            const data = await response.json();
            const series = data.data?.series?.edges?.map((e: { node: Record<string, unknown> }) => ({
                ...e.node,
                startTime: (e.node.startTimeScheduled as string) || (e.node.startTime as string),
            })) || [];
            setState(s => ({
                ...s,
                series,
                loading: false,
            }));
        } catch {
            setState(s => ({ ...s, series: [], loading: false }));
        }
    }, []);

    const filteredSeries = state.series.filter(s => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return s.teams.some(t =>
            t.name.toLowerCase().includes(q) ||
            t.shortName?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/generate" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                            <Gamepad2 className="w-5 h-5" />
                            <span className="font-semibold">ScoutEdge</span>
                        </Link>
                        <ChevronRight className="w-4 h-4 text-white/30" />
                        <div className="flex items-center gap-2">
                            <Database className="w-5 h-5 text-emerald-400" />
                            <span className="font-semibold text-white">Data Directory</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${source === "grid" && config.isAvailable
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            }`}>
                            {source === "grid" && config.isAvailable ? "GRID Connected" : "Demo Mode"}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Title Selection */}
                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Gamepad2 className="w-5 h-5 text-purple-400" />
                        Select Game Title
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {state.titles.map((title) => (
                            <button
                                key={title.id}
                                onClick={() => loadTournaments(title.id)}
                                className={`p-4 rounded-xl border transition-all ${state.selectedTitleId === title.id
                                    ? "bg-purple-500/20 border-purple-500/50 ring-2 ring-purple-500/30"
                                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                    }`}
                            >
                                <div className="text-lg font-bold text-white">{title.nameShortened || title.name}</div>
                                <div className="text-sm text-white/60">{title.name}</div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Tournament Selection */}
                {state.selectedTitleId && (
                    <section className="mb-8">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-400" />
                            Select Tournament
                        </h2>
                        {state.loading && !state.tournaments.length ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 text-white/60 animate-spin" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {state.tournaments.map((tournament) => (
                                    <button
                                        key={tournament.id}
                                        onClick={() => loadSeries(tournament.id)}
                                        className={`p-4 rounded-xl border text-left transition-all ${state.selectedTournamentId === tournament.id
                                            ? "bg-amber-500/20 border-amber-500/50 ring-2 ring-amber-500/30"
                                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                            }`}
                                    >
                                        <div className="font-semibold text-white mb-1">{tournament.name}</div>
                                        <div className="flex items-center gap-3 text-sm text-white/60">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {tournament.startDate}
                                            </span>
                                            {tournament.region && (
                                                <span className="px-2 py-0.5 bg-white/10 rounded text-xs">
                                                    {tournament.region}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* Series List */}
                {state.selectedTournamentId && (
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-cyan-400" />
                                Series ({filteredSeries.length})
                            </h2>
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                <input
                                    type="text"
                                    placeholder="Search teams..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                />
                            </div>
                        </div>

                        {state.loading && !state.series.length ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 text-white/60 animate-spin" />
                            </div>
                        ) : filteredSeries.length === 0 ? (
                            <div className="text-center py-12 text-white/40">
                                No series found for this tournament
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredSeries.map((series) => (
                                    <SeriesCard key={series.id} series={series} />
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}

// ============================================================================
// SERIES CARD COMPONENT
// ============================================================================

function SeriesCard({ series }: { series: Series }) {
    const team1 = series.teams[0];
    const team2 = series.teams[1];
    const date = series.startTime ? new Date(series.startTime).toLocaleDateString() : "TBD";

    return (
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    {/* Team 1 */}
                    <div className="flex items-center gap-3 min-w-[200px]">
                        <TeamLogo team={team1} />
                        <div>
                            <div className="font-semibold text-white">{team1?.name || "TBD"}</div>
                            <div className="text-xs text-white/40">{team1?.shortName}</div>
                        </div>
                    </div>

                    {/* Score / VS */}
                    <div className="flex items-center gap-2 text-white/60">
                        {series.score ? (
                            <>
                                <span className={`text-lg font-bold ${series.score[0] > series.score[1] ? "text-emerald-400" : ""}`}>
                                    {series.score[0]}
                                </span>
                                <span>-</span>
                                <span className={`text-lg font-bold ${series.score[1] > series.score[0] ? "text-emerald-400" : ""}`}>
                                    {series.score[1]}
                                </span>
                            </>
                        ) : (
                            <span className="text-sm">vs</span>
                        )}
                    </div>

                    {/* Team 2 */}
                    <div className="flex items-center gap-3 min-w-[200px]">
                        <TeamLogo team={team2} />
                        <div>
                            <div className="font-semibold text-white">{team2?.name || "TBD"}</div>
                            <div className="text-xs text-white/40">{team2?.shortName}</div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-sm text-white/40">
                        {date}
                    </div>
                    {series.format && (
                        <div className="px-2 py-1 bg-white/10 rounded text-xs text-white/60">
                            Bo{series.format.bestOf}
                        </div>
                    )}
                    <Link
                        href={`/series/${series.id}`}
                        className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyan-500/30"
                    >
                        View Details
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

function TeamLogo({ team }: { team: Team | undefined }) {
    if (!team) {
        return (
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-white/30" />
            </div>
        );
    }

    return (
        <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{
                backgroundColor: team.colorPrimary ? `${team.colorPrimary}20` : "rgba(255,255,255,0.1)",
                color: team.colorPrimary || "rgba(255,255,255,0.6)"
            }}
        >
            {team.logoUrl ? (
                <img src={team.logoUrl} alt={team.name} className="w-8 h-8 object-contain" />
            ) : (
                team.shortName?.slice(0, 2) || team.name.slice(0, 2)
            )}
        </div>
    );
}
