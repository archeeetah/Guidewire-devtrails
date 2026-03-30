from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from core.database import get_db
from core.security import limiter
from models.user import User
from schemas.schemas import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/register", response_model=UserResponse)
@limiter.limit("5/minute")
def register_user(request: Request, user_registration: UserCreate, db: Session = Depends(get_db)):
    """
    Onboard a new gig worker.
    Saves their Phone, Name, Platform, and Primary Zone for dynamic risk assessment.
    """
    # Check if user already exists
    db_user = db.query(User).filter(User.phone_number == user_registration.phone_number).first()
    if db_user:
        # In a real app we'd just log them in, but for demo we can update or notify
        raise HTTPException(status_code=400, detail="Phone number already registered")
        
    new_user = User(
        name=user_registration.name,
        phone_number=user_registration.phone_number,
        platform=user_registration.platform,
        platform_worker_id=user_registration.platform_worker_id,
        primary_zone=user_registration.primary_zone,
        upi_id=user_registration.upi_id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/{phone_number}", response_model=UserResponse)
@limiter.limit("20/minute")
def get_user_by_phone(request: Request, phone_number: str, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.phone_number == phone_number).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
