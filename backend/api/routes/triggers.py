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
    result = evaluate_disrupted_zones(db, request.zone)
    return result
