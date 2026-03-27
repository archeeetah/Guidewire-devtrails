from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from core.database import get_db
from models.user import User
from models.policy import Policy
from schemas.schemas import PolicyQuoteRequest, PolicyQuoteResponse, PolicyPurchaseRequest, PolicyResponse
from services.ai_risk import calculate_risk_premium

router = APIRouter(prefix="/policies", tags=["Policies"])

@router.post("/quote", response_model=PolicyQuoteResponse)
def get_policy_quote(request: PolicyQuoteRequest):
    """
    Get a dynamic, AI-adjusted weekly premium quote 
    based on the worker's platform and primary operating zone.
    """
    quote_data = calculate_risk_premium(request.platform, request.primary_zone)
    return PolicyQuoteResponse(**quote_data)

@router.post("/purchase", response_model=PolicyResponse)
def purchase_policy(request: PolicyPurchaseRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    new_policy = Policy(
        user_id=request.user_id,
        weekly_premium=request.weekly_premium,
        coverage_amount=request.coverage_amount,
        rain_trigger_active=request.rain_trigger_active,
        aqi_trigger_active=request.aqi_trigger_active,
        zone_lockout_active=request.zone_lockout_active,
        expires_at=datetime.utcnow() + timedelta(days=7)
    )
    db.add(new_policy)
    db.commit()
    db.refresh(new_policy)
    return new_policy

@router.get("/worker/{phone_number}", response_model=list[PolicyResponse])
def get_worker_policies(phone_number: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone_number == phone_number).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    policies = db.query(Policy).filter(Policy.user_id == user.id, Policy.is_active == True).all()
    return policies
