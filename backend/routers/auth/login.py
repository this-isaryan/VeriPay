from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.auth import LoginRequest
from services.auth import authenticate_user
from conn_db import get_db

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, data.email, data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": "Login successful"}
