import random
from datetime import datetime

class DisruptionAPIClient:
    """
    Mock external APIs that simulate real-world disruption data.
    In Phase 2, this will hit OpenWeatherMap and OpenAQ, etc.
    """
    
    @staticmethod
    def fetch_current_mock_telemetry(zone: str):
        """
        Returns a mock telemetry state mimicking what we would see
        from real APIs for a given zone.
        """
        # Baseline normal conditions
        telemetry = {
            "zone": zone,
            "timestamp": datetime.utcnow().isoformat(),
            "rainfall_mm_3h": random.uniform(0, 5),    # normal rain
            "temperature_c": random.uniform(25, 33),   # normal temp
            "aqi": random.randint(50, 150),            # moderate aqi
            "zone_lockout": False                      # no curfew
        }

        # Deterministic mocks for specific zones to make the hackathon demo easy
        zone_lower = zone.lower()
        if any(k in zone_lower for k in ["delhi", "ncr", "gurgaon"]):
            telemetry["aqi"] = random.randint(310, 450) # Severe AQI
        
        if any(k in zone_lower for k in ["andheri", "mumbai", "chennai", "rain"]):
            telemetry["rainfall_mm_3h"] = random.uniform(40, 80) # Flash flood

        if any(k in zone_lower for k in ["dharavi", "lockout", "curfew", "tension"]):
            telemetry["zone_lockout"] = True # Simulated curfew

        return telemetry
