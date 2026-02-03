export const ValorantIcons = {
    Logo: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
            <path d="M99.25 48.66V10.28L55.5 102h24.8l18.95-53.34zM0 10.28v32.55L31.83 102h19.53L0 10.28z" />
        </svg>
    ),
    Duelist: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M12 2L15 8L21 9L17 14L19 21L12 17L5 21L7 14L3 9L9 8L12 2Z" />
        </svg>
    ),
    Initiator: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2zm0-8h2v6h-2z" />
        </svg>
    ),
    Sentinel: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path d="M12 2L4 7v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V7l-8-5z" />
        </svg>
    ),
    Controller: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path d="M12 6c2.67 0 8 1.34 8 4s-5.33 4-8 4-8-1.34-8-4 5.33-4 8-4m0-4C6.48 2 2 4.24 2 7s4.48 5 10 5 10-2.24 10-5-4.48-5-10-5z" />
        </svg>
    )
};

export const LoLIcons = {
    Logo: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
            <path d="M10 10h15v60h50v15H10z" />
            <path d="M35 35l10-10 20 20-10 10z" fillOpacity="0.5" />
        </svg>
    ),
    Top: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M12 2L4 10h16M12 22l8-8H4" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
    ),
    Jungle: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M12 21c-4.97 0-9-4.03-9-9s9-13 9-13 9 8.03 9 13-4.03 9-9 9z" />
        </svg>
    ),
    Mid: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M12 2l-5 9h10l-5-9zm0 20l5-9H7l5 9z" />
        </svg>
    ),
    Bot: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" />
        </svg>
    ),
    Support: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    )
};
