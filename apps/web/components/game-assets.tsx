"use client";

// ============================================================================
// GAME ASSETS - Icons and Visual Elements
// ============================================================================
// Static identity labels for agents, champions, maps, and game titles
// Assets used for non-commercial demo purposes
// ============================================================================

import React from "react";
import {
    Crosshair, Shield, Users, Zap, Wind, Skull, Eye, Target,
    Flame, Snowflake, Cloud, Star, Moon, Sun, Sword, Bomb
} from "lucide-react";

// ============================================================================
// VALORANT AGENT ICONS (Lucide abstraction - no copyrighted assets)
// ============================================================================

const AGENT_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
    // Duelists
    "Jett": { icon: Wind, color: "#7DD3FC" },
    "Raze": { icon: Bomb, color: "#FB923C" },
    "Phoenix": { icon: Flame, color: "#EF4444" },
    "Reyna": { icon: Eye, color: "#A855F7" },
    "Yoru": { icon: Moon, color: "#3B82F6" },
    "Neon": { icon: Zap, color: "#22D3EE" },
    "Iso": { icon: Sword, color: "#8B5CF6" },
    // Controllers
    "Viper": { icon: Skull, color: "#22C55E" },
    "Brimstone": { icon: Cloud, color: "#F97316" },
    "Omen": { icon: Moon, color: "#6366F1" },
    "Astra": { icon: Star, color: "#A855F7" },
    "Harbor": { icon: Cloud, color: "#0EA5E9" },
    "Clove": { icon: Star, color: "#EC4899" },
    // Initiators
    "Sova": { icon: Target, color: "#3B82F6" },
    "Breach": { icon: Sun, color: "#F59E0B" },
    "Skye": { icon: Sun, color: "#22C55E" },
    "KAY/O": { icon: Crosshair, color: "#6B7280" },
    "Fade": { icon: Eye, color: "#1F2937" },
    "Gekko": { icon: Star, color: "#4ADE80" },
    // Sentinels
    "Cypher": { icon: Eye, color: "#EAB308" },
    "Killjoy": { icon: Shield, color: "#FACC15" },
    "Sage": { icon: Snowflake, color: "#06B6D4" },
    "Chamber": { icon: Target, color: "#D4A574" },
    "Deadlock": { icon: Shield, color: "#6B21A8" },
    "Vyse": { icon: Shield, color: "#7C3AED" },
};

// ============================================================================
// LOL ROLE ICONS (Abstract representation)
// ============================================================================

const ROLE_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
    "Top": { icon: Sword, color: "#EF4444" },
    "Jungle": { icon: Users, color: "#22C55E" },
    "Mid": { icon: Zap, color: "#3B82F6" },
    "ADC": { icon: Crosshair, color: "#F59E0B" },
    "Support": { icon: Shield, color: "#8B5CF6" },
};

// ============================================================================
// VALORANT MAP IDENTITIES
// ============================================================================

const MAP_DATA: Record<string, { color: string; abbreviation: string }> = {
    "Ascent": { color: "#F97316", abbreviation: "ASC" },
    "Bind": { color: "#EAB308", abbreviation: "BND" },
    "Haven": { color: "#22C55E", abbreviation: "HVN" },
    "Split": { color: "#3B82F6", abbreviation: "SPL" },
    "Icebox": { color: "#06B6D4", abbreviation: "ICE" },
    "Breeze": { color: "#22D3EE", abbreviation: "BRZ" },
    "Fracture": { color: "#A855F7", abbreviation: "FRC" },
    "Pearl": { color: "#EC4899", abbreviation: "PRL" },
    "Lotus": { color: "#84CC16", abbreviation: "LTS" },
    "Sunset": { color: "#F97316", abbreviation: "SNS" },
    "Abyss": { color: "#6366F1", abbreviation: "ABY" },
};

// ============================================================================
// GAME TITLE BADGES
// ============================================================================

export function GameTitleBadge({ title, size = "md" }: { title: "VALORANT" | "LoL"; size?: "sm" | "md" | "lg" }) {
    const sizes = {
        sm: "w-4 h-4 text-[8px]",
        md: "w-6 h-6 text-[10px]",
        lg: "w-8 h-8 text-xs",
    };

    if (title === "VALORANT") {
        return (
            <div className={`${sizes[size]} rounded flex items-center justify-center bg-red-500/20 border border-red-500/30`}>
                <span className="font-bold text-red-400">V</span>
            </div>
        );
    }

    return (
        <div className={`${sizes[size]} rounded flex items-center justify-center bg-blue-500/20 border border-blue-500/30`}>
            <span className="font-bold text-blue-400">L</span>
        </div>
    );
}

// ============================================================================
// AGENT ICON COMPONENT
// ============================================================================

export function AgentIcon({
    agent,
    size = 20,
    showLabel = false
}: {
    agent: string;
    size?: number;
    showLabel?: boolean;
}) {
    const data = AGENT_ICONS[agent] || { icon: Users, color: "#6B7280" };
    const Icon = data.icon;

    return (
        <div className="flex items-center gap-1.5">
            <div
                className="rounded-md flex items-center justify-center"
                style={{
                    width: size,
                    height: size,
                    backgroundColor: `${data.color}20`,
                    border: `1px solid ${data.color}40`
                }}
            >
                <Icon style={{ width: size * 0.6, height: size * 0.6, color: data.color }} />
            </div>
            {showLabel && <span className="text-xs text-foreground">{agent}</span>}
        </div>
    );
}

// ============================================================================
// AGENT LIST (Multiple agents)
// ============================================================================

export function AgentList({ agents, maxShow = 3 }: { agents: string[]; maxShow?: number }) {
    const visible = agents.slice(0, maxShow);
    const remaining = agents.length - maxShow;

    return (
        <div className="flex items-center gap-1">
            {visible.map((agent) => (
                <AgentIcon key={agent} agent={agent} size={20} />
            ))}
            {remaining > 0 && (
                <span className="text-xs text-muted-foreground ml-1">+{remaining}</span>
            )}
        </div>
    );
}

// ============================================================================
// ROLE ICON COMPONENT (LoL)
// ============================================================================

export function RoleIcon({
    role,
    size = 20,
    showLabel = false
}: {
    role: string;
    size?: number;
    showLabel?: boolean;
}) {
    const data = ROLE_ICONS[role] || { icon: Users, color: "#6B7280" };
    const Icon = data.icon;

    return (
        <div className="flex items-center gap-1.5">
            <div
                className="rounded-md flex items-center justify-center"
                style={{
                    width: size,
                    height: size,
                    backgroundColor: `${data.color}20`,
                    border: `1px solid ${data.color}40`
                }}
            >
                <Icon style={{ width: size * 0.6, height: size * 0.6, color: data.color }} />
            </div>
            {showLabel && <span className="text-xs text-foreground">{role}</span>}
        </div>
    );
}

// ============================================================================
// MAP BADGE COMPONENT
// ============================================================================

export function MapBadge({
    map,
    size = "md",
    showName = true
}: {
    map: string;
    size?: "sm" | "md" | "lg";
    showName?: boolean;
}) {
    const data = MAP_DATA[map] || { color: "#6B7280", abbreviation: map.slice(0, 3).toUpperCase() };

    const sizes = {
        sm: "px-1.5 py-0.5 text-[10px]",
        md: "px-2 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
    };

    return (
        <div
            className={`rounded-md font-medium inline-flex items-center gap-1.5 ${sizes[size]}`}
            style={{
                backgroundColor: `${data.color}20`,
                border: `1px solid ${data.color}40`,
                color: data.color
            }}
        >
            <span className="font-bold">{data.abbreviation}</span>
            {showName && size !== "sm" && <span className="opacity-80">{map}</span>}
        </div>
    );
}

// ============================================================================
// MAP LIST (Multiple maps)
// ============================================================================

export function MapList({ maps, maxShow = 4 }: { maps: string[]; maxShow?: number }) {
    const visible = maps.slice(0, maxShow);
    const remaining = maps.length - maxShow;

    return (
        <div className="flex flex-wrap gap-1.5">
            {visible.map((map) => (
                <MapBadge key={map} map={map} size="sm" showName={false} />
            ))}
            {remaining > 0 && (
                <span className="text-xs text-muted-foreground px-1.5 py-0.5">+{remaining}</span>
            )}
        </div>
    );
}

// ============================================================================
// EVENT TYPE ICONS (for Timeline)
// ============================================================================

export function EventTypeIcon({
    type,
    size = 16
}: {
    type: string;
    size?: number;
}) {
    const eventTypes: Record<string, { icon: React.ElementType; color: string }> = {
        "kill": { icon: Skull, color: "#EF4444" },
        "death": { icon: Skull, color: "#6B7280" },
        "plant": { icon: Bomb, color: "#22C55E" },
        "defuse": { icon: Shield, color: "#3B82F6" },
        "ability": { icon: Zap, color: "#A855F7" },
        "objective": { icon: Target, color: "#F59E0B" },
        "round_start": { icon: Sun, color: "#FACC15" },
        "round_end": { icon: Moon, color: "#8B5CF6" },
    };

    const data = eventTypes[type] || { icon: Zap, color: "#6B7280" };
    const Icon = data.icon;

    return (
        <div
            className="rounded flex items-center justify-center"
            style={{
                width: size + 8,
                height: size + 8,
                backgroundColor: `${data.color}20`
            }}
        >
            <Icon style={{ width: size, height: size, color: data.color }} />
        </div>
    );
}

// ============================================================================
// LICENSING FOOTER
// ============================================================================

export function AssetLicenseFooter() {
    return (
        <div className="mt-8 pt-4 border-t border-border/50 text-center">
            <p className="text-xs text-muted-foreground/60">
                Game assets and icons are used for non-commercial demo purposes.
                VALORANT™ is a trademark of Riot Games, Inc.
                League of Legends™ is a trademark of Riot Games, Inc.
            </p>
        </div>
    );
}
