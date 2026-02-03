"use client";

import { useEffect, useState } from "react";
import { ValorantIcons, LoLIcons } from "./game-icons";

type GameType = "valorant" | "lol" | "unknown";

interface GameThemeProps {
    game: GameType;
}

export function GameTheme({ game }: GameThemeProps) {
    useEffect(() => {
        // Apply theme variables based on game
        const root = document.documentElement;

        if (game === "valorant") {
            root.style.setProperty("--color-primary", "hsl(0 100% 63%)");
            root.style.setProperty("--color-accent", "hsl(0 0% 15%)");
            // Ideally load fonts here or in layout
        } else if (game === "lol") {
            root.style.setProperty("--color-primary", "hsl(46 84% 56%)"); // Gold
            root.style.setProperty("--color-accent", "hsl(205 85% 26%)"); // Deep Blue
        }

        return () => {
            root.style.removeProperty("--color-primary");
            root.style.removeProperty("--color-accent");
        }
    }, [game]);

    if (game === "valorant") return <ValorantDecor />;
    if (game === "lol") return <LoLDecor />;
    return null;
}

function ValorantDecor() {
    const [activeClass, setActiveClass] = useState("Duelist");
    const [decoderHeights, setDecoderHeights] = useState<string[]>([]);
    const classes = ["Duelist", "Controller", "Initiator", "Sentinel"];

    // Expanded Palettes for "Maximalist" Theming (Light Mode Compatible)
    const palettes: Record<string, { primary: string; secondary: string; border: string; ring: string; muted: string }> = {
        "Duelist": {
            primary: "#ff4655",       // Red
            secondary: "#ffe5e6",     // Very pale red
            border: "#ff8a93",        // Soft red border
            ring: "#ff4655",
            muted: "#fff0f1"          // Almost white red
        },
        "Controller": {
            primary: "#b400ff",       // Purple
            secondary: "#f3e5ff",     // Pale purple
            border: "#dba6ff",
            ring: "#b400ff",
            muted: "#f9f0ff"
        },
        "Initiator": {
            primary: "#00ffbc",       // Teal
            secondary: "#e0fffa",     // Pale teal
            border: "#80ffd9",
            ring: "#00ffbc",
            muted: "#f0fffc"
        },
        "Sentinel": {
            primary: "#00f0ff",       // Cyan
            secondary: "#e0fdff",     // Pale cyan
            border: "#80f8ff",
            ring: "#00f0ff",
            muted: "#f0feff"
        }
    };

    // Dynamic Class Theming
    useEffect(() => {
        const root = document.documentElement;
        // Apply the FULL palette of the active class
        const palette = palettes[activeClass];
        if (palette) {
            root.style.setProperty("--color-primary", palette.primary);
            root.style.setProperty("--color-secondary", palette.secondary);
            root.style.setProperty("--color-border", palette.border); // Aggressive borders
            root.style.setProperty("--color-ring", palette.ring);
            root.style.setProperty("--color-muted", palette.muted); // Tinted backgrounds
            root.style.setProperty("--color-accent", palette.primary);
        }

        // Generate random heights on mount/client-side only to avoid hydration mismatch
        setDecoderHeights(Array.from({ length: 5 }).map(() => Math.random() * 24 + 4 + 'px'));
    }, [activeClass]);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Background Texture - subtle noise */}
            <div className="absolute inset-0 bg-[url('https://media.valorant-api.com/maps/2bee0dc9-4ffe-519b-1cbd-7fbe763a6047/splash.png')] opacity-[0.05] bg-cover bg-center grayscale mix-blend-overlay"></div>

            {/* V LOGO - Large Watermark (Increased Opacity) */}
            <div className="absolute top-[-5%] right-[-10%] w-[60vw] h-[60vw] text-[#ff4655] opacity-[0.08] rotate-12">
                <ValorantIcons.Logo className="w-full h-full" />
            </div>

            {/* Right Side HUD - Agent Classes List */}
            <div className="absolute bottom-1/4 right-8 flex flex-col items-end gap-6 pointer-events-auto">
                {/* Header Line */}
                <div className="flex flex-col items-end gap-1 mb-2">
                    <div className="w-1 h-8 bg-[#ff4655]"></div>
                    <span className="text-[10px] font-mono tracking-widest text-foreground/50 uppercase">Class_Select</span>
                </div>

                {/* Icons List */}
                <div className="flex flex-col gap-4 items-end">
                    {classes.map((role) => {
                        const isActive = activeClass === role;
                        // Dynamically get icon component
                        const Icon = ValorantIcons[role as keyof typeof ValorantIcons];
                        const color = palettes[role]?.primary || "#ff4655";

                        return (
                            <button
                                key={role}
                                onClick={() => setActiveClass(role)}
                                className={`group flex items-center gap-4 transition-all duration-300 ${isActive ? "opacity-100 scale-110" : "opacity-30 hover:opacity-100 grayscale hover:grayscale-0 scale-90 hover:scale-100"}`}
                            >
                                <span
                                    className={`text-xs font-bold tracking-wider uppercase transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                                    style={{ color: color }}
                                >
                                    {role}
                                </span>
                                <div className="relative">
                                    {isActive && <div className="absolute inset-0 blur-md opacity-40 animate-pulse" style={{ backgroundColor: color }}></div>}
                                    <div
                                        className={`w-10 h-10 border transition-colors duration-300 flex items-center justify-center`}
                                        style={{
                                            borderColor: isActive ? color : "currentColor",
                                            backgroundColor: isActive ? `${color}1A` : "transparent" // 10% opacity
                                        }}
                                    >
                                        <Icon
                                            className="w-6 h-6 transition-colors duration-300"
                                            style={{ color: isActive ? color : "currentColor" }}
                                        />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Decoder Lines */}
                <div className="flex gap-1 mt-4 opacity-20">
                    <div className="flex gap-1 mt-4 opacity-20">
                        {decoderHeights.map((h, i) => (
                            <div key={i} className="w-1 h-6 bg-foreground" style={{ height: h }}></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Left Side "Protocol" Text & Bars */}
            <div className="absolute top-32 left-8 hidden lg:flex flex-col gap-2">
                <div className="w-6 h-1 bg-[#ff4655]"></div>
                <div className="writing-vertical-rl text-[10px] font-mono tracking-[0.3em] text-foreground/30 uppercase h-32 border-l border-foreground/10 pl-2">
                    Protocol_781-A // Verified
                </div>
            </div>

        </div>
    );
}

function LoLDecor() {
    const [activeRole, setActiveRole] = useState("Mid");
    const roles = ["Top", "Jungle", "Mid", "Bot", "Support"];

    // Expanded Palettes for LoL (Light Mode Compatible)
    const palettes: Record<string, { primary: string; secondary: string; border: string; ring: string; muted: string }> = {
        "Top": {
            primary: "#ff9900",       // Orange
            secondary: "#fff0e0",     // Pale Orange
            border: "#ffcc80",
            ring: "#ff9900",
            muted: "#fff8f0"
        },
        "Jungle": {
            primary: "#2deb32",       // Green
            secondary: "#e8fce8",     // Pale Green
            border: "#9dfba0",
            ring: "#2deb32",
            muted: "#f0fdf0"
        },
        "Mid": {
            primary: "#c8aa6e",       // Gold
            secondary: "#fbf6ec",     // Pale Gold
            border: "#e5d5b7",
            ring: "#c8aa6e",
            muted: "#fdfbf6"
        },
        "Bot": {
            primary: "#0099ff",       // Blue
            secondary: "#e0f2ff",     // Pale Blue
            border: "#80caff",
            ring: "#0099ff",
            muted: "#f0faff"
        },
        "Support": {
            primary: "#00e6cc",       // Teal
            secondary: "#e0fcf9",     // Pale Teal
            border: "#80f2e6",
            ring: "#00e6cc",
            muted: "#f0fefc"
        }
    };

    // Dynamic Role Theming
    useEffect(() => {
        const root = document.documentElement;
        const palette = palettes[activeRole];

        if (palette) {
            root.style.setProperty("--color-primary", palette.primary);
            root.style.setProperty("--color-secondary", palette.secondary);
            root.style.setProperty("--color-border", palette.border);
            root.style.setProperty("--color-ring", palette.ring);
            root.style.setProperty("--color-muted", palette.muted);
            root.style.setProperty("--color-accent", palette.primary);
        }
    }, [activeRole]);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Background Texture - Hextech Magic */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#091428]/0 to-[#091428]/05"></div>

            {/* L LOGO - Watermark */}
            <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] text-[#c8aa6e] opacity-[0.06]">
                <LoLIcons.Logo className="w-full h-full" />
            </div>

            {/* Hextech Border Lines */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#c8aa6e]/40 to-transparent"></div>
            <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#c8aa6e]/40 to-transparent"></div>

            {/* Right Side HUD - Role Selection */}
            <div className="absolute bottom-1/4 right-8 flex flex-col items-center gap-6 pointer-events-auto">
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#c8aa6e] to-transparent"></div>

                <div className="flex flex-col gap-3">
                    {roles.map((role) => {
                        const isActive = activeRole === role;
                        const Icon = LoLIcons[role as keyof typeof LoLIcons];
                        const color = palettes[role]?.primary || "#c8aa6e";

                        return (
                            <button
                                key={role}
                                onClick={() => setActiveRole(role)}
                                className={`group relative transition-all duration-300 ${isActive ? "scale-110 opacity-100 z-10" : "scale-90 opacity-40 hover:opacity-100 hover:scale-100 grayscale hover:grayscale-0"}`}
                            >
                                {isActive && <div className="absolute inset-0 blur-md opacity-20 animate-pulse" style={{ backgroundColor: color }}></div>}
                                <div
                                    className={`w-12 h-12 border rotate-45 flex items-center justify-center transition-all duration-300 ${isActive ? "bg-[#091428]/60 backdrop-blur-sm shadow-[0_0_15px_rgba(10,200,185,0.3)]" : "border-[#c8aa6e]/50 hover:border-[#c8aa6e]"}`}
                                    style={{ borderColor: isActive ? color : undefined }}
                                >
                                    <div className="-rotate-45">
                                        <Icon
                                            className="w-6 h-6 transition-colors duration-300"
                                            style={{ color: isActive ? color : (role === "Mid" ? "#c8aa6e" : "#c8aa6e") }} // Default to gold when inactive
                                        />
                                    </div>
                                </div>

                                {/* Label Tooltip */}
                                <span
                                    className={`absolute right-full mr-4 top-1/2 -translate-y-1/2 text-[10px] font-serif tracking-widest uppercase transition-all duration-300 whitespace-nowrap ${isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`}
                                    style={{ color: color }}
                                >
                                    {role} Line
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Ornamental Corners */}
            <div className="absolute top-24 left-10 w-32 h-32 border-l border-t border-[#0ac8b9] rounded-tl-3xl opacity-10"></div>

            <div className="absolute top-1/3 left-10 text-[#c8aa6e] opacity-10 rotate-45">
                <div className="w-20 h-20 border border-current"></div>
            </div>
        </div>
    );
}
