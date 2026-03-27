from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from models.policy import Policy
from services.trigger_engine import evaluate_disrupted_zones
from pydantic import BaseModel

router = APIRouter(prefix="/triggers", tags=["Triggers (Admin/Sim)"])

class DisruptionSimulationRequest(BaseModel):
    zone: str

@router.post("/simulate")
def simulate_disruption_event(request: DisruptionSimulationRequest, db: Session = Depends(get_db)):
    """
    Simulate a weather or social disruption event.
    Forces the Parametric Engine to pull external data and check if any active policies 
    should automatically payout.
    """
    
    # Let's seed a mock policy into the database if none exist 
    # so the demo always works!
    existing = db.query(Policy).first()
    if not existing:
        mock_policy = Policy(
            user_id=1,
            weekly_premium=149.0,
            coverage_amount=2500.0,
            rain_trigger_active=True,
            aqi_trigger_active=True,
            zone_lockout_active=True,
            is_active=True
        )
        db.add(mock_policy)
        db.commit()

    result = evaluate_disrupted_zones(db, request.zone)
    return result
