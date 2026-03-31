from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from models.telemetry_log import TelemetryScanLog
from services.scheduler import get_scheduler_status, start_scheduler, stop_scheduler
from services.ai_optimizer import AIEarningsOptimizer

router = APIRouter(prefix="/monitoring", tags=["Autonomous Monitoring"])

@router.get("/recommendations")
def get_ai_recommendations(lat: float = None, lon: float = None):
    """
    Returns AI-curated 'Earnings Stability Index' (ESI) for nearby zones.
    Guides workers to position themselves for maximum parametric protection.
    """
    recs = AIEarningsOptimizer.get_zone_recommendations(lat, lon)
    return {
        "status": "success",
        "timestamp": 1234567890, # mock
        "recommendations": recs,
        "market_analysis": AIEarningsOptimizer.get_market_analysis()
    }


@router.get("/status")
def get_scanner_status():
    """
    Returns the current state of the autonomous telemetry scanner.
    Used by the admin dashboard to show live scheduler health.
    """
    status = get_scheduler_status()
    return {
        "scanner": status,
        "config": {
            "interval_minutes": 15,
            "engine": "APScheduler BackgroundScheduler",
            "mode": "autonomous_parametric"
        }
    }


@router.get("/logs")
def get_scan_logs(limit: int = 50, db: Session = Depends(get_db)):
    """
    Returns the most recent telemetry scan logs for the admin audit trail.
    Includes both automated and manual scan entries.
    """
    logs = (
        db.query(TelemetryScanLog)
        .order_by(TelemetryScanLog.scanned_at.desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "id": log.id,
            "zone": log.zone,
            "scan_type": log.scan_type,
            "status": log.status,
            "triggers_fired": log.triggers_fired,
            "telemetry_snapshot": log.telemetry_snapshot,
            "scanned_at": log.scanned_at.isoformat() if log.scanned_at else None
        }
        for log in logs
    ]


@router.post("/toggle")
def toggle_scanner(action: str = "toggle"):
    """
    Start, stop, or toggle the autonomous scanner.
    Query param `action` can be: 'start', 'stop', or 'toggle' (default).
    """
    status = get_scheduler_status()

    if action == "start":
        start_scheduler()
        return {"message": "Scanner started.", "is_running": True}
    elif action == "stop":
        stop_scheduler()
        return {"message": "Scanner stopped.", "is_running": False}
    else:
        # Toggle
        if status["is_running"]:
            stop_scheduler()
            return {"message": "Scanner stopped.", "is_running": False}
        else:
            start_scheduler()
            return {"message": "Scanner started.", "is_running": True}
