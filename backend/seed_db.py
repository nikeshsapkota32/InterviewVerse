"""
Seed script — creates two demo users and pre-populates interview history.

  demo1@interviewverse.com / Demo123!  →  plan: premium
  demo2@interviewverse.com / Demo123!  →  plan: free

Run with:  python seed_db.py
"""
import json
import random
import uuid
from datetime import datetime, timezone, timedelta

import database as db
from services.auth import hash_password, get_initials


# ── Demo users ────────────────────────────────────────────────────────────────

DEMO_USERS = [
    {
        "name": "Alex Premium",
        "email": "demo1@interviewverse.com",
        "password": "Demo1234",
        "plan": "premium",
    },
    {
        "name": "Jamie Free",
        "email": "demo2@interviewverse.com",
        "password": "Demo1234",
        "plan": "free",
    },
]

# ── Seed history config ───────────────────────────────────────────────────────
#  premium user gets 12 sessions, free user gets 3
HISTORY = {
    "premium": 12,
    "free": 3,
}

PROBLEM_IDS = list(db.PROBLEMS.keys())

COMPANIES = ["Google", "Meta", "Amazon", "Stripe", "Microsoft", "Apple", "Netflix"]

SKILL_LABELS = ["Technical", "Communication", "Problem-solving", "Code quality"]


def _random_past(days_ago_max: int, days_ago_min: int = 0) -> str:
    offset = random.randint(days_ago_min * 86400, days_ago_max * 86400)
    dt = datetime.now(timezone.utc) - timedelta(seconds=offset)
    return dt.isoformat()


def _fake_result(session_id: str, user_id: str, problem: dict, created_at: str) -> dict:
    score = random.randint(55, 98)
    mins = random.randint(18, 44)
    secs = random.randint(0, 59)
    return {
        "session_id": session_id,
        "user_id": user_id,
        "score": score,
        "rating": (
            "Strong hire" if score >= 85 else
            "Hire" if score >= 75 else
            "Maybe" if score >= 60 else "No hire"
        ),
        "problem_title": problem["title"],
        "problem_type": f"Coding · {problem['difficulty']}",
        "duration": f"{mins:02d}:{secs:02d}",
        "questions_count": random.randint(3, 6),
        "tests_passed": f"{random.randint(8, 12)}/12",
        "percentile": f"Top {random.choice([5, 10, 15, 20, 30, 40])}%",
        "summary": (
            "Strong technical performance with clear communication and optimal solution choice."
            if score >= 80 else
            "Good approach with room to improve edge-case handling and explanation clarity."
        ),
        "skill_breakdown": [
            {"label": lbl, "score": min(100, score + random.randint(-8, 8)), "change": random.randint(0, 6)}
            for lbl in SKILL_LABELS
        ],
        "strengths": [
            "Identified optimal data structure quickly",
            "Clear explanation of time complexity",
            "Good edge case handling",
        ],
        "improvements": [
            "Could improve communication of initial approach",
            "Add more comments to code",
        ],
        "key_moments": [
            {"time": "01:24", "tone": "good", "text": "Asked clarifying question about constraints."},
            {"time": "04:32", "tone": "good", "text": "Identified the optimal approach unprompted."},
            {"time": "08:15", "tone": "neutral", "text": "Discussed time/space complexity tradeoffs."},
        ],
        "speech": {
            "pace_wpm": random.randint(125, 160),
            "filler_words": random.randint(3, 15),
            "clarity_percent": random.randint(78, 97),
            "pace_over_time": [random.randint(110, 165) for _ in range(12)],
        },
        "body_language": {
            "eye_contact_percent": random.randint(70, 95),
            "posture": random.choice(["Stable", "Good", "Excellent"]),
            "energy": random.choice(["High", "Medium", "Confident"]),
            "eye_contact_over_time": [random.randint(55, 99) for _ in range(16)],
        },
        "transcript": [
            {"time": "00:08", "who": "ai", "text": "Take a moment to read the prompt. Let me know when you're ready."},
            {"time": "00:42", "who": "user", "text": "Got it. Can the input contain negative numbers?"},
            {"time": "00:51", "who": "ai", "text": "Yes, anywhere from -10⁹ to 10⁹. Good clarification."},
            {"time": "01:24", "who": "user", "text": "I'll use a hash map to achieve O(n) time."},
            {"time": "04:32", "who": "ai", "text": "Great. Walk me through your solution."},
        ],
        "recommendations": [
            {"title": "Graph algorithms", "description": "Build on your hash map skills with BFS and DFS patterns.", "duration": "30 min", "level": "Medium", "icon": "🔗"},
            {"title": "System design", "description": "Apply your problem-solving instincts to design rounds.", "duration": "45 min", "level": "Hard", "icon": "🏗"},
        ],
        "hf_analysis": {},
        "created_at": created_at,
    }


def seed():
    for u in DEMO_USERS:
        existing = db.get_user_by_email(u["email"])
        if existing:
            # Update plan in case it changed
            db.update_user_plan(existing["id"], u["plan"])
            user_id = existing["id"]
            print(f"  User exists, updated plan: {u['email']} ({u['plan']})")
        else:
            created = db.create_user({
                "name": u["name"],
                "email": u["email"],
                "password_hash": hash_password(u["password"]),
                "initials": get_initials(u["name"]),
                "plan": u["plan"],
            })
            user_id = created["id"]
            print(f"  Created user: {u['email']} (plan: {u['plan']})")

        # Seed interview history only if user has none yet
        existing_sessions = db.get_user_sessions(user_id)
        n_history = HISTORY[u["plan"]]

        if len(existing_sessions) >= n_history:
            print(f"  History already seeded for {u['email']} ({len(existing_sessions)} sessions)")
            continue

        sessions_to_add = n_history - len(existing_sessions)
        print(f"  Seeding {sessions_to_add} sessions for {u['email']}…")

        for i in range(sessions_to_add):
            problem_id = random.choice(PROBLEM_IDS)
            problem = db.get_problem(problem_id)
            created_at = _random_past(days_ago_max=30, days_ago_min=i)

            session_id = str(uuid.uuid4())
            score = random.randint(55, 98)

            # Manually insert session with a specific created_at
            import sqlite3
            from database import DB_PATH
            con = sqlite3.connect(DB_PATH)
            con.execute(
                "INSERT INTO sessions "
                "(id, user_id, problem_id, problem_json, interview_type, code, transcript_json, "
                " question_index, started, ended, score, created_at) "
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    session_id, user_id, problem_id,
                    json.dumps(problem), "Coding",
                    "def solution(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i",
                    json.dumps([
                        {"time": "00:08", "who": "ai", "text": "Take a moment to read the prompt."},
                        {"time": "01:24", "who": "user", "text": "I'll use a hash map approach."},
                        {"time": "04:32", "who": "ai", "text": "Great. Walk me through your solution."},
                    ]),
                    3, 1, 1, score, created_at,
                ),
            )
            con.commit()
            con.close()

            result_data = _fake_result(session_id, user_id, problem, created_at)
            result_data["score"] = score

            import sqlite3 as _sq
            _con = _sq.connect(DB_PATH)
            _con.execute(
                "INSERT OR REPLACE INTO results (id, user_id, result_json, created_at) VALUES (?, ?, ?, ?)",
                (session_id, user_id, json.dumps(result_data), created_at),
            )
            _con.commit()
            _con.close()

    print("\nDone. Demo credentials:")
    print("  Premium: demo1@interviewverse.com / Demo1234")
    print("  Free:    demo2@interviewverse.com / Demo1234")


if __name__ == "__main__":
    seed()
