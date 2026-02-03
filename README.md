# ScoutEdge ⚡

**Automated Scouting Report Generator for Valorant**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)](https://fastapi.tiangolo.com/)

> Built for Cloud9 x JetBrains Hackathon, Category 2: Automated Scouting Report Generator

ScoutEdge transforms hours of manual VOD analysis into data-backed strategic insights in under 60 seconds. Generate comprehensive scouting reports with 12+ actionable insights, all with transparent evidence.

---

## ✨ Features

- **🎯 12+ Data-Backed Insights**: Team strategies, player tendencies, composition patterns, and exploitable weaknesses
- **📊 Evidence Transparency**: Every claim shows sample size, match IDs, and supporting data
- **🎮 Demo Mode**: Full functionality without API keys (uses fixture data)
- **⚡ Instant Generation**: Reports in <3 seconds with intelligent caching
- **📤 Export & Share**: PDF export and shareable URLs
- **🎨 Premium UI**: 11/10 dashboard design with smooth animations

---

## 🚀 Quick Start (Demo Mode)

### Prerequisites
- **Node.js** 20+
- **pnpm** 9+ (`npm install -g pnpm`)
- **Python** 3.12+
- **uv** ([installation](https://docs.astral.sh/uv/getting-started/installation/))

### Installation

```bash
# Clone the repository
git clone <repo-url> scoutedge
cd scoutedge

# Install dependencies
pnpm install
cd apps/api && uv sync && cd ../..
```

### Run the App

**Terminal 1 - Web Frontend**
```bash
pnpm dev:web
# Opens on http://localhost:3000
```

**Terminal 2 - API Backend**
```bash
pnpm dev:api
# Runs on http://localhost:8000
# API docs: http://localhost:8000/docs
```

### Generate Your First Report

1. Open http://localhost:3000
2. Toggle **Demo Mode** ON
3. Select opponent team (auto-filled)
4. Set match window (5-20 matches)
5. Click **Generate Report**
6. Explore insights and click **Evidence** buttons to verify claims

---

## 🏗️ Project Structure

```
scoutedge/
├── apps/
│   ├── web/              # Next.js 15 frontend (TypeScript + Tailwind)
│   └── api/              # FastAPI backend (Python 3.12+)
├── packages/
│   └── core/             # Shared TypeScript types & stats engine
├── data/
│   ├── fixtures/         # Demo mode fixture data
│   └── cache/            # SQLite cache database
├── SPEC.md               # Product specification
├── DECISIONS.md          # Architecture decisions
├── TASKS.md              # Development checklist
└── RUNBOOK.md            # Operations guide
```

---

## 🔧 Development with JetBrains IDEs

This project was developed using **JetBrains WebStorm** and **PyCharm** with the **Junie AI** assistant.

### Junie AI Usage
- **Boilerplate generation**: API routes, React components, type definitions
- **Type inference**: Generated Zod schemas from TypeScript interfaces
- **Test scaffolding**: Unit test templates for stats engine
- **Code refactoring**: Optimized computations and reduced re-renders

**Get Junie**: Install from the JetBrains Marketplace in your IDE settings.

---

## 🌐 Data Sources

> **For Judges**: ScoutEdge supports both demo data for reliability and live GRID data for real-world credibility. Demo mode ensures instant usability with zero configuration, while GRID integration powers evidence-backed insights using official esports data.

### Demo Mode (Default)
- ✅ Works instantly, no API key required
- ✅ Rich mock data with 5+ teams and realistic insights
- ✅ Perfect for testing, demos, and offline use
- ✅ Always available as fallback

### Live GRID Mode (Optional)
To use real Valorant match data:

1. Get a GRID API key from [https://grid.gg/](https://grid.gg/)
2. Copy environment file:
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```
3. Edit `apps/web/.env.local`:
   ```bash
   GRID_API_KEY=your_actual_key_here
   ENABLE_GRID_INTEGRATION=true
   ```
4. Restart the dev server
5. Toggle **GRID** in the sidebar data source switcher

**Features:**
- Real-time team and player data via GRID GraphQL APIs
- Automatic fallback to Demo if GRID fails
- API key never exposed to browser
- Timeout and rate-limit protection


---

## 📊 Insights Generated (12+ Metrics)

### Team-Wide Strategy (5)
- Attack side preferences & site tendencies
- Defense stack patterns & rotations
- Economy discipline (force vs save rounds)  
- Overtime performance
- Map pool strengths

### Player Tendencies (4)
- Star player dependency analysis
- Entry fragger success rates
- Clutch specialists (1vX win rates)
- Agent pool flexibility

### Compositions & Setups (2)
- Most-played compositions per map
- Default site setup win rates

### Red Flag / Exploit (1)
- Highest-confidence weakness with counter-strategy

---

## 🧪 Testing

```bash
# Stats engine tests (TypeScript)
pnpm --filter core test

# API tests (Python)
cd apps/api && pytest
```

---

## 📦 Build for Production

```bash
# Build web frontend
pnpm build

# Preview production build
cd apps/web && pnpm start
```

---

## 📜 License

MIT License - see [LICENSE](./LICENSE) for details.

Open source and free to use, modify, and distribute.

---

## 🎯 Hackathon Details

**Category**: Sky's the Limit – Cloud9 x JetBrains Hackathon, Category 2  
**Target Game**: Valorant  
**Built With**: Next.js, FastAPI, TypeScript, Tailwind CSS, shadcn/ui, SQLite  
**Development Tools**: JetBrains WebStorm, PyCharm, Junie AI

---

## 🤝 Contributing

This is a hackathon project, but contributions are welcome! Feel free to open issues or submit PRs.

---

## 📧 Contact

For questions or feedback, open an issue on GitHub.

---

**Made with ⚡ for coaches who want their time back**
