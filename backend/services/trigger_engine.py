from models.user import User
from models.telemetry_data import TelemetryData
from services.external_api import DisruptionAPIClient
from services.payment_gateway import RazorpayXClient
from services.mobility_intelligence import MobilityIntelligence
from typing import List
import logging

logger = logging.getLogger("shramshield.engine")

def evaluate_disrupted_zones(db: Session, zone: str) -> List[dict]:
    """
    The Core Parametric Trigger Engine (v3):
    1. Checks external conditions (Weather/AQI).
    2. Identifies active policies in the zone.
    3. FOR EACH POLICY:
       - Fetches high-frequency telemetry (IMU/GPS).
       - Runs Zero-Trust mobility analysis (Anti-Spoofing).
       - Executes automated Payout only if Confidence Score > 0.7.
    """
    telemetry = DisruptionAPIClient.fetch_current_telemetry(zone)
    payout_events = []

    # Threshold Rules
    rules_met = {
        "rain_trigger_met": telemetry["rainfall_mm_3h"] > 30.0,
        "aqi_trigger_met": telemetry["aqi"] > 300,
        "zone_lockout_met": telemetry["zone_lockout"] is True
    }

    # If NO thresholds are crossed in this zone, return early
    if not any(rules_met.values()):
        return {"status": "success", "message": "No disruption thresholds met.", "telemetry": telemetry, "payouts": []}

    # Query active policies for this zone, joining user to get UPI info
    active_policies = db.query(Policy, User).join(User, Policy.user_id == User.id).filter(Policy.is_active == True).all()

    for policy_record in active_policies:
        policy = policy_record[0]
        user = policy_record[1]
        
        triggered = False
        reason = ""
        trigger_type = ""
        
        if policy.rain_trigger_active and rules_met["rain_trigger_met"]:
            triggered = True
            trigger_type = "Heavy Rainfall"
            reason = f"Rainfall reached {telemetry['rainfall_mm_3h']:.1f}mm (>30mm)"
            
        elif policy.aqi_trigger_active and rules_met["aqi_trigger_met"]:
            triggered = True
            trigger_type = "Severe Pollution"
            reason = f"AQI reached {telemetry['aqi']} (>300)"
            
        elif policy.zone_lockout_active and rules_met["zone_lockout_met"]:
            triggered = True
            trigger_type = "Zone Lockout"
            reason = "Zone Lockout / Curfew Declared"

        if triggered:
            # 1. RUN ZERO-TRUST MOBILITY ANALYSIS (Anti-Spoofing)
            # Pull latest 10 telemetry points for this user for intelligence analyze
            latest_telemetry = (
                db.query(TelemetryData)
                .filter(TelemetryData.user_id == user.id)
                .order_by(TelemetryData.timestamp.desc())
                .limit(10)
                .all()
            )
            
            # Format logs for Intelligence Engine
            telemetry_batch = [
                {"lat": t.lat, "lon": t.lon, "accel_x": t.accel_x, "altitude": t.altitude} 
                for t in latest_telemetry
            ]
            
            # Run Intelligence Verification
            mobility_data = MobilityIntelligence.calculate_confidence_score(telemetry_batch)
            conf_score = mobility_data["score"]
            m_status = mobility_data["status"]
            
            # 2. INITIATE PAYMENT only if Mobility Intelligence approves (Trust > 0.7)
            # This protects the liquidity pool from coordinated fraud rings.
            p_status = "FRAUD_FLAGGED"
            p_tx_id = None
            
            if conf_score > 0.7:
                payment_res = RazorpayXClient.initiate_payout(user.name, user.upi_id, policy.coverage_amount, trigger_type)
                p_status = payment_res.get("status", "FAILED")
                p_tx_id = payment_res.get("id")
            else:
                logger.warning(f"FRAUD PREVENTION: Halted payout for {user.name} (Confidence: {conf_score}). Patterns: {mobility_data['signals']}")

            # 3. RECORD the Payout in the DB with full audit trail
            new_payout = Payout(
                policy_id=policy.id,
                user_id=policy.user_id,
                amount=policy.coverage_amount,
                trigger_type=trigger_type,
                trigger_reason=reason,
                payout_status=p_status,
                transaction_id=p_tx_id,
                confidence_score=conf_score
            )
            db.add(new_payout)
            
            # 4. Deactivate the policy only for high-trust successful outcomes
            if p_status in ["SETTLED", "PROCESSING"]:
                policy.is_active = False 
            
            payout_events.append({
                "policy_id": policy.id,
                "user_name": user.name,
                "payout_amount": policy.coverage_amount,
                "confidence_score": conf_score,
                "status": p_status,
                "transaction_id": p_tx_id
            })

    db.commit()

    return {
        "status": "disrupted",
        "message": f"Disruption thresholds breached in {zone}. Processed {len(payout_events)} parametric claims.",
        "telemetry": telemetry,
        "payouts": payout_events
    }

