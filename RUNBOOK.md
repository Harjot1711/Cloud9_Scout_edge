# ScoutEdge Operations Runbook

**Purpose**: Step-by-step instructions to run, deploy, and operate ScoutEdge.

---

## Prerequisites

### Required Software
- **Node.js**: v20+ ([download](https://nodejs.org/))
- **pnpm**: v9+ (install: `npm install -g pnpm`)
- **Python**: 3.12+ ([download](https://www.python.org/downloads/))
- **uv**: latest (install: `pip install uv`)
- **Git**: latest ([download](https://git-scm.com/))

### Recommended Tools
- **JetBrains WebStorm** (frontend dev)
- **JetBrains PyCharm** (backend dev)
- **Junie AI** (JetBrains plugin for accelerated development)

---

## Quick Start (Demo Mode)

> **Demo Mode runs the full app without any API keys or external dependencies.**

### 1. Clone and Install
```bash
git clone <repo-url> scoutedge
cd scoutedge
pnpm install
```

### 2. Run Web App
```bash
pnpm --filter web dev
```
- Open: http://localhost:3000
- Default port: 3000 (configurable in `apps/web/.env.local`)

### 3. Run API Server
```bash
cd apps/api
uv run fastapi dev main.py
```
- API runs at: http://localhost:8000
- Health check: http://localhost:8000/health

### 4. Generate a Demo Report
1. Open web app (http://localhost:3000)
2. Toggle "Demo Mode" ON
3. Select opponent (auto-filled with "Phantom Tactics")
4. Set last N matches (e.g., 10)
5. Click "Generate Report"
6. Report appears in <3 seconds

---

## Development Mode (Live GRID Data)

### 1. Get GRID API Key
- Sign up at [GRID Esports](https://grid.gg/) (requires approval)
- Copy your API key

### 2. Configure Environment
Copy `.env.example` to `.env` in both apps:

**apps/web/.env.local**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_DEMO_MODE=false
```

**apps/api/.env**
```bash
GRID_API_KEY=your_actual_api_key_here
DEMO_MODE=false
DATABASE_PATH=../../data/cache/scoutedge.db
```

### 3. Initialize Database
```bash
cd apps/api
python scripts/init_db.py
```

### 4. Run Both Services
**Terminal 1 (Web)**
```bash
pnpm --filter web dev
```

**Terminal 2 (API)**
```bash
cd apps/api
uv run fastapi dev main.py --reload
```

### 5. Generate a Live Report
1. Toggle "Demo Mode" OFF
2. Search for a real Valorant team
3. Generate report (may take 5-10s on first fetch)
4. Subsequent reports are cached (instant)

---

## Project Structure

```
scoutedge/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── app/                # App router pages
│   │   ├── components/         # React components
│   │   ├── lib/                # Utilities
│   │   └── package.json
│   └── api/                    # FastAPI backend
│       ├── main.py             # Entry point
│       ├── routes/             # API endpoints
│       ├── services/           # Business logic
│       └── pyproject.toml
├── packages/
│   └── core/                   # Shared TypeScript
│       ├── types.ts            # Type definitions
│       ├── stats/              # Stats engine
│       └── package.json
├── data/
│   ├── fixtures/               # Demo mode JSON files
│   │   └── demo-team.json
│   └── cache/                  # SQLite + cached payloads
│       └── scoutedge.db
├── SPEC.md                     # Product spec (frozen)
├── DECISIONS.md                # Architecture decisions (frozen)
├── TASKS.md                    # Task checklist
├── RUNBOOK.md                  # This file
├── STATUS.md                   # Progress log
├── LICENSE                     # MIT License
└── README.md                   # Public-facing docs
```

---

## Common Commands

### Install Dependencies
```bash
pnpm install                    # Root + all workspaces
```

### Run Development Servers
```bash
pnpm --filter web dev           # Next.js on :3000
cd apps/api && uv run fastapi dev main.py  # FastAPI on :8000
```

### Build for Production
```bash
pnpm --filter web build         # Next.js production build
cd apps/api && uv build         # Python package (if needed)
```

### Run Tests
```bash
pnpm --filter core test         # Stats engine tests
cd apps/api && pytest           # API tests
```

### Lint & Format
```bash
pnpm lint                       # ESLint + Prettier (web + core)
cd apps/api && ruff check .     # Python linting
```

---

## Troubleshooting

### Web app doesn't start
- Check Node.js version: `node -v` (must be 20+)
- Clear cache: `rm -rf .next node_modules && pnpm install`

### API doesn't start
- Check Python version: `python --version` (must be 3.12+)
- Reinstall: `cd apps/api && uv sync`

### Report generation fails in demo mode
- Check fixture file exists: `data/fixtures/demo-team.json`
- Check API logs for errors

### GRID API returns errors
- Verify API key in `apps/api/.env`
- Check rate limits (max 10 req/min typically)
- App should auto-fallback to demo mode

---

## Deployment (Optional)

### Frontend (Vercel)
```bash
cd apps/web
vercel deploy
```
Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` → your API URL

### Backend (Fly.io or Railway)
```bash
cd apps/api
fly launch  # or railway up
```
Set environment variables:
- `GRID_API_KEY`
- `DATABASE_PATH=/data/scoutedge.db`

---

## Maintenance

### Clear Cache
```bash
rm data/cache/scoutedge.db
cd apps/api && python scripts/init_db.py
```

### Update Fixtures
Edit `data/fixtures/demo-team.json` manually or re-generate from live data.

---

## Support

- **Issues**: GitHub Issues
- **Docs**: See README.md and SPEC.md
- **Contact**: [your-email@example.com]

---

**Last Updated**: 2026-01-26  
**Status**: Initial version (Prompt 1)  
**Next Update**: After Prompt 2 (add actual run commands)
