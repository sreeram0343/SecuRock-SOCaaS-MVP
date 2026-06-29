# SecuRock Backend APIs

FastAPI application that powers the SecuRock Security Operations Center (SOC) platform.

## Setup & Running Locally
1. Establish virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate # or .\venv\Scripts\Activate.ps1 on Windows
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run migrations and database initialization:
   ```bash
   python init_db.py
   ```
4. Launch API server:
   ```bash
   uvicorn app.main:app --reload
   ```

## Unit Testing
The backend features an isolated unit test suite covering ML, RBAC, and Correlation services.
Run tests using:
```bash
python -m pytest
```
Configuration settings reside in `pytest.ini` and fixtures inside `tests/conftest.py`.
