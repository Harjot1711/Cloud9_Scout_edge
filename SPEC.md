# ScoutEdge - Automated Scouting Report Generator

**Category**: Sky's the Limit – Cloud9 x JetBrains Hackathon, Category 2  
**Target Game**: Valorant  
**Visual Identity**: Premium navy-to-purple gradient brand, esports-meets-analytics aesthetic

---

## Product Overview

**ScoutEdge** is an automated scouting report generator that transforms raw competitive match data into actionable, data-backed strategic insights for esports coaches and analysts. Built specifically for Valorant, it delivers professional-grade reports in seconds rather than hours.

### Why Valorant?

- **Rich tactical depth**: Valorant's agent abilities, economy rounds, and site execution provide more strategic variety than LoL's early-game patterns
- **Clear round-level data**: Each round is a discrete tactical event, making insights more granular and actionable
- **Growing competitive scene**: Franchised leagues (VCT) create urgent need for professional scouting tools
- **Better stats availability**: GRID API coverage for Valorant is comprehensive at team/player/round level

---

## Core User Story

> **As an esports coach**, I want to generate a comprehensive scouting report on an opponent team in under 60 seconds, **so that** I can focus my prep time on strategizing counters instead of manually watching VODs and compiling notes.

---

## MVP Feature List

### 1. **Opponent Selection & Configuration**
- Search opponents by team name (autocomplete)
- Configure match window (last N matches: 5-20)
- Toggle Demo Mode vs Live Mode
- Select patch/meta window (optional filter)

### 2. **Automated Insight Engine**
- **Team-Wide Strategy Insights (5)**
  - Attack-side preferences (site tendencies, timing)
  - Defense setups (stack patterns, rotation triggers)
  - Economy round behavior (force-buy patterns, save discipline)
  - Overtime tendencies
  - Map pool strengths/weaknesses
  
- **Player Tendency Insights (4)**
  - Star player dependencies (clutch rate, entry success)
  - Role deviations (flex patterns, agent pools)
  - Individual exploits (low first-death rate, passive lanes)
  - Mechanical patterns (OP usage, ability economy)

- **Composition & Setup Insights (2)**
  - Agent comp trends per map
  - Setup templates (default site setups, retake formations)

- **Red Flag / Exploit (1)**
  - High-confidence weakness with counter-strategy suggestion

### 3. **Evidence-Based Transparency**
- Every insight shows:
  - Metric definition
  - Sample size (N matches, N rounds)
  - Supporting match IDs
  - Confidence score
- Click any insight to open Evidence Drawer with full breakdown

### 4. **"How to Win" Strategic Counters**
- 3-5 counter-strategies derived from weaknesses
- Each counter shows:
  - Target condition (when to apply)
  - Action steps
  - Expected outcome
  - Supporting evidence

### 5. **Report Export & Sharing**
- Export as PDF (print-optimized layout)
- Export as JSON (for integrations)
- Shareable URL with query params

### 6. **Demo Mode (Required)**
- Pre-loaded fixture dataset (realistic team with 10 matches)
- Full report generation without GRID API access
- Zero degradation in UX quality

---

## "11/10" Polish Checklist

### Visual Excellence
- ✅ Premium dashboard aesthetic (shadcn/ui + custom theme)
- ✅ Smooth micro-animations (hover states, transitions)
- ✅ Curated color palette (navy/purple/cyan gradient system)
- ✅ Modern typography (Inter variable font)
- ✅ Dark mode with proper contrast ratios
- ✅ Glassmorphism cards with subtle depth

### UX Excellence
- ✅ Zero loading jank (skeleton loaders everywhere)
- ✅ Instant perceived performance (optimistic UI updates)
- ✅ Keyboard navigation support
- ✅ Empty states with helpful guidance
- ✅ Error states with retry/fallback options
- ✅ Responsive design (desktop-first, tablet-compatible)

### Technical Excellence
- ✅ End-to-end TypeScript type safety
- ✅ Deterministic report generation (same input = same output)
- ✅ Caching layer for instant re-generation
- ✅ Graceful GRID API failure handling
- ✅ Unit tests for stats engine
- ✅ Clean, documented codebase

---

## Demo Script Outline (≤3 minutes)

### Act 1: Problem Setup (0:00-0:30)
- Show coaches drowning in VOD footage
- Pain: "Manual scouting takes 4+ hours per opponent"
- Transition: "ScoutEdge turns 4 hours into 30 seconds"

### Act 2: Product Demo (0:30-2:30)
**[0:30-0:45] Generate a Report**
- Select opponent team (autocomplete)
- Set last 10 matches
- Toggle Demo Mode ON
- Click "Generate Report" → show loading animation
- Report appears instantly

**[0:45-1:30] Walk Through Insights**
- Highlight key finding: "Team X loses 73% of rounds when forcing on pistol loss"
- Show evidence drawer: 11 matches analyzed, 27 force-buy rounds documented
- Click through 2-3 more insights (player tendency, comp weakness)

**[1:30-2:15] "How to Win" Moment**
- Open "How to Win" section
- Read counter-strategy: "Force early duels against Jett to exploit 34% first-death rate"
- Show confidence + evidence

**[2:15-2:30] Export & Share**
- Click "Export PDF" → show print preview
- Copy shareable URL
- Mention real-time mode with live GRID data

### Act 3: Impact & Tech (2:30-3:00)
- Recap: "12+ actionable insights, all evidence-backed, in 30 seconds"
- Built with: Next.js, FastAPI, JetBrains IDEs + Junie AI
- Open source (MIT), ready for team integration
- Call to action: "Give your coaches their time back"

---

## Acceptance Criteria

### Must-Have (Blocking)
- [ ] App runs cleanly in Demo Mode without any API keys
- [ ] Report generation completes in <3 seconds (demo fixtures)
- [ ] All 12+ insights show evidence with sample sizes
- [ ] UI is polished enough to screenshot for Devpost
- [ ] README includes clear setup instructions + Junie usage
- [ ] OSS license (MIT or Apache-2.0) is present
- [ ] Demo video script is completable in ≤3 minutes

### Should-Have (Strong)
- [ ] Live GRID integration skeleton present (even if disabled)
- [ ] Caching layer reduces redundant API calls
- [ ] Export PDF/JSON works reliably
- [ ] Evidence drawer renders charts/tables cleanly
- [ ] "How to Win" generates 3+ actionable counters

### Nice-to-Have (Bonus)
- [ ] Dark mode toggle
- [ ] LLM narration layer (with stat citations)
- [ ] Keyboard shortcuts for power users
- [ ] Lighthouse score >90
- [ ] Unit test coverage >60%

---

## Success Metrics (Judging Rubric Alignment)

| Criterion | How ScoutEdge Delivers |
|-----------|------------------------|
| **Innovation** | First esports tool to combine live API data + evidence-based coaching in <60s |
| **Technical Excellence** | Monorepo, TS/Python, caching, graceful failures, deterministic stats |
| **UX/UI Polish** | "11/10" dashboard feel, zero jank, beautiful even in demo mode |
| **Practicality** | Real coaches can use this Monday morning (export, share, fast) |
| **Cloud9 Integration** | Built for competitive Valorant (Cloud9's flagship game) |
| **JetBrains Tooling** | README documents Junie usage for development acceleration |

---

**Version**: 1.0  
**Frozen**: 2026-01-26  
**Next**: Proceed to Prompt 2 (scaffold monorepo)
