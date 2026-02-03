"use client";

import { AppShell } from "@/components/app-shell";
import { HelpCircle, BookOpen, MessageCircle, ExternalLink, Zap, Database, FileText } from "lucide-react";

const resources = [
    {
        title: "Getting Started",
        description: "Learn how to generate your first scouting report",
        icon: BookOpen,
        href: "#",
    },
    {
        title: "Understanding Evidence",
        description: "How confidence scores and statistics work",
        icon: Database,
        href: "#",
    },
    {
        title: "GRID API Docs",
        description: "Official documentation for data sources",
        icon: FileText,
        href: "https://grid.gg/",
        external: true,
    },
];

const faqs = [
    {
        q: "What data sources does ScoutEdge use?",
        a: "ScoutEdge aggregates match data from GRID Esports Data Platform. Supplementary data from VLR.gg and Liquipedia provides team/player context.",
    },
    {
        q: "How are confidence scores calculated?",
        a: "Confidence = f(sample_size, variance, recency). Higher sample sizes with consistent patterns across recent matches yield higher confidence.",
    },
    {
        q: "What does Demo Mode do?",
        a: "Demo Mode uses fixture data from GRID so you can explore all features without live API access. Perfect for demonstrations.",
    },
    {
        q: "Can I export reports?",
        a: "Yes — reports can be exported as PDF or JSON for offline review and team sharing.",
    },
];

export default function HelpPage() {
    return (
        <AppShell title="Help & Documentation" subtitle="Resources for ScoutEdge">
            <div className="p-6 max-w-4xl mx-auto">
                {/* Quick Links */}
                <section className="mb-10">
                    <h2 className="text-headline text-foreground mb-5">Resources</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {resources.map((item, index) => {
                            const Icon = item.icon;
                            const Tag = item.external ? "a" : "button";
                            return (
                                <Tag
                                    key={item.title}
                                    href={item.external ? item.href : undefined}
                                    target={item.external ? "_blank" : undefined}
                                    rel={item.external ? "noopener noreferrer" : undefined}
                                    className={`card-base card-interactive p-5 text-left animate-slide-up stagger-${index + 1}`}
                                    style={{ opacity: 0 }}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="text-base font-semibold text-foreground mb-1 flex items-center gap-2">
                                        {item.title}
                                        {item.external && <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </Tag>
                            );
                        })}
                    </div>
                </section>

                {/* FAQs */}
                <section className="mb-10">
                    <h2 className="text-headline text-foreground mb-5">FAQ</h2>
                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="card-base p-5 animate-slide-up"
                                style={{ opacity: 0, animationDelay: `${0.2 + index * 0.05}s` }}
                            >
                                <h3 className="text-base font-semibold text-foreground mb-2">{faq.q}</h3>
                                <p className="text-sm text-muted-foreground">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <div className="p-6 rounded-xl gradient-primary animate-slide-up" style={{ opacity: 0, animationDelay: "0.4s" }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-title text-background mb-1">Need more help?</h3>
                            <p className="text-sm text-background/80">
                                View GRID documentation or reach out to the team
                            </p>
                        </div>
                        <a
                            href="https://grid.gg/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/20 hover:bg-background/30 text-background text-sm font-medium transition-colors"
                        >
                            GRID Docs
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
