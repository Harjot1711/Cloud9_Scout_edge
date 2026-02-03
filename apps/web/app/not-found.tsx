"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react";
import { useCommandPalette } from "@/components/command-palette";

export default function NotFound() {
    const { toggle } = useCommandPalette();

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center animate-fade-in">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-muted border border-border flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-muted-foreground" />
                </div>

                {/* Title */}
                <h1 className="text-display gradient-primary-text mb-4">404</h1>
                <h2 className="text-title text-foreground mb-2">Page Not Found</h2>
                <p className="text-body text-muted-foreground mb-8">
                    The intel you're looking for doesn't exist or has been moved.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="btn-primary inline-flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        Back to Base
                    </Link>
                    <button
                        onClick={toggle}
                        className="btn-ghost inline-flex items-center justify-center gap-2"
                    >
                        <Search className="w-4 h-4" />
                        Search (⌘K)
                    </button>
                </div>

                {/* Breadcrumbs */}
                <div className="mt-12 pt-8 border-t border-border">
                    <Link
                        href="/generate"
                        className="external-link text-sm"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Generate a scouting report
                    </Link>
                </div>
            </div>
        </div>
    );
}
