from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.demo import generate_demo_report

app = FastAPI(
    title="ScoutEdge API",
    description="Automated Scouting Report Generator for Valorant",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GenerateReportRequest(BaseModel):
    teamId: str
    lastN: int
    mode: str


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "scoutedge-api",
        "version": "1.0.0"
    }


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to ScoutEdge API",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/teams/search")
async def search_teams(q: str = ""):
    """Search for teams (demo mode returns fixture team)"""
    if not q or "phantom" in q.lower():
        return {
            "success": True,
            "data": [
                {
                    "id": "demo-team-001",
                    "name": "Phantom Tactics",
                    "region": "NA",
                    "logo": None
                }
            ]
        }
    return {"success": True, "data": []}


@app.post("/report/generate")
async def generate_report(request: GenerateReportRequest):
    """Generate scouting report"""
    try:
        if request.mode == "demo":
            report = generate_demo_report(request.teamId, request.lastN)
            return {
                "success": True,
                "data": report,
                "meta": {
                    "cached": False,
                    "generatedAt": report["metadata"]["generatedAt"]
                }
            }
        else:
            raise HTTPException(
                status_code=501,
                detail="Live mode not yet implemented (coming in Prompt 15)"
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
