"""
AI Recruiter service - generates contextual interview questions and feedback.
Uses Anthropic Claude if API key is set, otherwise falls back to scripted responses.
"""
import os
import random
from typing import List, Optional

try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")


SCRIPTED_QUESTIONS = {
    "two-sum": [
        "Take a moment to read the prompt. Let me know when you're ready.",
        "Can you walk me through your initial approach to this problem?",
        "What data structure are you thinking of using here?",
        "Can you talk me through the time and space complexity of your solution?",
        "Can you think of any edge cases we should consider?",
        "Great solution! Let's talk about how you would test this.",
    ],
    "valid-parentheses": [
        "Take a moment to read the prompt. Let me know when you're ready.",
        "What's your initial instinct for the data structure to use here?",
        "Can you explain why a stack is particularly useful for this problem?",
        "What edge cases do you think we need to handle?",
        "How does your solution handle an empty string?",
    ],
    "default": [
        "Take a moment to read the prompt. Let me know when you're ready.",
        "Can you start by describing your approach at a high level?",
        "What data structures or algorithms come to mind for this problem?",
        "Can you analyze the time and space complexity of your approach?",
        "Are there any edge cases we should be careful about?",
        "How would you test this solution?",
    ],
}

HINT_TEMPLATES = {
    "two-sum": [
        "Think about what information you need to look up for each element as you iterate.",
        "Consider using a hash map to store elements you've already seen. For each new element, what are you checking?",
        "For each number `x`, you want to know: is there a previous number `y` such that `x + y = target`? How can you check this in O(1)?",
    ],
    "valid-parentheses": [
        "Think about what you need to 'remember' as you scan through the string.",
        "When you see a closing bracket, what do you need to compare it against?",
        "A stack (LIFO) is perfect here - when you see a closing bracket, you need the most recent opening bracket.",
    ],
    "default": [
        "Try to break the problem into smaller sub-problems.",
        "Think about what information you need at each step.",
        "Consider the brute-force solution first, then look for optimizations.",
    ],
}


def get_opening_message(problem_id: str) -> str:
    questions = SCRIPTED_QUESTIONS.get(problem_id, SCRIPTED_QUESTIONS["default"])
    return questions[0]


def get_followup_question(problem_id: str, question_index: int, transcript: List[dict] = None) -> str:
    """Get the next question to ask the candidate."""
    questions = SCRIPTED_QUESTIONS.get(problem_id, SCRIPTED_QUESTIONS["default"])

    if ANTHROPIC_AVAILABLE and ANTHROPIC_API_KEY:
        return _get_ai_followup(problem_id, transcript or [])

    if question_index < len(questions):
        return questions[question_index]
    return "Is there anything else you'd like to add or clarify about your solution?"


def get_hint(problem_id: str, code: Optional[str] = None, question: Optional[str] = None) -> str:
    """Generate a contextual hint for the current problem."""
    hints = HINT_TEMPLATES.get(problem_id, HINT_TEMPLATES["default"])

    if ANTHROPIC_AVAILABLE and ANTHROPIC_API_KEY and (code or question):
        return _get_ai_hint(problem_id, code, question)

    return random.choice(hints)


def generate_feedback(
    problem_id: str,
    score: int,
    code: Optional[str] = None,
    transcript: Optional[List[dict]] = None,
) -> dict:
    """Generate AI feedback for the interview session."""
    if ANTHROPIC_AVAILABLE and ANTHROPIC_API_KEY:
        return _get_ai_feedback(problem_id, score, code, transcript)
    return _get_scripted_feedback(score)


def _get_scripted_feedback(score: int) -> dict:
    if score >= 85:
        strengths = [
            "Walked through brute force before optimizing — strong problem-solving discipline.",
            "Explained time and space complexity unprompted.",
            "Tested with a custom edge case before submitting.",
        ]
        improvements = [
            "Ask clarifying questions about input constraints earlier.",
            "Consider discussing alternative approaches before committing.",
        ]
    elif score >= 70:
        strengths = [
            "Demonstrated understanding of the core algorithm.",
            "Communicated your thought process clearly.",
        ]
        improvements = [
            "Wait until you've read the full prompt before starting to code.",
            "Ask clarifying questions about input constraints earlier.",
            "Slow down slightly during the explanation phase.",
        ]
    else:
        strengths = [
            "Attempted the problem and communicated your approach.",
        ]
        improvements = [
            "Practice breaking down problems before coding.",
            "Focus on understanding the constraints before choosing a data structure.",
            "Consider time and space complexity throughout your solution.",
        ]
    return {"strengths": strengths, "improvements": improvements}


def _get_ai_followup(problem_id: str, transcript: List[dict]) -> str:
    try:
        client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        transcript_text = "\n".join(
            f"{'Interviewer' if m.get('who') == 'ai' else 'Candidate'}: {m.get('text', '')}"
            for m in transcript[-6:]
        )
        message = client.messages.create(
            model="claude-haiku-4-5",
            max_tokens=150,
            messages=[{
                "role": "user",
                "content": (
                    f"You are a senior software engineer conducting a technical interview. "
                    f"The candidate is solving the '{problem_id}' problem. "
                    f"Based on this conversation:\n{transcript_text}\n\n"
                    f"Ask a single, concise follow-up question (1-2 sentences max). "
                    f"Be professional and encouraging."
                ),
            }],
        )
        return message.content[0].text.strip()
    except Exception:
        questions = SCRIPTED_QUESTIONS.get(problem_id, SCRIPTED_QUESTIONS["default"])
        return random.choice(questions[1:])


def _get_ai_hint(problem_id: str, code: Optional[str], question: Optional[str]) -> str:
    try:
        client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        context = f"Code so far:\n```python\n{code}\n```" if code else ""
        user_q = f"Candidate's question: {question}" if question else ""
        message = client.messages.create(
            model="claude-haiku-4-5",
            max_tokens=200,
            messages=[{
                "role": "user",
                "content": (
                    f"You are helping a candidate with the '{problem_id}' coding problem. "
                    f"{context}\n{user_q}\n\n"
                    f"Give a single helpful hint (2-3 sentences max) without giving away the solution. "
                    f"Be specific and pedagogical."
                ),
            }],
        )
        return message.content[0].text.strip()
    except Exception:
        hints = HINT_TEMPLATES.get(problem_id, HINT_TEMPLATES["default"])
        return random.choice(hints)


def _get_ai_feedback(
    problem_id: str,
    score: int,
    code: Optional[str],
    transcript: Optional[List[dict]],
) -> dict:
    try:
        client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        code_section = f"Final code:\n```python\n{code}\n```\n" if code else ""
        transcript_text = ""
        if transcript:
            lines = [
                f"{'Interviewer' if m.get('who') == 'ai' else 'Candidate'}: {m.get('text', '')}"
                for m in transcript
            ]
            transcript_text = "Transcript:\n" + "\n".join(lines)

        message = client.messages.create(
            model="claude-haiku-4-5",
            max_tokens=500,
            messages=[{
                "role": "user",
                "content": (
                    f"You are evaluating a technical interview for the '{problem_id}' problem. "
                    f"The candidate scored {score}/100.\n"
                    f"{code_section}{transcript_text}\n\n"
                    f"Provide feedback in JSON format with two keys: "
                    f"'strengths' (list of 2-3 positive observations) and "
                    f"'improvements' (list of 2-3 actionable improvements). "
                    f"Each item should be 1-2 sentences. Return only valid JSON."
                ),
            }],
        )
        import json
        text = message.content[0].text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text.strip())
    except Exception:
        return _get_scripted_feedback(score)
