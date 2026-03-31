from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
import random
from datetime import datetime, timedelta

router = APIRouter(prefix="/monitoring", tags=["Operations Monitoring"])

# In-memory transient state for platform sync health
PLATFORM_NODES = {
    "zomato-india": {"status": "SYNCED", "latency": "14ms", "active_workers": 1240, "trigger_check_hz": 120},
    "amazon-logistics": {"status": "SYNCED", "latency": "42ms", "active_workers": 840, "trigger_check_hz": 60},
    "swiggy-fleet": {"status": "DEGRADED", "latency": "112ms", "active_workers": 910, "trigger_check_hz": 30},
}

SCANNER_STATE = {
    "is_running": True,
    "last_scan_at": datetime.now() - timedelta(minutes=2),
    "next_scan_at": datetime.now() + timedelta(minutes=5),
    "total_scans": 4210,
    "total_auto_payouts": 84,
}

@router.get("/status")
def get_system_health():
    """Returns the holistic health of the ShramShield ecosystem nodes."""
    return {
        "heartbeat": "HEALTHY",
        "timestamp": datetime.now().isoformat(),
        "scanner": SCANNER_STATE,
        "platform_sync": PLATFORM_NODES,
        "node_id": "CHENNAI-HUB-A1"
    }

@router.post("/toggle")
def toggle_scanner():
    """Toggles the autonomous parametric trigger scanner."""
    SCANNER_STATE["is_running"] = not SCANNER_STATE["is_running"]
    status_str = "ACTIVE" if SCANNER_STATE["is_running"] else "SUSPENDED"
    return {"message": f"Parametric Scanner {status_str}", "status": status_str}

@router.get("/logs")
def get_recent_audit_logs():
    """Returns the recent high-level audit trail for telemetry cross-checks."""
    zones = ["Chennai Central", "Adyar", "Tambaram", "Velachery", "T-Nagar"]
    types = ["RAIN_DISPLACEMENT", "AQI_CRITICAL", "HEATWAVE", "POLICY_RENEWAL"]
    
    logs = []
    for i in range(12):
        logs.append({
            "zone": random.choice(zones),
            "scan_type": random.choice(types),
            "status": "disrupted" if random.random() > 0.8 else "optimized",
            "scanned_at": (datetime.now() - timedelta(minutes=i*15)).isoformat()
        })
    return logs

@router.get("/verify-activity/{phone}")
def verify_platform_activity(phone: str):
    """
    MOCK: In production, checks partner platform APIs (Zomato/Swiggy) 
    to verify if the worker was actually 'On Duty' during an environmental trigger.
    """
    # Simulate a 92% chance that the worker was actually on duty
    is_active = random.random() < 0.92
    return {
        "worker_id": f"W-{phone[-4:]}",
        "is_active_session": is_active,
        "platform_confidence": 0.98 if is_active else 0.12,
        "last_ping_platform": (datetime.now() - timedelta(minutes=4)).isoformat()
    }
