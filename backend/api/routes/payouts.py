from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from models.payout import Payout
from models.user import User
from schemas.schemas import PayoutResponse

router = APIRouter(prefix="/payouts", tags=["Payouts"])

@router.get("/", response_model=List[PayoutResponse])
def get_all_payouts(db: Session = Depends(get_db)):
    """
    Fetch the global audit log of all automated payouts.
    """
    return db.query(Payout).order_by(Payout.processed_at.desc()).limit(50).all()

@router.get("/worker/{phone}", response_model=List[PayoutResponse])
def get_worker_payouts(phone: str, db: Session = Depends(get_db)):
    """
    Fetch payout history for a specific gig worker by phone number.
    """
    user = db.query(User).filter(User.phone_number == phone).first()
    if not user:
        raise HTTPException(status_code=404, detail="Worker not found")
        
    return db.query(Payout).filter(Payout.user_id == user.id).order_by(Payout.processed_at.desc()).all()
