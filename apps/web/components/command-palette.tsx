"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
    Search, Target, FileText, Users, TrendingUp, Settings, HelpCircle,
    Zap, Clock, Star, ChevronRight, ExternalLink, X, Hash
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

interface CommandItem {
    id: string;
    label: string;
    icon: React.ElementType;
    shortcut?: string[];
    action: () => void;
    group: string;
    badge?: string;
}

interface RecentItem {
    id: string;
    type: "team" | "report" | "search";
    label: string;
    timestamp: Date;
}

// ============================================================================
// STORAGE HELPERS
// ============================================================================

const RECENT_KEY = "scoutedge_recent_searches";
const FAVORITES_KEY = "scoutedge_favorites";

function getRecentSearches(): RecentItem[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(RECENT_KEY);
    return stored ? JSON.parse(stored) : [];
}

function addRecentSearch(item: RecentItem) {
    const recent = getRecentSearches().filter(r => r.id !== item.id);
    recent.unshift(item);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 10)));
}

function getFavorites(): string[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
}

function toggleFavorite(id: string) {
    const favorites = getFavorites();
    const idx = favorites.indexOf(id);
    if (idx >= 0) {
        favorites.splice(idx, 1);
    } else {
        favorites.push(id);
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return favorites;
}

// ============================================================================
// COMMAND PALETTE COMPONENT
// ============================================================================

interface CommandPaletteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
    const router = useRouter();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [search, setSearch] = React.useState("");
    const [recentItems, setRecentItems] = React.useState<RecentItem[]>([]);
    const [favorites, setFavorites] = React.useState<string[]>([]);

    // Load recent/favorites on mount
    React.useEffect(() => {
        setRecentItems(getRecentSearches());
        setFavorites(getFavorites());
    }, [open]);

    // Focus input when opened
    React.useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 0);
        } else {
            setSearch("");
        }
    }, [open]);

    // Handle navigation action
    const handleNavigate = (path: string, label: string) => {
        addRecentSearch({ id: path, type: "search", label, timestamp: new Date() });
        router.push(path);
        onOpenChange(false);
    };

    // Handle external link
    const handleExternal = (url: string, label: string) => {
        addRecentSearch({ id: url, type: "search", label, timestamp: new Date() });
        window.open(url, "_blank");
        onOpenChange(false);
    };

    // Toggle favorite
    const handleToggleFavorite = (id: string) => {
        const newFavs = toggleFavorite(id);
        setFavorites([...newFavs]);
    };

    // Navigation commands
    const navigationCommands: CommandItem[] = [
        { id: "generate", label: "Generate Report", icon: Target, shortcut: ["G"], action: () => handleNavigate("/generate", "Generate Report"), group: "Navigation" },
        { id: "reports", label: "Saved Reports", icon: FileText, shortcut: ["R"], action: () => handleNavigate("/reports", "Saved Reports"), group: "Navigation" },
        { id: "teams", label: "Teams Database", icon: Users, shortcut: ["T"], action: () => handleNavigate("/teams", "Teams Database"), group: "Navigation" },
        { id: "trends", label: "Meta Trends", icon: TrendingUp, shortcut: ["M"], action: () => handleNavigate("/trends", "Meta Trends"), group: "Navigation" },
        { id: "settings", label: "Settings", icon: Settings, shortcut: ["S"], action: () => handleNavigate("/settings", "Settings"), group: "Navigation" },
        { id: "help", label: "Help & Docs", icon: HelpCircle, shortcut: ["?"], action: () => handleNavigate("/help", "Help & Docs"), group: "Navigation" },
    ];

    // Action commands
    const actionCommands: CommandItem[] = [
        { id: "new-report", label: "New Scouting Report", icon: Zap, shortcut: ["⌘", "N"], action: () => handleNavigate("/generate", "New Report"), group: "Actions", badge: "Quick" },
    ];

    // External intel commands
    const intelCommands: CommandItem[] = [
        { id: "vlr", label: "VLR.gg", icon: ExternalLink, action: () => handleExternal("https://www.vlr.gg/", "VLR.gg"), group: "External Intel" },
        { id: "liquipedia", label: "Liquipedia Valorant", icon: ExternalLink, action: () => handleExternal("https://liquipedia.net/valorant/", "Liquipedia"), group: "External Intel" },
        { id: "grid", label: "GRID Esports", icon: ExternalLink, action: () => handleExternal("https://grid.gg/", "GRID Esports"), group: "External Intel" },
    ];

    // Quick Scout teams - use exact names that match generate page dropdown
    const teamCommands: CommandItem[] = [
        // GRID-Verified Teams (Live Data)
        { id: "team-sentinels", label: "Scout: Sentinels (GRID)", icon: Users, action: () => handleNavigate("/generate?team=Sentinels", "Sentinels"), group: "Teams", badge: "LIVE" },
        { id: "team-t1", label: "Scout: T1 (GRID)", icon: Users, action: () => handleNavigate("/generate?team=T1", "T1"), group: "Teams", badge: "LIVE" },
        { id: "team-cloud9", label: "Scout: Cloud9 (GRID)", icon: Users, action: () => handleNavigate("/generate?team=Cloud9", "Cloud9"), group: "Teams", badge: "LIVE" },
        // Demo Teams
        { id: "team-phantom", label: "Scout: Phantom Tactics", icon: Users, action: () => handleNavigate("/generate?team=Phantom%20Tactics", "Phantom Tactics"), group: "Teams" },
        { id: "team-shadow", label: "Scout: Shadow Strike Gaming", icon: Users, action: () => handleNavigate("/generate?team=Shadow%20Strike%20Gaming", "Shadow Strike"), group: "Teams" },
        { id: "team-nova", label: "Scout: Nova Esports", icon: Users, action: () => handleNavigate("/generate?team=Nova%20Esports", "Nova Esports"), group: "Teams" },
    ];

    const allCommands = [...navigationCommands, ...actionCommands, ...intelCommands, ...teamCommands];

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="command-palette-backdrop animate-fade-in"
                onClick={() => onOpenChange(false)}
            />

            {/* Palette */}
            <Command className="command-palette animate-scale-in z-[60]" loop>
                {/* Search input */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Command.Input
                        ref={inputRef}
                        value={search}
                        onValueChange={setSearch}
                        placeholder="Search commands, teams, or type a URL..."
                        className="command-input"
                    />
                    <button
                        onClick={() => onOpenChange(false)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-muted text-muted-foreground"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <Command.List className="command-list scrollbar-thin">
                    <Command.Empty className="p-8 text-center text-muted-foreground text-sm">
                        No results found for "{search}"
                    </Command.Empty>

                    {/* Recent searches - show when no search */}
                    {!search && recentItems.length > 0 && (
                        <Command.Group heading="Recent" className="command-group">
                            <div className="command-group-heading flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                Recent
                            </div>
                            {recentItems.slice(0, 5).map((item) => (
                                <Command.Item
                                    key={item.id}
                                    value={item.label}
                                    onSelect={() => {
                                        if (item.id.startsWith("http")) {
                                            window.open(item.id, "_blank");
                                        } else {
                                            router.push(item.id);
                                        }
                                        if (item.id.startsWith("http")) {
                                            window.open(item.id, "_blank");
                                        } else {
                                            // Force close first to avoid race conditions
                                            onOpenChange(false);
                                            router.push(item.id);
                                        }
                                    }}
                                    className="command-item cursor-pointer"
                                >
                                    <Clock className="command-item-icon w-4 h-4" />
                                    <span className="command-item-label">{item.label}</span>
                                </Command.Item>
                            ))}
                        </Command.Group>
                    )}

                    {/* Favorites - show when no search */}
                    {!search && favorites.length > 0 && (
                        <Command.Group heading="Favorites" className="command-group">
                            <div className="command-group-heading flex items-center gap-2">
                                <Star className="w-3 h-3 text-warning" />
                                Favorites
                            </div>
                            {allCommands.filter(c => favorites.includes(c.id)).map((cmd) => (
                                <Command.Item
                                    key={cmd.id}
                                    value={cmd.label}
                                    onSelect={cmd.action}
                                    className="command-item"
                                >
                                    <cmd.icon className="command-item-icon" />
                                    <span className="command-item-label">{cmd.label}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleToggleFavorite(cmd.id); }}
                                        className="p-1 hover:bg-muted rounded"
                                    >
                                        <Star className="w-3 h-3 text-warning fill-warning" />
                                    </button>
                                </Command.Item>
                            ))}
                        </Command.Group>
                    )}

                    {/* Navigation */}
                    <Command.Group heading="Navigation" className="command-group">
                        <div className="command-group-heading">Navigation</div>
                        {navigationCommands.map((cmd) => (
                            <Command.Item
                                key={cmd.id}
                                value={cmd.label}
                                onSelect={() => {
                                    onOpenChange(false);
                                    cmd.action();
                                }}
                                className="command-item cursor-pointer"
                            >
                                <cmd.icon className="command-item-icon" />
                                <span className="command-item-label">{cmd.label}</span>
                                {cmd.shortcut && (
                                    <div className="command-item-shortcut">
                                        {cmd.shortcut.map((key, i) => (
                                            <kbd key={i} className="command-item-kbd">{key}</kbd>
                                        ))}
                                    </div>
                                )}
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleToggleFavorite(cmd.id); }}
                                    className="p-1 hover:bg-muted rounded"
                                >
                                    <Star className={`w-3 h-3 ${favorites.includes(cmd.id) ? "text-warning fill-warning" : "text-muted-foreground"}`} />
                                </button>
                            </Command.Item>
                        ))}
                    </Command.Group>

                    {/* Actions */}
                    <Command.Group heading="Actions" className="command-group">
                        <div className="command-group-heading">Actions</div>
                        {actionCommands.map((cmd) => (
                            <Command.Item
                                key={cmd.id}
                                value={cmd.label}
                                onSelect={() => {
                                    onOpenChange(false);
                                    cmd.action();
                                }}
                                className="command-item cursor-pointer"
                            >
                                <cmd.icon className="command-item-icon" />
                                <span className="command-item-label">{cmd.label}</span>
                                {cmd.badge && <span className="badge badge-primary">{cmd.badge}</span>}
                                {cmd.shortcut && (
                                    <div className="command-item-shortcut">
                                        {cmd.shortcut.map((key, i) => (
                                            <kbd key={i} className="command-item-kbd">{key}</kbd>
                                        ))}
                                    </div>
                                )}
                            </Command.Item>
                        ))}
                    </Command.Group>

                    {/* Teams */}
                    <Command.Group heading="Teams" className="command-group">
                        <div className="command-group-heading">Quick Scout</div>
                        {teamCommands.map((cmd) => (
                            <Command.Item
                                key={cmd.id}
                                value={cmd.label}
                                onSelect={() => {
                                    onOpenChange(false);
                                    cmd.action();
                                }}
                                className="command-item cursor-pointer"
                            >
                                <cmd.icon className="command-item-icon" />
                                <span className="command-item-label">{cmd.label}</span>
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </Command.Item>
                        ))}
                    </Command.Group>

                    {/* External */}
                    <Command.Group heading="External Intel" className="command-group">
                        <div className="command-group-heading">External Intel</div>
                        {intelCommands.map((cmd) => (
                            <Command.Item
                                key={cmd.id}
                                value={cmd.label}
                                onSelect={() => {
                                    onOpenChange(false);
                                    cmd.action();
                                }}
                                className="command-item cursor-pointer"
                            >
                                <cmd.icon className="command-item-icon" />
                                <span className="command-item-label">{cmd.label}</span>
                            </Command.Item>
                        ))}
                    </Command.Group>
                </Command.List>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-border text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <kbd className="command-item-kbd">↑↓</kbd> Navigate
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="command-item-kbd">↵</kbd> Select
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="command-item-kbd">Esc</kbd> Close
                        </span>
                    </div>
                    <span>⌘K to open</span>
                </div>
            </Command>
        </>
    );
}

// ============================================================================
// COMMAND PALETTE PROVIDER
// ============================================================================

interface CommandPaletteContextValue {
    open: boolean;
    setOpen: (open: boolean) => void;
    toggle: () => void;
}

const CommandPaletteContext = React.createContext<CommandPaletteContextValue>({
    open: false,
    setOpen: () => { },
    toggle: () => { },
});

export function useCommandPalette() {
    return React.useContext(CommandPaletteContext);
}

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(false);

    // Global keyboard shortcut
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // ⌘K or Ctrl+K to open
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen(prev => !prev);
            }
            // Escape to close
            if (e.key === "Escape" && open) {
                setOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open]);

    const toggle = React.useCallback(() => setOpen(prev => !prev), []);

    return (
        <CommandPaletteContext.Provider value={{ open, setOpen, toggle }}>
            {children}
            <CommandPalette open={open} onOpenChange={setOpen} />
        </CommandPaletteContext.Provider>
    );
}
