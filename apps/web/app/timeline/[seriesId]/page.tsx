"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    ChevronRight,
    Loader2,
    Search,
    Filter,
    Clock,
    Target,
    Skull,
    Flag,
    Zap,
    Star,
    ChevronDown,
    Gamepad2
} from "lucide-react";
import type { TimelineEvent } from "@/lib/data-provider/types";

// ============================================================================
// TIMELINE EXPLORER PAGE
// ============================================================================
// Parse and explore events from GRID series files
// ============================================================================

const EVENT_ICONS: Record<string, React.ReactNode> = {
    kill: <Skull className="w-4 h-4 text-red-400" />,
    death: <Skull className="w-4 h-4 text-slate-400" />,
    plant: <Flag className="w-4 h-4 text-emerald-400" />,
    defuse: <Target className="w-4 h-4 text-cyan-400" />,
    round_start: <Zap className="w-4 h-4 text-amber-400" />,
    round_end: <Star className="w-4 h-4 text-purple-400" />,
    ability_use: <Zap className="w-4 h-4 text-blue-400" />,
    damage: <Target className="w-4 h-4 text-orange-400" />,
};

const EVENT_COLORS: Record<string, string> = {
    kill: "border-red-500/30 bg-red-500/10",
    death: "border-slate-500/30 bg-slate-500/10",
    plant: "border-emerald-500/30 bg-emerald-500/10",
    defuse: "border-cyan-500/30 bg-cyan-500/10",
    round_start: "border-amber-500/30 bg-amber-500/10",
    round_end: "border-purple-500/30 bg-purple-500/10",
    ability_use: "border-blue-500/30 bg-blue-500/10",
    default: "border-white/10 bg-white/5",
};

export default function TimelineExplorerPage() {
    const params = useParams();
    const seriesId = params.seriesId as string;

    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedGame, setSelectedGame] = useState<number | null>(null);
    const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

    useEffect(() => {
        loadEvents();
    }, [seriesId]);

    const loadEvents = async () => {
        setLoading(true);
        setError(null);

        try {
            // First, list available files
            const listResponse = await fetch(`/api/grid/file-download?seriesId=${seriesId}`);
            if (!listResponse.ok) {
                // Demo fallback
                setEvents(generateDemoEvents());
                setLoading(false);
                return;
            }

            const listData = await listResponse.json();
            const eventsFile = listData.files?.find((f: { type: string }) => f.type === "events");

            if (!eventsFile) {
                // Demo fallback
                setEvents(generateDemoEvents());
                setLoading(false);
                return;
            }

            // Download events file
            const downloadResponse = await fetch(
                `/api/grid/file-download?url=${encodeURIComponent(eventsFile.fullURL)}`
            );

            if (!downloadResponse.ok) {
                setEvents(generateDemoEvents());
                setLoading(false);
                return;
            }

            const downloadData = await downloadResponse.json();
            setEvents(downloadData.content || []);
        } catch (err) {
            console.error("Failed to load events:", err);
            setEvents(generateDemoEvents());
        } finally {
            setLoading(false);
        }
    };

    // Get unique event types and games
    const eventTypes = useMemo(() => {
        const types = new Set(events.map(e => e.type));
        return Array.from(types).sort();
    }, [events]);

    const gameNumbers = useMemo(() => {
        const games = new Set(events.filter(e => e.gameNumber).map(e => e.gameNumber!));
        return Array.from(games).sort((a, b) => a - b);
    }, [events]);

    // Filter events
    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            // Type filter
            if (selectedTypes.length > 0 && !selectedTypes.includes(event.type)) {
                return false;
            }

            // Game filter
            if (selectedGame !== null && event.gameNumber !== selectedGame) {
                return false;
            }

            // Search filter
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const actorName = event.actor?.name?.toLowerCase() || "";
                const targetName = event.target?.name?.toLowerCase() || "";
                const eventType = event.type.toLowerCase();

                if (!actorName.includes(q) && !targetName.includes(q) && !eventType.includes(q)) {
                    return false;
                }
            }

            return true;
        });
    }, [events, selectedTypes, selectedGame, searchQuery]);

    // Compute key moments
    const keyMoments = useMemo(() => {
        return filteredEvents.filter(e =>
            e.type === "kill" ||
            e.type === "plant" ||
            e.type === "defuse" ||
            e.type === "round_end"
        );
    }, [filteredEvents]);

    const toggleType = (type: string) => {
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-white/60 animate-spin" />
                    <span className="text-white/40">Loading timeline events...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <Link href="/generate" className="hover:text-white transition-colors flex items-center gap-1">
                                <Gamepad2 className="w-4 h-4" />
                                ScoutEdge
                            </Link>
                            <ChevronRight className="w-4 h-4" />
                            <Link href="/directory" className="hover:text-white transition-colors">Directory</Link>
                            <ChevronRight className="w-4 h-4" />
                            <Link href={`/series/${seriesId}`} className="hover:text-white transition-colors">
                                Series
                            </Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-white">Timeline</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-white/40">
                                {filteredEvents.length} events
                            </span>
                            <span className="text-sm text-purple-400">
                                {keyMoments.length} key moments
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex gap-6">
                    {/* Sidebar Filters */}
                    <aside className="w-64 shrink-0">
                        <div className="sticky top-24 space-y-6">
                            {/* Search */}
                            <div>
                                <label className="text-sm font-medium text-white/60 mb-2 block">Search</label>
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                    <input
                                        type="text"
                                        placeholder="Player, event..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    />
                                </div>
                            </div>

                            {/* Game Filter */}
                            {gameNumbers.length > 1 && (
                                <div>
                                    <label className="text-sm font-medium text-white/60 mb-2 block">Game</label>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedGame(null)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedGame === null
                                                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                                    : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
                                                }`}
                                        >
                                            All
                                        </button>
                                        {gameNumbers.map(game => (
                                            <button
                                                key={game}
                                                onClick={() => setSelectedGame(game)}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedGame === game
                                                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                                        : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
                                                    }`}
                                            >
                                                Game {game}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Event Type Filter */}
                            <div>
                                <label className="text-sm font-medium text-white/60 mb-2 block flex items-center gap-2">
                                    <Filter className="w-4 h-4" />
                                    Event Types
                                </label>
                                <div className="space-y-1.5">
                                    {eventTypes.map(type => (
                                        <button
                                            key={type}
                                            onClick={() => toggleType(type)}
                                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${selectedTypes.includes(type) || selectedTypes.length === 0
                                                    ? "bg-white/10 text-white"
                                                    : "bg-white/5 text-white/40 hover:bg-white/10"
                                                }`}
                                        >
                                            {EVENT_ICONS[type] || <Zap className="w-4 h-4 text-white/40" />}
                                            <span className="capitalize">{type.replace(/_/g, " ")}</span>
                                            <span className="ml-auto text-xs text-white/40">
                                                {events.filter(e => e.type === type).length}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Events List */}
                    <main className="flex-1 min-w-0">
                        <div className="space-y-2">
                            {filteredEvents.length === 0 ? (
                                <div className="text-center py-12 text-white/40">
                                    No events match your filters
                                </div>
                            ) : (
                                filteredEvents.map((event, index) => (
                                    <EventCard
                                        key={event.id || index}
                                        event={event}
                                        isExpanded={expandedEvent === (event.id || String(index))}
                                        onToggle={() => setExpandedEvent(
                                            expandedEvent === (event.id || String(index))
                                                ? null
                                                : (event.id || String(index))
                                        )}
                                    />
                                ))
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// EVENT CARD COMPONENT
// ============================================================================

function EventCard({
    event,
    isExpanded,
    onToggle
}: {
    event: TimelineEvent;
    isExpanded: boolean;
    onToggle: () => void;
}) {
    const colorClasses = EVENT_COLORS[event.type] || EVENT_COLORS.default;

    return (
        <div className={`border rounded-xl overflow-hidden transition-all ${colorClasses}`}>
            <button
                onClick={onToggle}
                className="w-full flex items-center gap-4 p-4 text-left"
            >
                <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center shrink-0">
                    {EVENT_ICONS[event.type] || <Zap className="w-4 h-4 text-white/40" />}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-white capitalize">
                            {event.type.replace(/_/g, " ")}
                        </span>
                        {event.gameNumber && (
                            <span className="text-xs px-2 py-0.5 bg-white/10 rounded text-white/60">
                                Game {event.gameNumber}
                            </span>
                        )}
                    </div>
                    <div className="text-sm text-white/60 truncate">
                        {event.actor?.name && (
                            <span className="text-cyan-400">{event.actor.name}</span>
                        )}
                        {event.target?.name && (
                            <>
                                <span className="mx-2">→</span>
                                <span className="text-red-400">{event.target.name}</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-1 text-sm text-white/40">
                        <Clock className="w-3.5 h-3.5" />
                        {event.timestamp}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </div>
            </button>

            {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-white/5">
                    <pre className="text-xs text-white/60 bg-black/20 rounded-lg p-3 overflow-x-auto">
                        {JSON.stringify(event, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// DEMO DATA GENERATOR
// ============================================================================

function generateDemoEvents(): TimelineEvent[] {
    return [
        { id: "1", sequenceNumber: 1, type: "round_start", timestamp: "00:01:30", gameNumber: 1 },
        { id: "2", sequenceNumber: 2, type: "kill", timestamp: "00:02:15", gameNumber: 1, actor: { type: "player", id: "p1", name: "Viper_Main", teamId: "t1" }, target: { type: "player", id: "p6", name: "OpponentPlayer1", teamId: "t2" } },
        { id: "3", sequenceNumber: 3, type: "kill", timestamp: "00:02:22", gameNumber: 1, actor: { type: "player", id: "p2", name: "FlashBang", teamId: "t1" }, target: { type: "player", id: "p7", name: "OpponentPlayer2", teamId: "t2" } },
        { id: "4", sequenceNumber: 4, type: "plant", timestamp: "00:02:45", gameNumber: 1, actor: { type: "player", id: "p3", name: "Entry_King", teamId: "t1" } },
        { id: "5", sequenceNumber: 5, type: "kill", timestamp: "00:03:05", gameNumber: 1, actor: { type: "player", id: "p8", name: "OpponentPlayer3", teamId: "t2" }, target: { type: "player", id: "p3", name: "Entry_King", teamId: "t1" } },
        { id: "6", sequenceNumber: 6, type: "kill", timestamp: "00:03:18", gameNumber: 1, actor: { type: "player", id: "p4", name: "SilentWall", teamId: "t1" }, target: { type: "player", id: "p8", name: "OpponentPlayer3", teamId: "t2" } },
        { id: "7", sequenceNumber: 7, type: "round_end", timestamp: "00:03:30", gameNumber: 1 },
        { id: "8", sequenceNumber: 8, type: "round_start", timestamp: "00:04:00", gameNumber: 1 },
        { id: "9", sequenceNumber: 9, type: "ability_use", timestamp: "00:04:15", gameNumber: 1, actor: { type: "player", id: "p1", name: "Viper_Main", teamId: "t1" } },
        { id: "10", sequenceNumber: 10, type: "kill", timestamp: "00:04:30", gameNumber: 1, actor: { type: "player", id: "p6", name: "OpponentPlayer1", teamId: "t2" }, target: { type: "player", id: "p5", name: "X_Factor", teamId: "t1" } },
    ];
}
