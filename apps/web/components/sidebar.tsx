"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Target, FileText, Users, TrendingUp, Settings, HelpCircle,
    ChevronLeft, ChevronRight, ExternalLink, Database, Zap,
    ChevronDown, ChevronUp, Search
} from "lucide-react";
import { useCommandPalette } from "./command-palette";
import { useDataSource, DataSourceToggle } from "./data-source-provider";

// ============================================================================
// TYPES
// ============================================================================

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
    description?: string;
    badge?: string;
}

interface NavGroup {
    name: string;
    items: NavItem[];
    collapsible?: boolean;
}

// ============================================================================
// NAV STRUCTURE
// ============================================================================

const mainNavGroups: NavGroup[] = [
    {
        name: "Scouting",
        items: [
            { name: "Generate", href: "/generate", icon: Target, description: "Create report" },
            { name: "Reports", href: "/reports", icon: FileText, description: "Saved intel" },
        ],
    },
    {
        name: "Database",
        items: [
            { name: "Teams", href: "/teams", icon: Users, description: "Browse teams" },
            { name: "Meta", href: "/trends", icon: TrendingUp, description: "Trends", badge: "NEW" },
        ],
    },
];

const externalLinks: NavItem[] = [
    { name: "VLR.gg", href: "https://www.vlr.gg/", icon: ExternalLink },
    { name: "Liquipedia", href: "https://liquipedia.net/valorant/", icon: ExternalLink },
    { name: "GRID Docs", href: "https://grid.gg/", icon: ExternalLink },
];

const bottomNav: NavItem[] = [
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Help", href: "/help", icon: HelpCircle },
];

// ============================================================================
// COLLAPSIBLE SIDEBAR
// ============================================================================

interface SidebarProps {
    collapsed?: boolean;
    onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed: controlledCollapsed, onCollapsedChange }: SidebarProps) {
    const pathname = usePathname();
    const { toggle: toggleCommandPalette } = useCommandPalette();
    const { source, config } = useDataSource();
    const [internalCollapsed, setInternalCollapsed] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        "Scouting": true,
        "Database": true,
        "External Intel": false,
    });

    // Support both controlled and uncontrolled modes
    const collapsed = controlledCollapsed ?? internalCollapsed;
    const setCollapsed = onCollapsedChange ?? setInternalCollapsed;

    // Load collapsed state from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("sidebar_collapsed");
        if (stored !== null && !onCollapsedChange) {
            setInternalCollapsed(stored === "true");
        }
    }, [onCollapsedChange]);

    // Save collapsed state
    const handleToggleCollapse = () => {
        const newValue = !collapsed;
        setCollapsed(newValue);
        localStorage.setItem("sidebar_collapsed", String(newValue));
    };

    // Toggle group expansion
    const toggleGroup = (name: string) => {
        setExpandedGroups(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const isActive = (href: string) => pathname === href;

    return (
        <aside
            className={`fixed top-0 left-0 bottom-0 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-out z-40 ${collapsed ? "w-16" : "w-60"
                }`}
        >
            {/* Header */}
            <div className={`h-14 border-b border-sidebar-border flex items-center ${collapsed ? "justify-center px-2" : "px-4 gap-3"}`}>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary" />
                </div>
                {!collapsed && (
                    <div className="flex-1 min-w-0">
                        <h1 className="text-sm font-bold text-sidebar-foreground tracking-tight">ScoutEdge</h1>
                        <p className="text-[10px] text-sidebar-muted truncate">Tactical Intelligence</p>
                    </div>
                )}
            </div>

            {/* Search trigger */}
            <div className={`px-2 py-3 border-b border-sidebar-border ${collapsed ? "flex justify-center" : ""}`}>
                <button
                    onClick={toggleCommandPalette}
                    className={`flex items-center gap-2 h-9 rounded-lg border border-sidebar-border bg-sidebar hover:bg-muted transition-colors text-sidebar-muted text-sm ${collapsed ? "w-10 justify-center" : "w-full px-3"
                        }`}
                >
                    <Search className="w-4 h-4" />
                    {!collapsed && (
                        <>
                            <span className="flex-1 text-left text-xs">Search...</span>
                            <kbd className="px-1.5 py-0.5 text-[10px] bg-background rounded border border-border">⌘K</kbd>
                        </>
                    )}
                </button>
            </div>

            {/* Data Source Toggle */}
            {!collapsed && (
                <div className="px-3 py-2 border-b border-sidebar-border">
                    <DataSourceToggle showLabel={false} />
                    <div className="mt-2 flex items-center gap-2 px-1">
                        <span className={`w-2 h-2 rounded-full ${source === "demo"
                                ? "bg-success"
                                : config.isAvailable
                                    ? "bg-primary animate-pulse"
                                    : "bg-warning"
                            }`} />
                        <span className="text-[10px] text-sidebar-muted">
                            {source === "demo" ? "Using local fixtures" : "Powered by GRID"}
                        </span>
                    </div>
                </div>
            )}
            {collapsed && (
                <div className="px-2 py-2 border-b border-sidebar-border flex justify-center">
                    <div
                        className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"
                        title={source === "demo" ? "Demo Mode" : "GRID Live"}
                    >
                        <Database className={`w-4 h-4 ${source === "demo" ? "text-success" : "text-primary"}`} />
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin">
                {mainNavGroups.map((group) => (
                    <div key={group.name} className="mb-2">
                        {/* Group header */}
                        {!collapsed && (
                            <button
                                onClick={() => group.collapsible !== false && toggleGroup(group.name)}
                                className="w-full flex items-center justify-between px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-sidebar-muted hover:text-sidebar-foreground transition-colors"
                            >
                                {group.name}
                                {group.collapsible !== false && (
                                    expandedGroups[group.name] ?
                                        <ChevronUp className="w-3 h-3" /> :
                                        <ChevronDown className="w-3 h-3" />
                                )}
                            </button>
                        )}

                        {/* Group items */}
                        {(collapsed || expandedGroups[group.name]) && (
                            <div className="px-2 space-y-0.5">
                                {group.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 group relative ${isActive(item.href)
                                            ? "bg-primary/10 text-primary nav-active-glow"
                                            : "text-sidebar-foreground hover:bg-muted"
                                            } ${collapsed ? "justify-center px-2" : ""}`}
                                        title={collapsed ? item.name : undefined}
                                    >
                                        <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive(item.href) ? "text-primary" : "text-sidebar-muted group-hover:text-sidebar-foreground"}`} />
                                        {!collapsed && (
                                            <>
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-sm font-medium">{item.name}</span>
                                                    {item.description && (
                                                        <p className="text-[10px] text-sidebar-muted truncate">{item.description}</p>
                                                    )}
                                                </div>
                                                {item.badge && (
                                                    <span className="badge badge-new text-[9px]">{item.badge}</span>
                                                )}
                                            </>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {/* External Intel */}
                <div className="mb-2">
                    {!collapsed && (
                        <button
                            onClick={() => toggleGroup("External Intel")}
                            className="w-full flex items-center justify-between px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-sidebar-muted hover:text-sidebar-foreground transition-colors"
                        >
                            External Intel
                            {expandedGroups["External Intel"] ?
                                <ChevronUp className="w-3 h-3" /> :
                                <ChevronDown className="w-3 h-3" />
                            }
                        </button>
                    )}

                    {(collapsed || expandedGroups["External Intel"]) && (
                        <div className="px-2 space-y-0.5">
                            {externalLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-muted hover:text-sidebar-foreground hover:bg-muted transition-colors ${collapsed ? "justify-center px-2" : ""
                                        }`}
                                    title={collapsed ? link.name : undefined}
                                >
                                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                    {!collapsed && <span className="text-sm">{link.name}</span>}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </nav>

            {/* Bottom section */}
            <div className="border-t border-sidebar-border py-2 px-2">
                {bottomNav.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive(item.href)
                            ? "bg-primary/10 text-primary"
                            : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-muted"
                            } ${collapsed ? "justify-center px-2" : ""}`}
                        title={collapsed ? item.name : undefined}
                    >
                        <item.icon className="w-4 h-4" />
                        {!collapsed && <span className="text-sm">{item.name}</span>}
                    </Link>
                ))}
            </div>

            {/* Collapse toggle */}
            <div className="border-t border-sidebar-border p-2">
                <button
                    onClick={handleToggleCollapse}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sidebar-muted hover:text-sidebar-foreground hover:bg-muted transition-colors`}
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    {!collapsed && <span className="text-xs">Collapse</span>}
                </button>
            </div>

            {/* Version */}
            {!collapsed && (
                <div className="px-4 py-2 border-t border-sidebar-border">
                    <p className="text-[10px] text-sidebar-muted">v1.0.0 • Hackathon</p>
                </div>
            )}
        </aside>
    );
}
