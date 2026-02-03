"use client";

import * as React from "react";
import { Copy, Check, ExternalLink, Star, Pin, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

// ============================================================================
// COPY BUTTON
// ============================================================================

interface CopyButtonProps {
    value: string;
    label?: string;
    className?: string;
}

export function CopyButton({ value, label = "Copy", className = "" }: CopyButtonProps) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className={`copy-btn ${copied ? "copied" : ""} ${className}`}
        >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copied" : label}</span>
        </button>
    );
}

// ============================================================================
// ANIMATED NUMBER COUNTER
// ============================================================================

interface AnimatedNumberProps {
    value: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    className?: string;
}

export function AnimatedNumber({
    value,
    suffix = "",
    prefix = "",
    duration = 800,
    className = ""
}: AnimatedNumberProps) {
    const [display, setDisplay] = React.useState(0);

    React.useEffect(() => {
        const start = performance.now();

        const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            setDisplay(Math.round(value * eased));
            if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }, [value, duration]);

    return (
        <span className={`text-numeric ${className}`}>
            {prefix}{display.toLocaleString()}{suffix}
        </span>
    );
}

// ============================================================================
// TREND INDICATOR
// ============================================================================

interface TrendIndicatorProps {
    value: number;
    showValue?: boolean;
    size?: "sm" | "md";
}

export function TrendIndicator({ value, showValue = true, size = "md" }: TrendIndicatorProps) {
    const isPositive = value > 0;
    const isNeutral = value === 0;

    const sizeClasses = size === "sm" ? "text-xs" : "text-sm";
    const colorClass = isNeutral
        ? "text-muted-foreground"
        : isPositive
            ? "text-success"
            : "text-destructive";

    return (
        <span className={`flex items-center gap-1 font-medium ${sizeClasses} ${colorClass}`}>
            {!isNeutral && (
                <span>{isPositive ? "↑" : "↓"}</span>
            )}
            {showValue && (
                <span>{isPositive ? "+" : ""}{value}%</span>
            )}
        </span>
    );
}

// ============================================================================
// SPARKLINE (Mini chart)
// ============================================================================

interface SparklineProps {
    data: number[];
    width?: number;
    height?: number;
    color?: string;
}

export function Sparkline({
    data,
    width = 80,
    height = 24,
    color = "hsl(168 100% 50%)"
}: SparklineProps) {
    if (data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
    }).join(" ");

    return (
        <svg width={width} height={height} className="overflow-visible">
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// ============================================================================
// PROGRESS RING (Confidence)
// ============================================================================

interface ProgressRingProps {
    value: number;
    size?: number;
    strokeWidth?: number;
    showValue?: boolean;
}

export function ProgressRing({
    value,
    size = 48,
    strokeWidth = 4,
    showValue = true
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    const color = value >= 85
        ? "hsl(160 80% 45%)"
        : value >= 70
            ? "hsl(25 95% 55%)"
            : "hsl(0 85% 55%)";

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="hsl(220 15% 18%)"
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-out"
                />
            </svg>
            {showValue && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-foreground">{value}%</span>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// SIGNAL STRENGTH BARS
// ============================================================================

interface SignalBarsProps {
    strength: 1 | 2 | 3 | 4;
}

export function SignalBars({ strength }: SignalBarsProps) {
    return (
        <div className="signal-bars" data-strength={strength}>
            {[1, 2, 3, 4].map((level) => (
                <div
                    key={level}
                    className={`signal-bar ${level <= strength ? "active" : ""}`}
                    style={{ height: `${level * 25}%` }}
                />
            ))}
        </div>
    );
}

// ============================================================================
// PIN / FAVORITE BUTTON
// ============================================================================

interface PinButtonProps {
    pinned: boolean;
    onToggle: () => void;
}

export function PinButton({ pinned, onToggle }: PinButtonProps) {
    return (
        <button
            onClick={onToggle}
            className={`p-1.5 rounded-md transition-colors ${pinned
                    ? "text-warning bg-warning/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
            title={pinned ? "Unpin" : "Pin to top"}
        >
            <Star className={`w-4 h-4 ${pinned ? "fill-current" : ""}`} />
        </button>
    );
}

// ============================================================================
// BADGE VARIANTS
// ============================================================================

interface BadgeProps {
    variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "muted" | "new";
    dot?: boolean;
    children: React.ReactNode;
    className?: string;
}

export function Badge({
    variant = "muted",
    dot = false,
    children,
    className = ""
}: BadgeProps) {
    return (
        <span className={`badge badge-${variant} ${dot ? "badge-dot" : ""} ${className}`}>
            {children}
        </span>
    );
}

// ============================================================================
// EXTERNAL LINK
// ============================================================================

interface ExternalLinkButtonProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export function ExternalLinkButton({ href, children, className = "" }: ExternalLinkButtonProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`external-link ${className}`}
        >
            {children}
            <ExternalLink className="w-3 h-3" />
        </a>
    );
}

// ============================================================================
// ROW HOVER ACTIONS
// ============================================================================

interface RowHoverActionsProps {
    onCopy?: () => void;
    onLink?: () => void;
    onMore?: () => void;
}

export function RowHoverActions({ onCopy, onLink, onMore }: RowHoverActionsProps) {
    return (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onCopy && (
                <button
                    onClick={onCopy}
                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                    title="Copy"
                >
                    <Copy className="w-3.5 h-3.5" />
                </button>
            )}
            {onLink && (
                <button
                    onClick={onLink}
                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                    title="Open link"
                >
                    <ExternalLink className="w-3.5 h-3.5" />
                </button>
            )}
            {onMore && (
                <button
                    onClick={onMore}
                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                    title="More actions"
                >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    );
}
