"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    ChevronRight,
    Trophy,
    Calendar,
    Clock,
    Users,
    Swords,
    Map,
    Loader2,
    ExternalLink,
    Play,
    Database,
    FileText,
    Gamepad2
} from "lucide-react";
import type { Series, SeriesState, FileInfo } from "@/lib/data-provider/types";

// ============================================================================
// SERIES DETAIL PAGE
// ============================================================================

export default function SeriesDetailPage() {
    const params = useParams();
    const seriesId = params.id as string;

    const [series, setSeries] = useState<Series | null>(null);
    const [seriesState, setSeriesState] = useState<SeriesState | null>(null);
    const [files, setFiles] = useState<FileInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingState, setLoadingState] = useState(false);

    useEffect(() => {
        loadSeriesDetails();
    }, [seriesId]);

    const loadSeriesDetails = async () => {
        setLoading(true);
        try {
            // Get series metadata
            const response = await fetch("/api/grid/central", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    operation: "GetSeriesDetails",
                    variables: { seriesId }
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const node = data.data?.series?.edges?.[0]?.node;
                if (node) {
                    setSeries({
                        id: node.id,
                        tournamentId: node.tournament?.id || "",
                        tournamentName: node.tournament?.name || "",
                        titleId: node.title?.id,
                        titleName: node.title?.name,
                        format: node.format,
                        startTime: node.startTimeScheduled,
                        startTimeActual: node.startTimeActual,
                        status: "completed",
                        teams: node.teams?.map((t: Record<string, unknown>) => ({
                            id: t.id as string,
                            name: t.name,
                            shortName: t.nameShortened,
                            logoUrl: t.logoUrl,
                            colorPrimary: t.colorPrimary,
                        })) || [],
                    });
                }
            }

            // Get available files
            const filesResponse = await fetch(`/api/grid/file-download?seriesId=${seriesId}`);
            if (filesResponse.ok) {
                const filesData = await filesResponse.json();
                setFiles(filesData.files || []);
            }
        } catch (error) {
            console.error("Failed to load series:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadSeriesState = async () => {
        setLoadingState(true);
        try {
            const response = await fetch("/api/grid/series-state", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    operation: "GetSeriesState",
                    variables: { seriesId }
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setSeriesState(data.data?.seriesState || null);
            }
        } catch (error) {
            console.error("Failed to load series state:", error);
        } finally {
            setLoadingState(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white/60 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-white/60">
                        <Link href="/generate" className="hover:text-white transition-colors flex items-center gap-1">
                            <Gamepad2 className="w-4 h-4" />
                            ScoutEdge
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href="/directory" className="hover:text-white transition-colors">Directory</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-white">Series {seriesId.slice(0, 8)}...</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Series Header */}
                <section className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Trophy className="w-5 h-5 text-amber-400" />
                        <span className="text-white/60">{series?.tournamentName}</span>
                        {series?.titleName && (
                            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                                {series.titleName}
                            </span>
                        )}
                    </div>

                    {/* Teams Matchup */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-6">
                        <div className="flex items-center justify-between">
                            {/* Team 1 */}
                            <div className="flex-1 text-center">
                                <TeamDisplay team={series?.teams[0]} score={seriesState?.teams[0]?.score} won={seriesState?.teams[0]?.won} />
                            </div>

                            {/* VS / Score */}
                            <div className="px-8">
                                {seriesState ? (
                                    <div className="flex items-center gap-4 text-4xl font-bold">
                                        <span className={seriesState.teams[0]?.won ? "text-emerald-400" : "text-white/40"}>
                                            {seriesState.teams[0]?.score || 0}
                                        </span>
                                        <span className="text-white/20">-</span>
                                        <span className={seriesState.teams[1]?.won ? "text-emerald-400" : "text-white/40"}>
                                            {seriesState.teams[1]?.score || 0}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-2xl font-bold text-white/20">VS</span>
                                )}
                            </div>

                            {/* Team 2 */}
                            <div className="flex-1 text-center">
                                <TeamDisplay team={series?.teams[1]} score={seriesState?.teams[1]?.score} won={seriesState?.teams[1]?.won} />
                            </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-white/10 text-sm text-white/60">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {series?.startTime ? new Date(series.startTime).toLocaleDateString() : "TBD"}
                            </div>
                            {series?.format && (
                                <div className="flex items-center gap-2">
                                    <Swords className="w-4 h-4" />
                                    Best of {series.format.bestOf}
                                </div>
                            )}
                            {seriesState?.finished && (
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Completed
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {!seriesState && (
                            <button
                                onClick={loadSeriesState}
                                disabled={loadingState}
                                className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg font-medium hover:bg-cyan-500/30 transition-colors disabled:opacity-50"
                            >
                                {loadingState ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Database className="w-4 h-4" />
                                )}
                                Load Live Stats
                            </button>
                        )}
                        <Link
                            href={`/timeline/${seriesId}`}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg font-medium hover:bg-purple-500/30 transition-colors"
                        >
                            <Play className="w-4 h-4" />
                            Timeline Explorer
                        </Link>
                        <Link
                            href={`/generate?teamId=${series?.teams[0]?.id}&seriesId=${seriesId}`}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg font-medium hover:bg-emerald-500/30 transition-colors"
                        >
                            <FileText className="w-4 h-4" />
                            Generate Report
                        </Link>
                    </div>
                </section>

                {/* Games */}
                {seriesState?.games && seriesState.games.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Map className="w-5 h-5 text-cyan-400" />
                            Games
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {seriesState.games.map((game) => (
                                <div
                                    key={game.id}
                                    className="p-4 bg-white/5 border border-white/10 rounded-xl"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-white/60 text-sm">Game {game.sequenceNumber}</span>
                                        <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/60">
                                            {game.map?.name || "Unknown Map"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        {game.teams.map((team, i) => (
                                            <div key={team.id} className={`text-center ${team.won ? "text-emerald-400" : "text-white/60"}`}>
                                                <div className="text-2xl font-bold">{team.score}</div>
                                                <div className="text-xs">{seriesState.teams[i]?.name?.slice(0, 8) || "Team"}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Available Files */}
                {files.length > 0 && (
                    <section>
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-amber-400" />
                            Available Data Files
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {files.map((file, i) => (
                                <div
                                    key={i}
                                    className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between"
                                >
                                    <div>
                                        <div className="font-medium text-white">{file.type || file.name}</div>
                                        <div className="text-sm text-white/40 truncate max-w-xs">{file.fullURL}</div>
                                    </div>
                                    <a
                                        href={file.fullURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 px-3 py-1.5 bg-white/10 text-white/60 rounded-lg text-sm hover:bg-white/20 transition-colors"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        View
                                    </a>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

// ============================================================================
// TEAM DISPLAY COMPONENT
// ============================================================================

function TeamDisplay({ team, score, won }: {
    team: Series["teams"][0] | undefined;
    score?: number;
    won?: boolean;
}) {
    if (!team) {
        return (
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                    <Users className="w-10 h-10 text-white/30" />
                </div>
                <div className="text-xl font-bold text-white/40">TBD</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 ${won ? "ring-2 ring-emerald-500" : ""}`}
                style={{
                    backgroundColor: team.colorPrimary ? `${team.colorPrimary}20` : "rgba(255,255,255,0.1)",
                }}
            >
                {team.logoUrl ? (
                    <img src={team.logoUrl} alt={team.name} className="w-16 h-16 object-contain" />
                ) : (
                    <span
                        className="text-2xl font-bold"
                        style={{ color: team.colorPrimary || "rgba(255,255,255,0.6)" }}
                    >
                        {team.shortName?.slice(0, 2) || team.name.slice(0, 2)}
                    </span>
                )}
            </div>
            <div className={`text-xl font-bold ${won ? "text-emerald-400" : "text-white"}`}>
                {team.name}
            </div>
            {team.shortName && (
                <div className="text-sm text-white/40">{team.shortName}</div>
            )}
        </div>
    );
}
