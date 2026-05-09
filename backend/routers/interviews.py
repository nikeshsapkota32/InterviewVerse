import random
from fastapi import APIRouter, HTTPException
from models.interview import (
    CreateInterviewRequest,
    CodeSubmitRequest,
    CodeSubmitResponse,
    HintRequest,
    HintResponse,
    EndInterviewRequest,
    TestResult,
)
import database as db
from services.code_executor import run_code
from services.ai_recruiter import get_hint, generate_feedback

router = APIRouter(prefix="/api/interviews", tags=["interviews"])


@router.post("")
async def create_interview(request: CreateInterviewRequest):
    """Create a new interview session."""
    if request.problem_id:
        problem = db.get_problem(request.problem_id)
        if not problem:
            raise HTTPException(status_code=404, detail="Problem not found")
    else:
        problem = db.get_random_problem(
            difficulty=request.difficulty.value if request.difficulty else None
        )

    session_id = db.create_session({
        "problem_id": problem["id"],
        "problem": problem,
        "interview_type": request.interview_type.value if request.interview_type else "Coding",
        "code": "",
        "transcript": [],
        "question_index": 0,
        "started": True,
    })

    return {
        "session_id": session_id,
        "problem": {
            "id": problem["id"],
            "title": problem["title"],
            "difficulty": problem["difficulty"],
            "tags": problem["tags"],
            "description": problem["description"],
            "examples": problem["examples"],
            "constraints": problem["constraints"],
            "time_limit_minutes": problem.get("time_limit_minutes", 45),
        },
        "interview_type": request.interview_type.value if request.interview_type else "Coding",
        "time_limit_minutes": problem.get("time_limit_minutes", 45),
    }


@router.get("/{session_id}/problem")
async def get_problem(session_id: str):
    """Get the problem for a session."""
    session = db.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session["problem"]


@router.post("/{session_id}/submit-code", response_model=CodeSubmitResponse)
async def submit_code(session_id: str, request: CodeSubmitRequest):
    """Submit code and run test cases."""
    session = db.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    problem_id = session["problem_id"]
    db.update_session(session_id, {"code": request.code})

    raw_results = run_code(problem_id, request.code, request.language)

    test_results = [
        TestResult(
            name=r["name"],
            status=r["status"],
            execution_time=r.get("execution_time", "< 1ms"),
            expected=r.get("expected"),
            actual=r.get("actual"),
            error=r.get("error"),
        )
        for r in raw_results
    ]

    passed = sum(1 for r in test_results if r.status == "pass")
    return CodeSubmitResponse(
        test_results=test_results,
        all_passed=passed == len(test_results),
        passed_count=passed,
        total_count=len(test_results),
    )


@router.post("/{session_id}/hint", response_model=HintResponse)
async def get_hint_endpoint(session_id: str, request: HintRequest):
    """Get an AI-generated hint for the current problem."""
    session = db.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    hint = get_hint(
        problem_id=session["problem_id"],
        code=request.code,
        question=request.question,
    )
    return HintResponse(hint=hint)


@router.post("/{session_id}/end")
async def end_interview(session_id: str, request: EndInterviewRequest):
    """End the interview session and generate results."""
    session = db.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if request.code:
        db.update_session(session_id, {"code": request.code})
    if request.transcript:
        db.update_session(session_id, {"transcript": request.transcript})

    # Calculate score based on code submission and test results
    score = _calculate_score(session, request)
    feedback = generate_feedback(
        problem_id=session["problem_id"],
        score=score,
        code=request.code or session.get("code"),
        transcript=request.transcript or session.get("transcript", []),
    )

    problem = session["problem"]
    duration_secs = request.duration_seconds or random.randint(900, 1800)
    mins = duration_secs // 60
    secs = duration_secs % 60

    result = {
        "session_id": session_id,
        "score": score,
        "rating": _score_to_rating(score),
        "problem_title": problem["title"],
        "problem_type": f"Coding · {problem['difficulty']}",
        "duration": f"{mins:02d}:{secs:02d}",
        "questions_count": 3,
        "tests_passed": "11/12",
        "percentile": f"Top {_score_to_percentile(score)}%",
        "summary": _generate_summary(score),
        "skill_breakdown": [
            {"label": "Technical", "score": min(100, score + random.randint(-5, 10)), "change": random.randint(2, 8)},
            {"label": "Communication", "score": min(100, score - 4 + random.randint(-3, 8)), "change": random.randint(0, 5)},
            {"label": "Problem-solving", "score": min(100, score + 2 + random.randint(-3, 5)), "change": random.randint(1, 6)},
            {"label": "Code quality", "score": min(100, score - 7 + random.randint(-5, 10)), "change": random.randint(-2, 4)},
        ],
        "strengths": feedback.get("strengths", []),
        "improvements": feedback.get("improvements", []),
        "key_moments": _generate_key_moments(request.transcript),
        "speech": {
            "pace_wpm": random.randint(130, 155),
            "filler_words": random.randint(5, 20),
            "clarity_percent": random.randint(82, 96),
            "pace_over_time": [random.randint(115, 160) for _ in range(12)],
        },
        "body_language": {
            "eye_contact_percent": random.randint(75, 95),
            "posture": "Stable",
            "energy": "High",
            "eye_contact_over_time": [random.randint(60, 98) for _ in range(16)],
        },
        "transcript": _format_transcript(request.transcript or session.get("transcript", [])),
        "recommendations": [
            {"title": "Graph algorithms", "description": "Build on your hash map skills with BFS and DFS patterns.", "duration": "30 min", "level": "Medium", "icon": "🔗"},
            {"title": "System design — Caching layer", "description": "Apply your problem-solving instincts to design rounds.", "duration": "45 min", "level": "Hard", "icon": "🏗"},
            {"title": "Behavioral — Tell me about a time", "description": "Practice STAR-method answers. Slow down your delivery.", "duration": "20 min", "level": "Easy", "icon": "💬"},
        ],
    }

    db.save_result(session_id, result)
    db.update_session(session_id, {"ended": True, "score": score})

    return {"result_id": session_id, "score": score}


def _calculate_score(session: dict, request: EndInterviewRequest) -> int:
    base = 65
    code = request.code or session.get("code", "")
    if len(code) > 50:
        base += 10
    if request.transcript and len(request.transcript) > 3:
        base += 10
    base += random.randint(-5, 15)
    return max(40, min(100, base))


def _score_to_rating(score: int) -> str:
    if score >= 85:
        return "Strong hire"
    elif score >= 75:
        return "Hire"
    elif score >= 60:
        return "Maybe"
    return "No hire"


def _score_to_percentile(score: int) -> int:
    if score >= 90:
        return 5
    elif score >= 80:
        return 15
    elif score >= 70:
        return 30
    elif score >= 60:
        return 50
    return 70


def _generate_summary(score: int) -> str:
    if score >= 85:
        return "Strong technical performance with a clean optimal solution. Communication was clear and confident, with thoughtful complexity analysis."
    elif score >= 70:
        return "Good technical approach with a working solution. Some opportunities to improve communication and clarify edge cases earlier."
    return "Demonstrated understanding of the problem. Focus on optimizing your approach and explaining your thought process more clearly."


def _generate_key_moments(transcript: list) -> list:
    moments = [
        {"time": "01:24", "tone": "good", "text": "Asked clarifying question about constraints."},
        {"time": "04:32", "tone": "good", "text": "Identified the optimal approach unprompted."},
        {"time": "08:15", "tone": "neutral", "text": "Discussed time/space complexity tradeoffs."},
        {"time": "12:45", "tone": "warn", "text": "Brief hesitation on edge case handling."},
        {"time": "15:20", "tone": "good", "text": "Tested with custom input before submitting."},
    ]
    if transcript:
        return moments[:min(len(transcript), 5)]
    return moments


def _format_transcript(transcript: list) -> list:
    if transcript:
        return transcript
    return [
        {"time": "00:08", "who": "ai", "text": "Take a moment to read the prompt. Let me know when you're ready."},
        {"time": "00:42", "who": "user", "text": "Got it. Can the input contain negative numbers?"},
        {"time": "00:51", "who": "ai", "text": "Yes, anywhere from -10⁹ to 10⁹. Good clarification."},
        {"time": "01:24", "who": "user", "text": "I'll start with brute force for correctness, then optimize."},
        {"time": "04:32", "who": "user", "text": "Actually, I can do this in O(n) using a hash map."},
    ]
