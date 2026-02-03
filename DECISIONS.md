# Architecture & Design Decisions

**Project**: ScoutEdge  
**Last Updated**: 2026-01-26  
**Status**: FROZEN (do not revisit unless critical blocker)

---

## Tech Stack (Non-Negotiable)

### Frontend: Next.js (App Router)
- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4.x + shadcn/ui components
- **State**: React Server Components + client state with hooks (no Redux/Zustand unless needed)
- **Validation**: Zod for API payloads and form validation

**Why**: App Router gives us RSC for performance + streaming, Tailwind+shadcn delivers premium UI fast, TypeScript ensures safety.

---

### Backend: FastAPI (Python)
- **Framework**: FastAPI 0.115+
- **Language**: Python 3.12+
- **Package Manager**: `uv` (fast, modern, reliable)
- **Database**: SQLite (via `sqlite3` stdlib, no ORM initially; can add later)
- **Validation**: Pydantic v2 models

**Why**: FastAPI is fast, async-native, has great type hints, and pairs well with Python data analysis libs. `uv` is the modern standard for Python dependency management.

---

### Shared Types & Stats Engine
- **Location**: `/packages/core` (TypeScript package)
- **Contents**: TypeScript types, Zod schemas, shared utilities
- **Stats Engine**: Pure TypeScript functions (no Python stats; keep it simple and portable)

**Why**: Sharing types between web and API prevents drift. TS stats engine can run client-side for instant demo mode.

---

### Monorepo Tooling
- **Package Manager**: `pnpm` (fast, disk-efficient, workspace support)
- **Structure**:
  ```
  /apps/web         → Next.js app
  /apps/api         → FastAPI app
  /packages/core    → Shared TS types + stats functions
  /data/fixtures    → Demo mode JSON files
  /data/cache       → SQLite DB + cached payloads
  ```

**Why**: pnpm is industry standard for monorepos, clean separation of concerns.

---

## UI Style & Design System

### Visual Identity
- **Brand Colors**:
  - Primary: `hsl(250, 70%, 55%)` (vibrant purple)
  - Secondary: `hsl(210, 85%, 45%)` (deep navy)
  - Accent: `hsl(185, 75%, 50%)` (cyan for highlights)
- **Typography**: 
  - Headings: Inter variable font (600-700 weight)
  - Body: Inter variable font (400-500 weight)
- **Aesthetic**: Premium SaaS dashboard, esports-meets-analytics, glassmorphism accents

### Component Library
- **Base**: shadcn/ui (Button, Card, Input, Select, Dialog, Skeleton, Toast)
- **Custom**: Evidence Drawer, Report Section Cards, Insight Cards, Confidence Meter
- **Icons**: Lucide icons (lightweight, consistent)

### Layout Structure
- **App Shell**: Fixed left sidebar (32px nav icons) + top bar (logo, search, settings) + main content
- **Report Page**: Sticky section nav (left) + scrollable content (center) + metadata panel (right, optional)

**Why**: Familiar SaaS patterns reduce cognitive load, shadcn/ui is customizable and well-typed.

---

## Report Structure & Sections

### Report JSON Schema
```typescript
interface ScoutingReport {
  metadata: {
    teamId: string;
    teamName: string;
    matchWindow: { first: string; last: string };
    matchesAnalyzed: number;
    generatedAt: string;
    mode: "demo" | "live";
  };
  sections: {
    overview: OverviewSection;
    teamInsights: Insight[];        // 5 insights
    playerInsights: Insight[];      // 4 insights
    compInsights: Insight[];        // 2 insights
    exploits: Insight[];            // 1 red flag
    howToWin: Counter[];            // 3-5 counters
  };
}

interface Insight {
  id: string;                       // stable, deterministic
  category: string;
  title: string;
  claim: string;                    // one-liner
  value: string | number;           // "73%" or 0.73
  confidence: number;               // 0-100
  evidence: Evidence;
}

interface Evidence {
  metric: string;                   // definition
  sampleSize: { matches: number; rounds?: number };
  numerator: number;
  denominator: number;
  matchIds: string[];               // supporting matches
  details?: any;                    // optional charts/tables
}

interface Counter {
  id: string;
  title: string;
  condition: string;                // "When opponent forces after pistol loss"
  action: string;                   // "Apply early aggression on their weak buy"
  expectedOutcome: string;
  confidence: number;
  evidence: Evidence;
}
```

**Why**: This schema ensures every claim is verifiable and UI can render consistently.

---

## Metrics List (12 Minimum)

### Team-Wide Strategy (5)
1. **Attack Side Preference**: % rounds won per site (A/B/C), sample: all attack rounds
2. **Defense Stack Patterns**: % rounds with 3+ players on one site at round start, sample: all defense rounds
3. **Eco Round Discipline**: Win rate on save rounds vs force-buy rounds, sample: economy-disadvantaged rounds
4. **Overtime Clutch Rate**: Win % in OT rounds, sample: OT rounds only
5. **Map Pool Strength**: Win % per map, sample: all matches grouped by map

### Player Tendencies (4)
6. **Star Player Dependency**: Team win % when top fragger gets 20+ kills vs <20, sample: all matches
7. **Entry Fragger Success**: First blood success % for primary duelist, sample: all rounds where player entries
8. **Clutch Specialist**: 1vX win rate for designated clutch player, sample: all clutch situations
9. **Agent Pool Flexibility**: Unique agents played by flex player, sample: all matches

### Comps & Setups (2)
10. **Signature Comp**: Most-played agent composition per map, sample: all matches on that map
11. **Default Setup Win Rate**: Win % when using most common site setup, sample: rounds with that setup

### Red Flag / Exploit (1)
12. **Critical Weakness**: Highest-confidence losing condition (e.g., "73% round loss rate when forcing after pistol loss"), sample: all applicable rounds

**Why**: 12 is enough to be comprehensive but not overwhelming. Each metric is computable from match/round data.

---

## Caching Strategy

### SQLite Schema (in `/data/cache/scoutedge.db`)
```sql
CREATE TABLE teams (
    team_id TEXT PRIMARY KEY,
    team_name TEXT,
    last_fetched INTEGER,  -- unix timestamp
    payload BLOB           -- JSON of team data
);

CREATE TABLE matches (
    match_id TEXT PRIMARY KEY,
    team_id TEXT,
    match_date INTEGER,
    payload BLOB,          -- JSON of match data
    FOREIGN KEY(team_id) REFERENCES teams(team_id)
);

CREATE TABLE reports (
    report_id TEXT PRIMARY KEY,
    team_id TEXT,
    last_n INTEGER,
    mode TEXT,             -- "demo" | "live"
    generated_at INTEGER,
    report_json BLOB,
    FOREIGN KEY(team_id) REFERENCES teams(team_id)
);
```

### Caching Rules
- **Team Data**: Cache for 24 hours
- **Match Data**: Cache indefinitely (historical data doesn't change)
- **Reports**: Cache for 1 hour; if same `(teamId, lastN, mode)` requested within 1 hour, serve cached

**Why**: Reduces API calls, enables instant re-generation, respects rate limits.

---

## Demo Mode Approach

### Implementation
- **Trigger**: UI toggle "Demo Mode" OR API query param `?mode=demo`
- **Data Source**: Load from `/data/fixtures/demo-team.json` (single fixture team with 10 realistic matches)
- **Behavior**: Identical to live mode, but zero API calls
- **UI**: Show banner "Demo Mode Active" with subtle styling

### Fixture Dataset Requirements
- 1 opponent team (fictional but realistic name, e.g., "Phantom Tactics")
- 10 matches across 3 maps (Ascent, Bind, Haven)
- Enough round-level data to compute all 12 metrics
- Consistent player names and roles

**Why**: Judges need to see a working product without GRID credentials. Demo mode must be indistinguishable in quality.

---

## API Design

### Endpoints
1. `GET /health` → `{ status: "ok" }`
2. `GET /teams/search?q=phantom` → `Team[]`
3. `GET /teams/{teamId}` → `TeamDetails`
4. `GET /teams/{teamId}/matches?lastN=10` → `Match[]`
5. `POST /report/generate` → `ScoutingReport`
   - Body: `{ teamId, lastN, mode }`
   - Returns full report JSON

### Response Format (Standardized)
```typescript
{
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
  meta?: { cached: boolean; generatedAt: string };
}
```

**Why**: Consistent error handling, easy to debug, supports caching metadata.

---

## GRID API Integration Strategy

### Phase 1 (Prompt 15): Skeleton Only
- Add `GRID_API_KEY` environment variable
- Create `GridClient` class with placeholder methods
- Add automatic fallback: if GRID call fails → switch to demo mode + show toast

### Phase 2 (Prompt 16): Real Integration (Optional)
- Implement actual GRID API calls (teams, matches, rounds)
- Add request throttling (max 10 req/min)
- Add retry logic with exponential backoff

**Why**: We want to claim real-data support but never crash. Demo mode is the safety net.

---

## Open Source Strategy

### License
- **Choice**: MIT License
- **Rationale**: Maximum permissiveness, encourages adoption, meets hackathon requirement

### Repository
- **Platform**: GitHub (public)
- **README**: Must include:
  - Quick start (demo mode)
  - Setup instructions (live mode)
  - Junie usage notes
  - Architecture diagram
  - Screenshots
  - License badge

**Why**: MIT is standard for hackathons, GitHub is expected, good README wins bonus points.

---

## JetBrains IDE & Junie Usage

### Required Documentation
- README section: "Developed with JetBrains WebStorm + PyCharm"
- Mention Junie AI for:
  - Boilerplate generation (API routes, components)
  - Type generation from Zod schemas
  - Test scaffolding

**Why**: Category requirement to highlight JetBrains tooling.

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-26 | Game: Valorant over LoL | Richer tactical data, better API coverage |
| 2026-01-26 | Stats engine: TypeScript over Python | Client-side portability, type safety |
| 2026-01-26 | Package manager: uv for Python | Modern, fast, reliable |
| 2026-01-26 | UI framework: shadcn/ui | Premium look, easy customization |
| 2026-01-26 | Database: SQLite | Zero-config, portable, sufficient for caching |

---

**Status**: FROZEN  
**Next**: Proceed to scaffold (Prompt 2)
