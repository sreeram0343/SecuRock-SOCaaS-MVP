@echo off
echo Starting SecuRock SOCaaS MVP...

:: Start Backend
start "SecuRock Backend" cmd /k "cd backend && (if exist venv\Scripts\activate.bat (call venv\Scripts\activate.bat) else (echo No venv found, using global python)) && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

:: Start Frontend
start "SecuRock Frontend" cmd /k "cd frontend && npm run dev"

echo Services started!
echo Backend: http://localhost:8000/docs
echo Frontend: http://localhost:5173
pause
