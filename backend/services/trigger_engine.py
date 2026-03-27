from sqlalchemy.orm import Session
from models.policy import Policy
from services.external_api import DisruptionAPIClient
from typing import List

def evaluate_disrupted_zones(db: Session, zone: str) -> List[dict]:
    """
    The Core Parametric Trigger Engine:
    Checks external conditions for a zone and evaluates if currently active policies 
    should automatically payout due to thresholds being crossed.
    """
    telemetry = DisruptionAPIClient.fetch_current_mock_telemetry(zone)
    payout_events = []

    # Simple Trigger Rules for MVP
    rules_met = {
        "rain_trigger_met": telemetry["rainfall_mm_3h"] > 30.0,
        "aqi_trigger_met": telemetry["aqi"] > 300,
        "zone_lockout_met": telemetry["zone_lockout"] is True
    }

    # If NO thresholds are crossed in this zone, return early
    if not any(rules_met.values()):
        return {"status": "success", "message": "No disruption thresholds met.", "telemetry": telemetry, "payouts": []}

    # In a real app, we'd query: db.query(Policy).filter(Policy.zone == zone, Policy.is_active == True).all()
    # For Phase 1 prototype, we'll assume any active policy tracking these triggers might be affected
    active_policies = db.query(Policy).filter(Policy.is_active == True).all()

    for policy in active_policies:
        triggered = False
        reason = ""
        
        if policy.rain_trigger_active and rules_met["rain_trigger_met"]:
            triggered = True
            reason = f"Rainfall reached {telemetry['rainfall_mm_3h']:.1f}mm (>30mm)"
            
        elif policy.aqi_trigger_active and rules_met["aqi_trigger_met"]:
            triggered = True
            reason = f"AQI reached {telemetry['aqi']} (>300)"
            
        elif policy.zone_lockout_active and rules_met["zone_lockout_met"]:
            triggered = True
            reason = "Zone Lockout / Curfew Declared"

        if triggered:
            # Simulate processing of payout
            # policy.is_active = False # Mark as claimed
            # db.commit() # Save state
            
            payout_events.append({
                "policy_id": policy.id,
                "user_id": policy.user_id,
                "payout_amount": policy.coverage_amount,
                "trigger_reason": reason
            })

    return {
        "status": "disrupted",
        "message": f"Disruption thresholds breached in {zone}. Processed {len(payout_events)} parametric payouts.",
        "telemetry": telemetry,
        "payouts": payout_events
    }
