"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCw, AlertCircle } from "lucide-react";

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
    useEffect(() => {
        // Log error to error reporting service
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center animate-fade-in">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-destructive" />
                </div>

                {/* Title */}
                <h1 className="text-headline text-foreground mb-2">Something went wrong</h1>
                <p className="text-body text-muted-foreground mb-4">
                    An unexpected error occurred. Our team has been notified.
                </p>

                {/* Error details (dev mode) */}
                {process.env.NODE_ENV === "development" && (
                    <div className="p-4 rounded-lg bg-muted border border-border text-left mb-6">
                        <p className="text-xs font-mono text-destructive break-all">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-muted-foreground mt-2">
                                Digest: {error.digest}
                            </p>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="btn-primary inline-flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="btn-ghost inline-flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        Back to Base
                    </Link>
                </div>

                {/* Support info */}
                <div className="mt-12 pt-8 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                        Need help?{" "}
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            Report an issue
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
