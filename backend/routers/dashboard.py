from fastapi import APIRouter, Depends
from services.auth import get_optional_user
import database as db

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

# Fallback data shown to unauthenticated visitors
_GUEST_DATA = {
    "user": {"name": "Guest", "streak_days": 0},
    "stats": {
        "sessions": 0,
        "avg_score": 0,
        "streak_days": 0,
        "practice_hours": 0,
        "sessions_delta": "Sign in to track",
        "avg_score_delta": "—",
    },
    "recent_sessions": [],
    "skills": [
        {"label": "System Design", "score": 0},
        {"label": "Behavioral", "score": 0},
        {"label": "Algorithms", "score": 0},
        {"label": "Communication", "score": 0},
        {"label": "Coding fluency", "score": 0},
    ],
    "performance_data": [],
}


@router.get("")
async def get_dashboard(current_user: dict | None = Depends(get_optional_user)):
    """Return dashboard stats and recent sessions for the authenticated user."""
    if not current_user:
        return _GUEST_DATA

    user_id = current_user["id"]
    results = db.get_user_results(user_id)
    sessions = db.get_user_sessions(user_id)

    # ── Stats ─────────────────────────────────────────────────────────────
    total_sessions = len(sessions)
    ended_sessions = [s for s in sessions if s.get("ended")]
    scores = [s["score"] for s in ended_sessions if s.get("score") is not None]
    avg_score = round(sum(scores) / len(scores)) if scores else 0

    # Rough practice hours: assume ~30 min per session
    practice_hours = round(len(ended_sessions) * 0.5, 1)

    # Simple streak: consecutive days with at least one session (based on created_at)
    streak_days = _compute_streak(sessions)

    # ── Recent sessions ───────────────────────────────────────────────────
    from datetime import datetime, timezone
    recent = []
    for s in sessions[:8]:
        problem = s.get("problem", {})
        result = db.get_result(s["id"])
        score = (result or {}).get("score") or s.get("score") or 0
        created_at = s.get("created_at", "")
        when = _humanize(created_at)
        recent.append({
            "id": s["id"],
            "title": f"Coding — {problem.get('title', 'Unknown')}",
            "company": "Practice",
            "type": s.get("interview_type", "Coding"),
            "score": score,
            "when": when,
        })

    # ── Skills from results ───────────────────────────────────────────────
    skill_sums: dict[str, list] = {}
    for r in results:
        for sk in r.get("skill_breakdown", []):
            skill_sums.setdefault(sk["label"], []).append(sk["score"])

    default_skills = [
        {"label": "Technical", "score": 0},
        {"label": "Communication", "score": 0},
        {"label": "Problem-solving", "score": 0},
        {"label": "Code quality", "score": 0},
        {"label": "Algorithms", "score": 0},
    ]
    if skill_sums:
        skills = [
            {"label": label, "score": round(sum(vals) / len(vals))}
            for label, vals in skill_sums.items()
        ]
    else:
        skills = default_skills

    # ── Performance over time (last 14 sessions) ──────────────────────────
    perf_scores = [s["score"] for s in reversed(ended_sessions) if s.get("score")]
    performance_data = perf_scores[-14:] if perf_scores else []

    return {
        "user": {"name": current_user["name"], "streak_days": streak_days},
        "stats": {
            "sessions": total_sessions,
            "avg_score": avg_score,
            "streak_days": streak_days,
            "practice_hours": practice_hours,
            "sessions_delta": f"+{min(total_sessions, 8)} this week",
            "avg_score_delta": f"+{max(0, avg_score - 70):.1f}" if avg_score else "—",
        },
        "recent_sessions": recent,
        "skills": skills,
        "performance_data": performance_data,
    }


def _compute_streak(sessions: list) -> int:
    from datetime import datetime, timezone, timedelta
    if not sessions:
        return 0
    dates = set()
    for s in sessions:
        raw = s.get("created_at", "")
        try:
            dt = datetime.fromisoformat(raw)
            dates.add(dt.date())
        except Exception:
            pass
    if not dates:
        return 0
    today = datetime.now(timezone.utc).date()
    streak = 0
    current = today
    while current in dates:
        streak += 1
        current -= __import__("datetime").timedelta(days=1)
    return streak


def _humanize(iso: str) -> str:
    from datetime import datetime, timezone
    try:
        dt = datetime.fromisoformat(iso)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)
        diff = now - dt
        secs = int(diff.total_seconds())
        if secs < 60:
            return "Just now"
        if secs < 3600:
            return f"{secs // 60} min ago"
        if secs < 86400:
            return f"{secs // 3600} hour{'s' if secs // 3600 > 1 else ''} ago"
        days = secs // 86400
        if days == 1:
            return "Yesterday"
        if days < 7:
            return f"{days} days ago"
        return f"{days // 7} week{'s' if days // 7 > 1 else ''} ago"
    except Exception:
        return "—"
