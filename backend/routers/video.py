"""
Video/body language feedback endpoint.
Receives webcam metrics collected during the session and generates LLM feedback.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
import os

router = APIRouter(prefix="/api/video", tags=["video"])


class VideoMetrics(BaseModel):
    session_id: str
    eye_contact_history: List[int]   # % values over time
    avg_eye_contact: Optional[int] = None
    posture_samples: Optional[List[str]] = None
    duration_seconds: Optional[int] = None


class VideoFeedback(BaseModel):
    avg_eye_contact: int
    posture: str
    energy: str
    eye_contact_over_time: List[int]
    feedback: str
    tips: List[str]


@router.post("/{session_id}/feedback", response_model=VideoFeedback)
async def get_video_feedback(session_id: str, metrics: VideoMetrics):
    """
    Analyze body language metrics and return feedback.
    If Anthropic API key is set, generates AI feedback.
    """
    import database as db

    history = metrics.eye_contact_history or []
    avg = metrics.avg_eye_contact or (sum(history) // len(history) if history else 0)

    # Determine posture from samples
    posture_samples = metrics.posture_samples or []
    if posture_samples:
        stable = sum(1 for p in posture_samples if p == "Stable")
        posture = "Stable" if stable / len(posture_samples) > 0.7 else "Inconsistent"
    else:
        posture = "Stable"

    energy = "High" if avg >= 70 else "Medium" if avg >= 50 else "Low"

    # Generate AI feedback if API key available
    feedback, tips = _generate_feedback(avg, posture, energy)

    # Save to session
    db.update_session(session_id, {
        "body_language": {
            "eye_contact_percent": avg,
            "posture": posture,
            "energy": energy,
            "eye_contact_over_time": history,
        }
    })

    return VideoFeedback(
        avg_eye_contact=avg,
        posture=posture,
        energy=energy,
        eye_contact_over_time=history,
        feedback=feedback,
        tips=tips,
    )


def _generate_feedback(avg_eye: int, posture: str, energy: str) -> tuple[str, list[str]]:
    """Generate body language feedback."""
    anthropic_key = os.getenv("ANTHROPIC_API_KEY", "")

    if anthropic_key:
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=anthropic_key)
            msg = client.messages.create(
                model="claude-haiku-4-5",
                max_tokens=300,
                messages=[{
                    "role": "user",
                    "content": (
                        f"Provide concise body language feedback for a technical interview. "
                        f"Metrics: eye contact={avg_eye}%, posture={posture}, energy={energy}. "
                        f"Give 1 sentence of overall feedback and 2-3 specific improvement tips. "
                        f"Return JSON: {{\"feedback\": \"...\", \"tips\": [\"...\", \"...\"]}}"
                    ),
                }],
            )
            import json
            data = json.loads(msg.content[0].text.strip())
            return data["feedback"], data["tips"]
        except Exception:
            pass

    # Scripted feedback
    if avg_eye >= 80:
        feedback = "Excellent eye contact throughout — you came across as confident and engaged."
        tips = ["Maintain this consistent eye contact in real interviews.", "Your posture and energy level were strong assets."]
    elif avg_eye >= 60:
        feedback = "Good eye contact overall with room to improve consistency in longer explanations."
        tips = [
            "Try to look at the camera more directly when explaining your thought process.",
            "Avoid looking down at your keyboard — speak through your solution instead.",
        ]
    else:
        feedback = "Eye contact was limited, which can signal lack of confidence to interviewers."
        tips = [
            "Position your camera at eye level and look into the lens, not at the video thumbnail.",
            "Practice speaking your solution aloud while maintaining camera eye contact.",
            "Improve lighting so your face is well-lit — dark environments reduce perceived engagement.",
        ]
    return feedback, tips
