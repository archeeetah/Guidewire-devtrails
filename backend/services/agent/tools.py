from typing import Dict, List, Optional
from services.external_api import DisruptionAPIClient
from services.ai_risk import calculate_risk_premium, generate_zone_forecast
from services.ai_optimizer import AIEarningsOptimizer
from services.trigger_engine import evaluate_disrupted_zones
from core.database import SessionLocal
from models.user import User
from models.policy import Policy
from models.payout import Payout
from datetime import datetime

class AOLTools:
    """
    ShramShield AOL: Tool Repository for Agentic Operations.
    These functions are exposed to the Gemini Brain to execute real-world actions.
    """

    @staticmethod
    def get_live_risk_assessment(zone_name: str) -> Dict:
        """
        Fetches hyper-local disruption data (Rainfall, AQI, Zone Status) for a specific zone.
        Use this to determine if a worker is at risk or if a payout trigger is imminent.
        """
        try:
            telemetry = DisruptionAPIClient.fetch_current_telemetry(zone_name)
            forecast = generate_zone_forecast(zone_name)
            return {
                "zone_telemetry": telemetry,
                "ai_forecast": forecast,
                "safety_thresholds": {
                    "rain_limit": 30.0,
                    "aqi_limit": 300,
                    "status": "DANGER" if telemetry["rainfall_mm_3h"] > 30.0 or telemetry["aqi"] > 300 else "STABLE"
                }
            }
        except Exception as e:
            return {"error": f"Failed to fetch risk data: {str(e)}"}

    @staticmethod
    def investigate_payout_status(phone_number: str) -> Dict:
        """
        Checks the status of any recent payouts or active triggers for a worker's phone number.
        Use this when a worker asks 'Where is my money?' or 'Has my payout triggered?'.
        """
        db = SessionLocal()
        try:
            user = db.query(User).filter(User.phone_number == phone_number).first()
            if not user:
                return {"error": "Worker not found in ShramShield database."}

            latest_payout = db.query(Payout).filter(Payout.user_id == user.id).order_by(Payout.processed_at.desc()).first()
            active_policy = db.query(Policy).filter(Policy.user_id == user.id, Policy.is_active == True).first()

            return {
                "worker_name": user.name,
                "active_policy": {
                    "id": active_policy.id,
                    "coverage": active_policy.coverage_amount,
                    "is_active": True
                } if active_policy else None,
                "latest_payout": {
                    "amount": latest_payout.amount,
                    "status": latest_payout.payout_status,
                    "reason": latest_payout.trigger_reason,
                    "timestamp": latest_payout.processed_at.isoformat()
                } if latest_payout else None
            }
        finally:
            db.close()

    @staticmethod
    def calculate_premium_quote(platform: str, zone: str) -> Dict:
        """
        Generates a dynamic premium quote for a new weekly policy based on zone risk history.
        Use this when a worker asks for pricing or wants to start a plan.
        """
        return calculate_risk_premium(platform, zone)

    @staticmethod
    def get_proactive_safety_plan(lat: float, lon: float) -> List[Dict]:
        """
        Generates optimal zone recommendations based on upcoming disruption forecasts.
        Use this to suggest 'Safe Zones' or 'High Demand Zones' to workers.
        """
        return AIEarningsOptimizer.get_zone_recommendations(lat, lon)

    @staticmethod
    def run_autonomous_claim_verification(zone: str) -> Dict:
        """
        Manually triggers the Parametric Engine to evaluate claims in a zone.
        Use this when investigating a potential large-scale disruption event.
        """
        db = SessionLocal()
        try:
            result = evaluate_disrupted_zones(db, zone)
            return result
        finally:
            db.close()
