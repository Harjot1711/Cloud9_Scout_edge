import json
from pathlib import Path

# Load demo fixtures
FIXTURES_PATH = Path(__file__).parent.parent.parent.parent / "data" / "fixtures" / "demo-team.json"

def load_demo_data():
    """Load demo fixture data"""
    with open(FIXTURES_PATH, "r") as f:
        return json.load(f)

def generate_demo_insights(matches):
    """Generate mock insights from matches (Prompt 7 will implement real stats)"""
    return {
        "teamInsights": [
            {
                "id": "team-001",
               "category": "team",
                "title": "Site A Dominance",
                "claim": "Team wins 73% of rounds when attacking Site A",
                "value": "73%",
                "confidence": 87,
                "evidence": {
                    "metric": "Attack Site A Win Rate",
                    "sampleSize": {"matches": len(matches), "rounds": 42},
                    "numerator": 31,
                    "denominator": 42,
                    "matchIds": [m["id"] for m in matches[:5]]
                }
            },
            {
                "id": "team-002",
                "category": "team",
                "title": "Eco Round Discipline",
                "claim": "High save discipline with 62% eco round conversion",
                "value": "62%",
                "confidence": 78,
                "evidence": {
                    "metric": "Eco Round Win Rate",
                    "sampleSize": {"matches": len(matches), "rounds": 18},
                    "numerator": 11,
                    "denominator": 18,
                    "matchIds": [m["id"] for m in matches]
                }
            }
        ],
        "playerInsights": [
            {
                "id": "player-001",
                "category": "player",
                "title": "Entry Fragger Success",
                "claim": "Primary duelist has 68% first blood success rate",
                "value": "68%",
                "confidence": 82,
                "evidence": {
                    "metric": "First Blood Success Rate",
                    "sampleSize": {"matches": len(matches), "rounds": 50},
                    "numerator": 34,
                    "denominator": 50,
                    "matchIds": [m["id"] for m in matches]
                }
            }
        ],
        "compInsights": [
            {
                "id": "comp-001",
                "category": "comp",
                "title": "Ascent Signature Comp",
                "claim": "Jett-Sova-Omen-Killjoy-Sage has 80% win rate on Ascent",
                "value": "80%",
                "confidence": 85,
                "evidence": {
                    "metric": "Comp Win Rate on Ascent",
                    "sampleSize": {"matches": 5},
                    "numerator": 4,
                    "denominator": 5,
                    "matchIds": [m["id"] for m in matches if m["map"] == "Ascent"]
                }
            }
        ],
        "exploits": [
            {
                "id": "exploit-001",
                "category": "exploit",
                "title": "Force Buy Weakness",
                "claim": "Team loses 71% of rounds when forcing after pistol loss",
                "value": "71%",
                "confidence": 91,
                "evidence": {
                    "metric": "Force Buy Round Loss Rate",
                    "sampleSize": {"matches": len(matches), "rounds": 14},
                    "numerator": 10,
                    "denominator": 14,
                    "matchIds": [m["id"] for m in matches[:7]]
                }
            }
        ],
        "howToWin": [
            {
                "id": "counter-001",
                "title": "Punish Force Buys",
                "condition": "When opponent forces after pistol loss",
                "action": "Apply early aggression to exploit weak utility",
                "expectedOutcome": "71% win rate based on their force-buy pattern",
                "confidence": 91,
                "evidence": {
                    "metric": "Counter-strategy success prediction",
                    "sampleSize": {"matches": len(matches), "rounds": 14},
                    "numerator": 10,
                    "denominator": 14,
                    "matchIds": [m["id"] for m in matches[:7]]
                }
            }
        ]
    }

def generate_demo_report(team_id: str, last_n: int):
    """Generate a complete demo scouting report"""
    data = load_demo_data()
    matches = data["matches"][:last_n]
    
    insights = generate_demo_insights(matches)
    
    return {
        "metadata": {
            "reportId": f"demo-report-{team_id}-{last_n}",
            "teamId": team_id,
            "teamName": data["team"]["name"],
            "generatedAt": "2026-01-26T21:00:00Z",
            "mode": "demo",
            "lastN": last_n
        },
        "sections": {
            "overview": {
                "teamName": data["team"]["name"],
                "teamId": team_id,
                "matchWindow": {
                    "first": matches[-1]["date"],
                    "last": matches[0]["date"]
                },
                "matchesAnalyzed": len(matches),
                "mapsPlayed": list(set(m["map"] for m in matches)),
                "overallWinRate": sum(1 for m in matches if m["won"]) / len(matches)
            },
            **insights
        }
    }
