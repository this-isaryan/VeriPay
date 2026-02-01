from sqlalchemy.orm import Session
from models.user import User
from utils.security import hash_password

def register_user(db: Session, email: str, password: str, full_name: str):
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        return None

    user = User(
        email=email,
        full_name=full_name,
        hashed_password=hash_password(password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user