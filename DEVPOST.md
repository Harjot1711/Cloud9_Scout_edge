# ScoutEdge - Devpost Submission

## Inspiration

Esports coaches spend 4+ hours manually analyzing VODs and compiling scouting notes for each opponent. This time-consuming process delays strategic preparation and limits competitive edge. We built ScoutEdge to automate this workflow, turning hours of analysis into seconds while providing data-backed, verifiable insights that coaches can trust.

## What it does

**ScoutEdge** generates comprehensive scouting reports for Valorant teams in under 60 seconds with 12+ actionable insights:

- **Team Strategy Analysis**: Attack site preferences, defense patterns, economy discipline, map pool strengths
- **Player Tendencies**: Entry fragger success rates, clutch performance, agent flexibility, star player dependency
- **Composition Insights**: Signature team comps, default setup effectiveness
- **Critical Weaknesses**: High-confidence exploitable patterns (e.g., "71% loss rate on force-buys")
- **How to Win Counters**: 3-5 data-backed counter-strategies with expected outcomes

Every insight is **evidence-backed** with sample sizes, match IDs, and confidence scores—making reports judge-proof and actionable.

## How we built it

**Tech Stack:**
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: FastAPI (Python 3.12), uvicorn
- **Shared Logic**: TypeScript stats engine in monorepo `/packages/core`
- **Data**: SQLite caching, demo mode with fixture data
- **Infrastructure**: Monorepo with npm workspaces, uv for Python deps

**Development Workflow:**
- Built with **JetBrains WebStorm** and **PyCharm Professional**
- Leveraged **Junie AI** for:
  - Boilerplate generation (API routes, React components)
  - Type inference (Zod schemas from TypeScript interfaces)
  - Test scaffolding for stats engine
  - Code refactoring and optimization

**Architecture:**
1. Stats engine computes insights from match data (pure TypeScript functions)
2. FastAPI serves demo fixtures or live GRID API data
3. Next.js renders premium UI with dark mode, skeleton loaders, and smooth animations
4. Evidence transparency: every claim links to supporting data

## Challenges we ran into

1. **Type Safety Across Stack**: Maintaining strict TypeScript types across frontend/backend/shared packages required careful schema design with Zod validation
2. **Stats Engine Design**: Balancing statistical rigor with actionable simplicity—coaches need clear insights, not raw stats
3. **Demo Mode Requirement**: Creating realistic fixture data that demonstrates full capability without GRID API keys
4. **UI Performance**: Ensuring zero jank with skeleton loaders, memoization, and optimistic updates

## Accomplishments that we're proud of

- **"11/10" UI**: Premium SaaS dashboard aesthetic with glassmorphism, custom purple/navy/cyan theme, and buttery smooth animations
- **Full Demo Mode**: Works perfectly without any API keys—judges can test immediately
- **Evidence Transparency**: Every insight clickable to view sample sizes, match IDs, and supporting data
- **Production-Ready**: Clean monorepo, comprehensive types, error handling, graceful fallbacks
- **Open Source**: MIT licensed, ready for community adoption

## What we learned

- **Product-First Thinking**: Focused on coach UX (speed, trust, actionability) over technical complexity
- **TypeScript Monorepos**: Sharing types and logic across web/API elevated code quality
- **JetBrains + Junie**: IDE intelligent assistance accelerated development significantly
- **Value of Demo Mode**: Eliminating setup friction makes the product immediately accessible

## What's next for ScoutEdge

- **Live GRID Integration**: Real-time match data from GRID Esports API
- **Multi-Game Support**: Expand to League of Legends, CS2, Dota 2
- **LLM Narration Layer**: Natural language coaching notes (with stat citations)
- **Team Collaboration**: Share reports, annotate insights, track opponent evolution
- **Mobile App**: iOS/Android native apps for on-the-go scouting
- **Advanced Analytics**: Heatmaps, VOD timestamp linking, custom metrics builder

---

**Demo Mode**: Toggle ON in app, select Phantom Tactics, click Generate  
**License**: MIT (Open Source)  
**Repo**: [GitHub Link]  
**Built with**: Next.js • FastAPI • JetBrains WebStorm/PyCharm • Junie AI
