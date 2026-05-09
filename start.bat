@echo off
echo Starting InterviewVerse...
echo.
echo [1/2] Starting FastAPI backend on http://localhost:8080
start "InterviewVerse Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --host 0.0.0.0 --port 8080 --reload"

echo [2/2] Starting Next.js frontend on http://localhost:3000
start "InterviewVerse Frontend" cmd /k "cd /d %~dp0frontend\interviewverse && npm run dev"

echo.
echo Both servers started!
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8080
echo   API Docs: http://localhost:8080/docs
echo.
