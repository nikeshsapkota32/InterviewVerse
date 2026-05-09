from pydantic import BaseModel
from typing import List, Optional


class SkillScore(BaseModel):
    label: str
    score: int
    change: int = 0


class KeyMoment(BaseModel):
    time: str
    tone: str  # "good" | "neutral" | "warn"
    text: str


class SpeechAnalytics(BaseModel):
    pace_wpm: int
    filler_words: int
    clarity_percent: int
    pace_over_time: List[int]


class BodyLanguageAnalytics(BaseModel):
    eye_contact_percent: int
    posture: str
    energy: str
    eye_contact_over_time: List[int]


class TranscriptMessage(BaseModel):
    time: str
    who: str  # "ai" | "user"
    text: str


class Recommendation(BaseModel):
    title: str
    description: str
    duration: str
    level: str
    icon: str


class InterviewResult(BaseModel):
    session_id: str
    score: int
    rating: str  # "Strong hire" | "Hire" | "Maybe" | "No hire"
    problem_title: str
    problem_type: str
    duration: str
    questions_count: int
    tests_passed: str
    percentile: str
    summary: str
    skill_breakdown: List[SkillScore]
    strengths: List[str]
    improvements: List[str]
    key_moments: List[KeyMoment]
    speech: SpeechAnalytics
    body_language: BodyLanguageAnalytics
    transcript: List[TranscriptMessage]
    recommendations: List[Recommendation]
