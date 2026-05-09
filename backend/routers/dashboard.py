from fastapi import APIRouter

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("")
async def get_dashboard():
    """Return dashboard stats and recent sessions."""
    return {
        "user": {
            "name": "Alex Morgan",
            "streak_days": 6,
        },
        "stats": {
            "sessions": 42,
            "avg_score": 78,
            "streak_days": 6,
            "practice_hours": 18.4,
            "sessions_delta": "+8 this week",
            "avg_score_delta": "+4.2",
        },
        "recent_sessions": [
            {"id": 1, "title": "System Design — URL Shortener", "company": "Google", "type": "Technical", "score": 82, "when": "2 hours ago"},
            {"id": 2, "title": "Behavioral — Leadership", "company": "Meta", "type": "Behavioral", "score": 91, "when": "Yesterday"},
            {"id": 3, "title": "Algorithms — Two Pointers", "company": "Amazon", "type": "Coding", "score": 74, "when": "Yesterday"},
            {"id": 4, "title": "System Design — Rate Limiter", "company": "Stripe", "type": "Technical", "score": 68, "when": "2 days ago"},
        ],
        "skills": [
            {"label": "System Design", "score": 82},
            {"label": "Behavioral", "score": 91},
            {"label": "Algorithms", "score": 65},
            {"label": "Communication", "score": 84},
            {"label": "Coding fluency", "score": 73},
        ],
        "performance_data": [62, 68, 65, 71, 74, 70, 73, 78, 76, 81, 79, 84, 82, 87],
    }
