import random
import logging
from typing import List, Dict

logger = logging.getLogger("shramshield.optimizer")

class AIEarningsOptimizer:
    """
    ShramShield AI Earnings Stabilizer.
    Analyzes weather forecasts and disruption probabilities to suggest
    optimal 'Protection Zones' for gig workers.
    """

    @staticmethod
    def get_zone_recommendations(current_lat: float = None, current_lon: float = None) -> List[Dict]:
        """
        Calculates the Earnings Stability Index (ESI) for top zones.
        In production, this would hit a GFS/ECMWF weather trajectory API.
        """
        # Mock Zones for Demo
        zones = [
            {"name": "Potheri, TN", "lat": 12.8231, "lon": 80.0440},
            {"name": "Guduvanchery, TN", "lat": 12.8465, "lon": 80.0594},
            {"name": "Tambaram, TN", "lat": 12.9229, "lon": 80.1275},
            {"name": "Chennai City, TN", "lat": 13.0827, "lon": 80.2707},
        ]

        recommendations = []
        
        for zone in zones:
            # Simulate a 12h forecast trajectory trend
            # random.seed ensures some predictability for the demo but feels 'live'
            probability_of_disruption = random.uniform(0.1, 0.9)
            
            # Earnings Stability Index (ESI)
            # High ESI = High protection density = Better for stability
            esi_score = int(probability_of_disruption * 100)
            
            # Recommendation Logic
            action = "STABLE"
            if esi_score > 75:
                action = "CRITICAL_PROTECTION" # Storm front approach
            elif esi_score > 40:
                action = "HIGH_POTENTIAL"
            elif esi_score > 15:
                action = "MONITOR"

            recommendations.append({
                "zone_name": zone["name"],
                "lat": zone["lat"],
                "lon": zone["lon"],
                "esi_score": esi_score,
                "action": action,
                "threat_type": random.choice(["Heavy Rainfall", "Severe Pollution", "Coastal Storm"]),
                "eta_m": random.randint(15, 120),
                "protection_density": "HIGH" if esi_score > 60 else "LOW"
            })

        # Sort by ESI score (highest protection opportunity first)
        return sorted(recommendations, key=lambda x: x["esi_score"], reverse=True)

    @staticmethod
    def get_market_analysis() -> Dict:
        """Overview for admin dashboard to monitor worker distribution vs risk."""
        return {
            "total_at_risk_workers": random.randint(200, 1500),
            "protected_liquidity_v_forecast": 0.85, # 85% coverage for incoming risk
            "system_health": "OPTIMIZED"
        }
