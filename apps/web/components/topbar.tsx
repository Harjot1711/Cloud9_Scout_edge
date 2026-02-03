"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
    Search, Download, Share2, FileText, ChevronRight,
    Home, ArrowUp, Check, Copy
} from "lucide-react";
import { useCommandPalette } from "./command-palette";
import { toast } from "sonner";

// ============================================================================
// BREADCRUMB MAPPING
// ============================================================================

const routeLabels: Record<string, string> = {
    "/": "Home",
    "/generate": "Generate Report",
    "/reports": "Saved Reports",
    "/teams": "Teams Database",
    "/trends": "Meta Analysis",
    "/settings": "Settings",
    "/help": "Help & Docs",
};

// ============================================================================
// TOPBAR COMPONENT
// ============================================================================

interface TopBarProps {
    title?: string;
    subtitle?: string;
    actions?: React.ReactNode;
    showBreadcrumbs?: boolean;
    showExportActions?: boolean;
    onEvidenceClick?: () => void;
}

export function TopBar({
    title,
    subtitle,
    actions,
    showBreadcrumbs = true,
    showExportActions = true,
    onEvidenceClick
}: TopBarProps) {
    const pathname = usePathname();
    const { toggle: toggleCommandPalette } = useCommandPalette();
    const [scrolled, setScrolled] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [copied, setCopied] = useState(false);

    // Blur on scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
            setShowBackToTop(window.scrollY > 400);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Generate breadcrumbs
    const breadcrumbs = pathname.split("/").filter(Boolean).map((segment, index, arr) => {
        const path = "/" + arr.slice(0, index + 1).join("/");
        return {
            label: routeLabels[path] || segment.charAt(0).toUpperCase() + segment.slice(1),
            href: path,
            isLast: index === arr.length - 1,
        };
    });

    // Back to top
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Handle PDF export (print as PDF)
    const handleExport = async () => {
        setExporting(true);
        toast.loading("Preparing export...");

        // Small delay for UX
        await new Promise(resolve => setTimeout(resolve, 500));

        // Use browser print dialog (works for PDF export)
        window.print();

        toast.dismiss();
        toast.success("Export ready", { description: "Use Print > Save as PDF" });
        setExporting(false);
    };

    // Handle share (copy link or use Web Share API)
    const handleShare = async () => {
        const url = window.location.href;
        const title = document.title;

        // Try Web Share API first (mobile/modern browsers)
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
                toast.success("Shared successfully");
                return;
            } catch (err) {
                // User cancelled or share failed, fall back to clipboard
            }
        }

        // Fallback: copy to clipboard
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success("Link copied to clipboard", { description: url });
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy link");
        }
    };

    // Handle evidence panel
    const handleEvidence = () => {
        if (onEvidenceClick) {
            onEvidenceClick();
        } else {
            // Default: scroll to evidence section if exists, or show toast
            const evidenceSection = document.getElementById("evidence-section");
            if (evidenceSection) {
                evidenceSection.scrollIntoView({ behavior: "smooth" });
            } else {
                toast.info("Evidence panel coming soon", {
                    description: "Click 'Evidence' on any insight card to see data sources"
                });
            }
        }
    };

    return (
        <>
            <header
                className={`sticky top-0 z-30 h-14 border-b transition-all duration-200 ${scrolled
                    ? "bg-background/80 backdrop-blur-md border-border shadow-sm"
                    : "bg-background border-transparent"
                    }`}
            >
                <div className="h-full flex items-center justify-between px-4 lg:px-6">
                    {/* Left: Breadcrumbs + Title */}
                    <div className="flex items-center gap-4 min-w-0">
                        {/* Breadcrumbs */}
                        {showBreadcrumbs && breadcrumbs.length > 0 && (
                            <nav className="breadcrumbs hidden md:flex">
                                <div className="breadcrumb-item">
                                    <a href="/" className="breadcrumb-link">
                                        <Home className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                                {breadcrumbs.map((crumb) => (
                                    <div key={crumb.href} className="breadcrumb-item">
                                        <ChevronRight className="w-3 h-3 text-muted-foreground" />
                                        {crumb.isLast ? (
                                            <span className="breadcrumb-current">{crumb.label}</span>
                                        ) : (
                                            <a href={crumb.href} className="breadcrumb-link">{crumb.label}</a>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        )}

                        {/* Title (mobile or when no breadcrumbs) */}
                        {title && (
                            <div className="md:hidden">
                                <h1 className="text-sm font-semibold text-foreground truncate">{title}</h1>
                            </div>
                        )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        {/* Search trigger */}
                        <button
                            onClick={toggleCommandPalette}
                            className="flex items-center gap-2 h-8 px-3 rounded-lg border border-border bg-muted/30 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground text-sm"
                        >
                            <Search className="w-4 h-4" />
                            <span className="hidden lg:inline">Search</span>
                            <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] bg-background rounded border border-border">⌘K</kbd>
                        </button>

                        {/* Export actions */}
                        {showExportActions && (
                            <div className="hidden sm:flex items-center gap-1 ml-2">
                                <button
                                    onClick={handleExport}
                                    disabled={exporting}
                                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                                    title="Export / Print as PDF"
                                >
                                    <Download className={`w-4 h-4 ${exporting ? "animate-pulse" : ""}`} />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                    title="Share link"
                                >
                                    {copied ? <Check className="w-4 h-4 text-success" /> : <Share2 className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={handleEvidence}
                                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                    title="Evidence panel"
                                >
                                    <FileText className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Custom actions */}
                        {actions}
                    </div>
                </div>
            </header>

            {/* Back to top button */}
            <button
                onClick={scrollToTop}
                className={`back-to-top ${showBackToTop ? "visible" : ""}`}
                aria-label="Back to top"
            >
                <ArrowUp className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Print styles */}
            <style jsx global>{`
                @media print {
                    .back-to-top,
                    header,
                    aside,
                    .fab {
                        display: none !important;
                    }
                    main {
                        margin-left: 0 !important;
                    }
                }
            `}</style>
        </>
    );
}
