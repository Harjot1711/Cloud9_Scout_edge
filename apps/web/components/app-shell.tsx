"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { TopBar } from "./topbar";

interface AppShellProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    showBreadcrumbs?: boolean;
    showExportActions?: boolean;
}

export function AppShell({
    title,
    subtitle,
    children,
    actions,
    showBreadcrumbs = true,
    showExportActions = true
}: AppShellProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Load sidebar state from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("sidebar_collapsed");
        if (stored !== null) {
            setSidebarCollapsed(stored === "true");
        }
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Sidebar
                collapsed={sidebarCollapsed}
                onCollapsedChange={setSidebarCollapsed}
            />

            <main
                className={`transition-all duration-300 ease-out ${sidebarCollapsed ? "ml-16" : "ml-60"
                    }`}
            >
                <TopBar
                    title={title}
                    subtitle={subtitle}
                    actions={actions}
                    showBreadcrumbs={showBreadcrumbs}
                    showExportActions={showExportActions}
                />

                <div className="min-h-[calc(100vh-3.5rem)]">
                    {children}
                </div>
            </main>
        </div>
    );
}
