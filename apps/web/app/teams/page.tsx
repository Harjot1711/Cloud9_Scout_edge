"use client";

import { AppShell } from "@/components/app-shell";
import { Users, ExternalLink, Search, Trophy, MapPin, Calendar } from "lucide-react";
import Link from "next/link";

const teams = [
    {
        id: "phantom-tactics",
        name: "Phantom Tactics",
        region: "NA",
        rank: 12,
        vlrUrl: "https://www.vlr.gg/team/8127/sentinels",
        liquipediaUrl: "https://liquipedia.net/valorant/Sentinels",
        recentForm: "W-W-L-W-W",
        players: ["Phantom", "Spectre", "Ghost", "Shadow", "Wraith"],
        maps: ["Ascent", "Haven", "Bind", "Split"],
    },
    {
        id: "shadow-strike",
        name: "Shadow Strike Gaming",
        region: "EU",
        rank: 8,
        vlrUrl: "https://www.vlr.gg/team/2593/fnatic",
        liquipediaUrl: "https://liquipedia.net/valorant/Fnatic",
        recentForm: "W-L-W-W-L",
        players: ["Ace", "Viper", "Cipher", "Nova", "Storm"],
        maps: ["Lotus", "Pearl", "Haven", "Icebox"],
    },
    {
        id: "nova-esports",
        name: "Nova Esports",
        region: "KR",
        rank: 4,
        vlrUrl: "https://www.vlr.gg/team/6961/drx",
        liquipediaUrl: "https://liquipedia.net/valorant/DRX",
        recentForm: "W-W-W-L-W",
        players: ["Flash", "Smoke", "Sage", "Fade", "Breach"],
        maps: ["Bind", "Ascent", "Fracture", "Sunset"],
    },
    {
        id: "crimson-force",
        name: "Crimson Force",
        region: "APAC",
        rank: 15,
        vlrUrl: "https://www.vlr.gg/team/8128/paper-rex",
        liquipediaUrl: "https://liquipedia.net/valorant/Paper_Rex",
        recentForm: "L-W-L-W-W",
        players: ["Blaze", "Frost", "Edge", "Core", "Flux"],
        maps: ["Haven", "Lotus", "Pearl", "Split"],
    },
    {
        id: "apex-legion",
        name: "Apex Legion",
        region: "NA",
        rank: 6,
        vlrUrl: "https://www.vlr.gg/team/8127/sentinels",
        liquipediaUrl: "https://liquipedia.net/valorant/Sentinels",
        recentForm: "W-W-W-W-L",
        players: ["Titan", "Razor", "Pulse", "Vector", "Prime"],
        maps: ["Ascent", "Sunset", "Bind", "Haven"],
    },
];

export default function TeamsPage() {
    return (
        <AppShell title="Teams Database" subtitle="Browse teams and generate scouting reports">
            <div className="p-6 max-w-6xl mx-auto">
                {/* Search */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search teams..."
                            className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                </div>

                {/* Teams Grid */}
                <div className="grid-2-col">
                    {teams.map((team, index) => (
                        <div
                            key={team.id}
                            className={`card-base p-5 hover-lift animate-slide-up stagger-${(index % 6) + 1}`}
                            style={{ opacity: 0 }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-title text-foreground mb-1">{team.name}</h3>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {team.region}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Trophy className="w-3.5 h-3.5 text-primary" />
                                            Rank #{team.rank}
                                        </span>
                                    </div>
                                </div>
                                <span className="badge badge-primary">
                                    {team.recentForm.split("-").filter(r => r === "W").length}-{team.recentForm.split("-").filter(r => r === "L").length}
                                </span>
                            </div>

                            {/* Players */}
                            <div className="mb-4">
                                <p className="text-overline mb-2">Roster</p>
                                <div className="flex gap-1.5 flex-wrap">
                                    {team.players.map((player) => (
                                        <span key={player} className="badge badge-muted text-[10px]">{player}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Maps */}
                            <div className="mb-4">
                                <p className="text-overline mb-2">Map Pool</p>
                                <div className="flex gap-1.5 flex-wrap">
                                    {team.maps.map((map) => (
                                        <span key={map} className="badge badge-secondary text-[10px]">{map}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-border">
                                <div className="flex gap-2">
                                    <a
                                        href={team.vlrUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="external-link text-sm"
                                    >
                                        VLR.gg <ExternalLink className="w-3 h-3" />
                                    </a>
                                    <a
                                        href={team.liquipediaUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="external-link text-sm"
                                    >
                                        Liquipedia <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                                <Link
                                    href={`/generate?team=${team.id}`}
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    Scout →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Data Source */}
                <div className="mt-8 p-4 rounded-lg bg-muted border border-border flex items-center gap-4 animate-fade-in">
                    <div className="data-source">
                        <span className="data-source-dot" />
                        <span>Data from GRID API</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Team data synced with{" "}
                        <a href="https://www.vlr.gg/" target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline hover:text-primary">
                            VLR.gg
                        </a>
                        {" "}and{" "}
                        <a href="https://liquipedia.net/valorant/" target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline hover:text-primary">
                            Liquipedia
                        </a>
                    </p>
                </div>
            </div>
        </AppShell>
    );
}
