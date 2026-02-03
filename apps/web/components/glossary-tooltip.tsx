"use client";

import { Info } from "lucide-react";
import { useState } from "react";

// Central glossary definitions
const GLOSSARY_TERMS: Record<string, string> = {
    "Match Window": "The specific range of most recent matches analyzed to generate these insights (e.g., Last 10 Matches).",
    "Win Rate": "Percentage of series won out of the total series played in the selected window.",
    "K/D Ratio": "Kill-to-Death ratio. Values above 1.0 indicate positive impact; below 0.8 suggests struggle.",
    "First Blood": "The first kill secured in a round, often statistically correlated with round win probability.",
    "Map Pool": "The set of unique maps a team has played in official matches within the analysis window.",
    "Confidence": "A statistical measure of how likely this insight is to be accurate based on sample size and data consistency."
};

interface GlossaryProps {
    term: string;
    children?: React.ReactNode;
    definition?: string;
    className?: string;
}

export function GlossaryTooltip({ term, children, definition, className = "" }: GlossaryProps) {
    const [isVisible, setIsVisible] = useState(false);

    // Resolve definition
    const def = definition || GLOSSARY_TERMS[term] || "Definition not available.";

    return (
        <span
            className={`relative inline-flex items-center group cursor-help ${className}`}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {/* Trigger */}
            <span className="border-b border-dotted border-muted-foreground/50 hover:border-primary transition-colors flex items-center gap-1">
                {children || term}
                <Info className="w-3 h-3 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
            </span>

            {/* Tooltip */}
            <div
                className={`
                    absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 
                    bg-popover border border-border rounded-lg shadow-xl z-50
                    text-xs leading-relaxed text-popover-foreground
                    transition-all duration-200 pointer-events-none
                    ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}
                `}
            >
                <div className="font-semibold text-foreground mb-1 border-b border-border pb-1">
                    {term}
                </div>
                {def}

                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 bg-popover border-r border-b border-border rotate-45 transform" />
            </div>
        </span>
    );
}
