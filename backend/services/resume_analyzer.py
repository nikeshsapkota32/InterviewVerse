"""
Resume ATS (Applicant Tracking System) scoring service.
"""
import re
from typing import Dict, List, Any

TECH_KEYWORDS = {
    "languages": ["python", "javascript", "typescript", "java", "c++", "c#", "go", "rust", "swift", "kotlin", "ruby", "php", "scala"],
    "frameworks": ["react", "next.js", "vue", "angular", "django", "fastapi", "flask", "spring", "node.js", "express", "rails"],
    "databases": ["postgresql", "mysql", "mongodb", "redis", "elasticsearch", "dynamodb", "sqlite", "cassandra"],
    "cloud": ["aws", "gcp", "azure", "docker", "kubernetes", "terraform", "ci/cd", "devops"],
    "concepts": ["rest api", "graphql", "microservices", "distributed systems", "machine learning", "data structures", "algorithms", "system design"],
    "soft_skills": ["leadership", "communication", "collaboration", "problem-solving", "mentoring", "agile", "scrum"],
}

STRONG_ACTION_VERBS = [
    "developed", "built", "designed", "implemented", "optimized", "reduced", "improved",
    "led", "managed", "created", "architected", "deployed", "scaled", "increased",
    "automated", "migrated", "refactored", "launched",
]


def analyze_resume(text: str) -> Dict[str, Any]:
    """Analyze resume text and return ATS score with detailed breakdown."""
    text_lower = text.lower()

    keyword_results = _check_keywords(text_lower)
    format_results = _check_format(text)
    length_results = _check_length(text)
    impact_results = _check_impact(text_lower)

    # Weighted scoring
    keyword_score = keyword_results["score"]  # 40%
    format_score = format_results["score"]    # 25%
    length_score = length_results["score"]    # 15%
    impact_score = impact_results["score"]    # 20%

    total_score = int(
        keyword_score * 0.40
        + format_score * 0.25
        + length_score * 0.15
        + impact_score * 0.20
    )

    return {
        "ats_score": total_score,
        "breakdown": {
            "keywords": {"score": keyword_score, "details": keyword_results["details"]},
            "format": {"score": format_score, "details": format_results["details"]},
            "length": {"score": length_score, "details": length_results["details"]},
            "impact": {"score": impact_score, "details": impact_results["details"]},
        },
        "matched_keywords": keyword_results["matched"],
        "missing_keywords": keyword_results["missing"],
        "suggestions": _generate_suggestions(keyword_results, format_results, length_results, impact_results),
    }


def _check_keywords(text: str) -> Dict:
    matched = []
    missing = []
    total = 0

    for category, keywords in TECH_KEYWORDS.items():
        for kw in keywords:
            total += 1
            if kw in text:
                matched.append(kw)
            else:
                missing.append(kw)

    score = min(100, int((len(matched) / max(total, 1)) * 100 * 2.5))  # scaled

    return {
        "score": score,
        "matched": matched[:20],  # top 20
        "missing": missing[:10],  # top 10 missing
        "details": f"{len(matched)} relevant keywords found",
    }


def _check_format(text: str) -> Dict:
    score = 50  # baseline
    details = []

    # Check for standard sections
    sections = ["experience", "education", "skills", "projects", "summary", "objective"]
    found_sections = [s for s in sections if s in text.lower()]
    score += len(found_sections) * 8
    details.append(f"Found sections: {', '.join(found_sections)}")

    # Check for contact info indicators
    has_email = bool(re.search(r"\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b", text.lower()))
    has_phone = bool(re.search(r"\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b", text))
    if has_email:
        score += 5
        details.append("Email found")
    if has_phone:
        score += 5
        details.append("Phone number found")

    return {"score": min(100, score), "details": "; ".join(details)}


def _check_length(text: str) -> Dict:
    words = len(text.split())
    chars = len(text)

    if 400 <= words <= 800:
        score = 100
        detail = f"Good length ({words} words)"
    elif words < 400:
        score = max(40, int(words / 4))
        detail = f"Too short ({words} words, aim for 400-800)"
    else:
        score = max(60, 100 - int((words - 800) / 10))
        detail = f"Slightly long ({words} words)"

    return {"score": score, "details": detail}


def _check_impact(text: str) -> Dict:
    found_verbs = [v for v in STRONG_ACTION_VERBS if v in text]
    has_numbers = bool(re.search(r"\b\d+%|\d+x|\$\d+|\d+ (users|customers|services|requests)\b", text))

    score = min(100, len(found_verbs) * 8 + (30 if has_numbers else 0))
    details = f"{len(found_verbs)} strong action verbs; {'quantified impact found' if has_numbers else 'no quantified impact'}"

    return {"score": score, "details": details}


def _generate_suggestions(keyword_r, format_r, length_r, impact_r) -> List[str]:
    suggestions = []

    if keyword_r["score"] < 60:
        missing = keyword_r["missing"][:3]
        if missing:
            suggestions.append(f"Add missing keywords: {', '.join(missing)}")

    if format_r["score"] < 70:
        suggestions.append("Ensure your resume has clearly labeled sections: Experience, Education, Skills")

    if length_r["score"] < 70:
        suggestions.append("Expand your resume content — aim for 400-700 words for best ATS performance")

    if impact_r["score"] < 60:
        suggestions.append("Use strong action verbs (developed, led, optimized) and quantify your impact with numbers")

    if not suggestions:
        suggestions.append("Great resume! Consider tailoring keywords for each specific job posting.")

    return suggestions
