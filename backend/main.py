"""
InterviewVerse FastAPI Backend
Run with: uvicorn main:app --reload --port 8000
"""
import traceback
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routers import auth, dashboard, interviews, results, resume, ws

app = FastAPI(
    title="InterviewVerse API",
    description="AI-powered interview practice platform backend",
    version="1.0.0",
)

# CORS — allow Next.js dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(interviews.router)
app.include_router(results.router)
app.include_router(resume.router)
app.include_router(ws.router)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    tb = traceback.format_exc()
    print("UNHANDLED EXCEPTION:", tb)
    return JSONResponse(status_code=500, content={"detail": str(exc), "traceback": tb})


@app.get("/")
async def root():
    return {"message": "InterviewVerse API is running", "docs": "/docs"}


@app.get("/health")
async def health():
    return {"status": "ok"}
