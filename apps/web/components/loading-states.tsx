"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";

// Route-level loading bar
export function RouteLoaderBar() {
    const pathname = usePathname();
    const [loading, setLoading] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const prevPathname = React.useRef(pathname);

    React.useEffect(() => {
        if (prevPathname.current !== pathname) {
            setLoading(true);
            setVisible(true);

            // Simulate loading complete
            const timer = setTimeout(() => {
                setLoading(false);
                setTimeout(() => setVisible(false), 200);
            }, 300);

            prevPathname.current = pathname;
            return () => clearTimeout(timer);
        }
    }, [pathname]);

    if (!visible) return null;

    return (
        <div className={`loader-bar ${loading ? "" : "opacity-0"}`} />
    );
}

// Floating action button for Generate
interface FloatingActionButtonProps {
    onClick?: () => void;
    icon: React.ReactNode;
    label?: string;
    visible?: boolean;
}

export function FloatingActionButton({
    onClick,
    icon,
    label,
    visible = true
}: FloatingActionButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            router.push("/generate");
        }
    };

    if (!visible) return null;

    return (
        <button
            onClick={handleClick}
            className="fab animate-scale-in"
            title={label || "Generate Report"}
        >
            {icon}
        </button>
    );
}

// Progress phases indicator
interface LoadingPhasesProps {
    phases: string[];
    currentPhase: number;
    showPhases?: boolean;
}

export function LoadingPhases({ phases, currentPhase, showPhases = true }: LoadingPhasesProps) {
    return (
        <div className="flex flex-col items-center gap-3">
            {/* Phase dots */}
            <div className="flex items-center gap-2">
                {phases.map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${i < currentPhase
                                ? "bg-primary"
                                : i === currentPhase
                                    ? "bg-primary animate-pulse"
                                    : "bg-muted-foreground/30"
                            }`}
                    />
                ))}
            </div>

            {/* Phase label */}
            {showPhases && (
                <p className="text-sm text-muted-foreground animate-fade-in">
                    {phases[currentPhase] || phases[phases.length - 1]}
                </p>
            )}
        </div>
    );
}

// Retry with exponential backoff UI
interface RetryButtonProps {
    onRetry: () => void;
    attempt: number;
    maxAttempts?: number;
    lastError?: string;
}

export function RetryButton({ onRetry, attempt, maxAttempts = 3, lastError }: RetryButtonProps) {
    const [countdown, setCountdown] = React.useState(0);

    React.useEffect(() => {
        if (attempt > 0 && attempt <= maxAttempts) {
            const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
            setCountdown(Math.floor(delay / 1000));

            const interval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [attempt, maxAttempts]);

    return (
        <div className="flex flex-col items-center gap-4 p-6 card-base">
            <div className="text-destructive text-sm">
                {lastError || "An error occurred"}
            </div>

            {countdown > 0 ? (
                <div className="text-sm text-muted-foreground">
                    Retrying in {countdown}s... (Attempt {attempt}/{maxAttempts})
                </div>
            ) : (
                <button
                    onClick={onRetry}
                    className="btn-primary"
                    disabled={attempt >= maxAttempts}
                >
                    {attempt >= maxAttempts ? "Max retries reached" : "Retry Now"}
                </button>
            )}
        </div>
    );
}

// Section skeleton with shape matching
interface SectionSkeletonProps {
    type: "kpi-row" | "card-grid" | "table" | "hero";
}

export function SectionSkeleton({ type }: SectionSkeletonProps) {
    switch (type) {
        case "kpi-row":
            return (
                <div className="grid-kpi">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="skeleton skeleton-card h-24" />
                    ))}
                </div>
            );
        case "card-grid":
            return (
                <div className="grid-insights">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton skeleton-card h-48" />
                    ))}
                </div>
            );
        case "table":
            return (
                <div className="space-y-2">
                    <div className="skeleton h-10 w-full" />
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="skeleton h-12 w-full" />
                    ))}
                </div>
            );
        case "hero":
            return <div className="skeleton skeleton-card h-48" />;
        default:
            return null;
    }
}

// Data freshness indicator
interface FreshnessIndicatorProps {
    lastUpdated: Date;
    isStale?: boolean;
}

export function FreshnessIndicator({ lastUpdated, isStale }: FreshnessIndicatorProps) {
    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return "Just now";
    };

    return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={`w-2 h-2 rounded-full ${isStale ? "bg-warning" : "bg-success"}`} />
            <span>Updated {formatTime(lastUpdated)}</span>
            {isStale && <span className="text-warning">(stale)</span>}
        </div>
    );
}
