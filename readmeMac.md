# VeriPay - macOS Run Guide

## Backend (FastAPI)
```bash
cd /Users/meetsolanki/Void/study_material/c4990/veripay/backend
python3 -m venv ../venv
source ../venv/bin/activate
pip install -r ../requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Frontend (Next.js)
```bash
cd /Users/meetsolanki/Void/study_material/c4990/veripay/frontend
npm install
npm run dev -- --hostname 0.0.0.0 --port 3000
```

## AI/Analysis System Dependencies
```bash
brew install tesseract poppler
```

## Open in Browser
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
