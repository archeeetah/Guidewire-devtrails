from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from models.policy import Policy
from models.telemetry_log import TelemetryScanLog
from services.trigger_engine import evaluate_disrupted_zones
from pydantic import BaseModel
import json

router = APIRouter(prefix="/triggers", tags=["Triggers (Admin/Sim)"])

class DisruptionSimulationRequest(BaseModel):
    zone: str

@router.post("/simulate")
def simulate_disruption_event(request: DisruptionSimulationRequest, db: Session = Depends(get_db)):
    """
    Simulate a weather or social disruption event.
    Forces the Parametric Engine to pull external data and check if any active policies 
    should automatically payout. Also logs the scan for audit purposes.
    """
    result = evaluate_disrupted_zones(db, request.zone)

    # Log this manual scan to the unified audit trail
    payouts_count = len(result.get("payouts", []))
    telemetry = result.get("telemetry", {})
    status = result.get("status", "success")

    log_entry = TelemetryScanLog(
        zone=request.zone,
        scan_type="manual",
        status="disrupted" if status == "disrupted" else "clear",
        triggers_fired=payouts_count,
        telemetry_snapshot=json.dumps(telemetry)
    )
    db.add(log_entry)
    db.commit()

    return result

