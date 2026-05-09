from pydantic import BaseModel
from typing import Optional, List
from enum import Enum


class Difficulty(str, Enum):
    easy = "Easy"
    medium = "Medium"
    hard = "Hard"


class InterviewType(str, Enum):
    coding = "Coding"
    system_design = "System Design"
    behavioral = "Behavioral"


class Example(BaseModel):
    input: str
    output: str
    explanation: Optional[str] = None


class Problem(BaseModel):
    id: str
    title: str
    description: str
    difficulty: Difficulty
    tags: List[str]
    examples: List[Example]
    constraints: List[str]
    time_limit_minutes: int = 45


class CreateInterviewRequest(BaseModel):
    problem_id: Optional[str] = None
    difficulty: Optional[Difficulty] = Difficulty.medium
    interview_type: Optional[InterviewType] = InterviewType.coding


class InterviewSession(BaseModel):
    session_id: str
    problem: Problem
    time_limit_minutes: int = 45
    interview_type: InterviewType


class CodeSubmitRequest(BaseModel):
    code: str
    language: str = "python"


class TestResult(BaseModel):
    name: str
    status: str  # "pass" | "fail"
    execution_time: str
    expected: Optional[str] = None
    actual: Optional[str] = None
    error: Optional[str] = None


class CodeSubmitResponse(BaseModel):
    test_results: List[TestResult]
    all_passed: bool
    passed_count: int
    total_count: int


class HintRequest(BaseModel):
    code: Optional[str] = None
    question: Optional[str] = None


class HintResponse(BaseModel):
    hint: str


class EndInterviewRequest(BaseModel):
    code: Optional[str] = None
    transcript: Optional[List[dict]] = None
    duration_seconds: Optional[int] = None
