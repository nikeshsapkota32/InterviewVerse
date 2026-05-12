"""
WebSocket router for real-time interview communication.
Handles AI recruiter messages, transcript updates, and session events.
"""
import json
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import database as db
from services.ai_recruiter import get_followup_question, get_opening_message

router = APIRouter(tags=["websocket"])

# Active connections: session_id -> WebSocket
active_connections: dict[str, WebSocket] = {}


@router.websocket("/ws/{session_id}")
async def interview_websocket(websocket: WebSocket, session_id: str):
    """
    WebSocket endpoint for real-time interview communication.

    Messages from client:
      { "type": "transcript", "text": "...", "who": "user" }
      { "type": "ping" }
      { "type": "end" }

    Messages to client:
      { "type": "ai_message", "text": "...", "who": "ai" }
      { "type": "transcript_update", "transcript": [...] }
      { "type": "pong" }
      { "type": "error", "message": "..." }
    """
    await websocket.accept()
    active_connections[session_id] = websocket

    session = db.get_session(session_id)
    if not session:
        await websocket.send_json({"type": "error", "message": "Session not found"})
        await websocket.close()
        return

    problem_id = session["problem_id"]

    # Track transcript and question_index locally to avoid stale DB reads
    transcript: list = list(session.get("transcript", []))
    question_index: int = session.get("question_index", 0)

    # Send opening message from AI recruiter
    opening = get_opening_message(problem_id)
    await websocket.send_json({
        "type": "ai_message",
        "text": opening,
        "who": "ai",
    })

    transcript.append({"time": _format_time(0), "who": "ai", "text": opening})
    db.update_session(session_id, {"transcript": transcript})

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            msg_type = message.get("type")

            if msg_type == "ping":
                await websocket.send_json({"type": "pong"})

            elif msg_type == "transcript":
                user_text = message.get("text", "").strip()
                elapsed = message.get("elapsed_seconds", 0)

                if user_text:
                    transcript.append({"time": _format_time(elapsed), "who": "user", "text": user_text})
                    db.update_session(session_id, {"transcript": transcript})

                    # Brief thinking pause
                    await asyncio.sleep(0.5)

                    ai_response = get_followup_question(problem_id, question_index, transcript)
                    question_index += 1

                    transcript.append({"time": _format_time(elapsed + 2), "who": "ai", "text": ai_response})
                    db.update_session(session_id, {
                        "transcript": transcript,
                        "question_index": question_index,
                    })

                    await websocket.send_json({
                        "type": "ai_message",
                        "text": ai_response,
                        "who": "ai",
                    })

                    await websocket.send_json({
                        "type": "transcript_update",
                        "transcript": transcript,
                    })

            elif msg_type == "end":
                await websocket.send_json({"type": "session_ended"})
                break

    except WebSocketDisconnect:
        pass
    except Exception as e:
        try:
            await websocket.send_json({"type": "error", "message": str(e)})
        except Exception:
            pass
    finally:
        active_connections.pop(session_id, None)


def _format_time(seconds: int) -> str:
    m = seconds // 60
    s = seconds % 60
    return f"{m:02d}:{s:02d}"
