"use client";

import * as React from "react";
import { X } from "lucide-react";

interface ShortcutsOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const shortcuts = [
    {
        category: "Navigation", items: [
            { keys: ["⌘", "K"], description: "Open command palette" },
            { keys: ["G"], description: "Go to Generate" },
            { keys: ["R"], description: "Go to Reports" },
            { keys: ["T"], description: "Go to Teams" },
            { keys: ["M"], description: "Go to Meta Trends" },
            { keys: ["S"], description: "Go to Settings" },
            { keys: ["?"], description: "Open this help" },
        ]
    },
    {
        category: "Actions", items: [
            { keys: ["⌘", "N"], description: "New scouting report" },
            { keys: ["⌘", "S"], description: "Save current report" },
            { keys: ["⌘", "E"], description: "Export as PDF" },
            { keys: ["⌘", "⇧", "C"], description: "Copy as Markdown" },
            { keys: ["Esc"], description: "Close dialogs / Go back" },
        ]
    },
    {
        category: "View", items: [
            { keys: ["["], description: "Collapse sidebar" },
            { keys: ["]"], description: "Expand sidebar" },
            { keys: ["F"], description: "Toggle focus mode" },
            { keys: ["P"], description: "Toggle presentation mode" },
        ]
    },
];

export function KeyboardShortcutsOverlay({ open, onOpenChange }: ShortcutsOverlayProps) {
    // Close on Escape
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) {
                onOpenChange(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, onOpenChange]);

    if (!open) return null;

    return (
        <div className="shortcuts-overlay animate-fade-in" onClick={() => onOpenChange(false)}>
            <div
                className="shortcuts-panel animate-scale-in max-h-[80vh] overflow-y-auto scrollbar-thin"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-headline text-foreground">Keyboard Shortcuts</h2>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {shortcuts.map((group) => (
                    <div key={group.category} className="mb-6 last:mb-0">
                        <h3 className="text-overline mb-3">{group.category}</h3>
                        <div className="space-y-1">
                            {group.items.map((shortcut, i) => (
                                <div key={i} className="shortcut-row">
                                    <span className="text-sm text-foreground">{shortcut.description}</span>
                                    <div className="flex gap-1">
                                        {shortcut.keys.map((key, j) => (
                                            <kbd key={j} className="command-item-kbd">{key}</kbd>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="pt-4 border-t border-border text-xs text-muted-foreground">
                    Press <kbd className="command-item-kbd">?</kbd> anywhere to toggle this overlay
                </div>
            </div>
        </div>
    );
}

// Provider to manage keyboard shortcuts overlay state
interface KeyboardShortcutsContextValue {
    open: boolean;
    setOpen: (open: boolean) => void;
    toggle: () => void;
}

const KeyboardShortcutsContext = React.createContext<KeyboardShortcutsContextValue>({
    open: false,
    setOpen: () => { },
    toggle: () => { },
});

export function useKeyboardShortcuts() {
    return React.useContext(KeyboardShortcutsContext);
}

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // ? key (Shift + /) opens shortcuts
            if (e.key === "?" || (e.shiftKey && e.key === "/")) {
                e.preventDefault();
                setOpen(prev => !prev);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const toggle = React.useCallback(() => setOpen(prev => !prev), []);

    return (
        <KeyboardShortcutsContext.Provider value={{ open, setOpen, toggle }}>
            {children}
            <KeyboardShortcutsOverlay open={open} onOpenChange={setOpen} />
        </KeyboardShortcutsContext.Provider>
    );
}
