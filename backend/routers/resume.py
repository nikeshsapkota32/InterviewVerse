from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from typing import Optional
from services.resume_analyzer import analyze_resume

router = APIRouter(prefix="/api/resume", tags=["resume"])


@router.post("/analyze")
async def analyze_resume_endpoint(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None),
):
    """
    Analyze a resume and return ATS score with detailed feedback.
    Accepts either a file upload or raw text.
    """
    resume_text = ""

    if file:
        content = await file.read()
        try:
            resume_text = content.decode("utf-8")
        except UnicodeDecodeError:
            # Try latin-1 as fallback
            try:
                resume_text = content.decode("latin-1")
            except Exception:
                raise HTTPException(
                    status_code=400,
                    detail="Could not decode file. Please upload a plain text (.txt) resume or paste the text directly.",
                )

    elif text:
        resume_text = text

    else:
        raise HTTPException(
            status_code=400,
            detail="Please provide either a file or text content.",
        )

    if len(resume_text.strip()) < 50:
        raise HTTPException(
            status_code=400,
            detail="Resume text is too short. Please provide a complete resume.",
        )

    result = analyze_resume(resume_text)
    return result
