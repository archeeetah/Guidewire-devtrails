import logging
from typing import List, Dict
from datetime import datetime

logger = logging.getLogger("shramshield.intelligence")

class MobilityIntelligence:
    """
    ShramShield Mobility Intelligence Service.
    Analyzes trajectory physics and IMU sensor noise to distinguish genuine
    delivery partners from GPS-spoofing emulators.
    """

    @staticmethod
    def calculate_confidence_score(telemetry_batch: List[Dict]) -> Dict:
        """
        Heuristic-based Confidence Engine.
        Evaluates signals from the latest telemetry burst to determine claim validity.
        """
        if not telemetry_batch:
            return {"score": 0.0, "reason": "No telemetry data collected."}

        is_spoof = False
        points = len(telemetry_batch)
        suspicious_signals = []
        
        # EDGE CASE: Signal Padding
        # If total telemetry points in this disruption window are < 5,
        # we do not have enough drift/variance to confirm trust or fraud.
        if points < 5:
            return {
                "score": 0.50, # Neutral baseline
                "status": "PENDING_TELEMETRY", 
                "signals": ["Insufficient trajectory density for parametric cross-check"],
                "sample_points": points
            }
        
        # 1. IMU SENSOR NOISE CHECK (Anti-Emulator)
        # Real devices have constant micro-variations (thermal noise + bike idle).
        # Spoofing emulators often have perfectly constant (0.00) or uniform accel data.
        accel_variations = set()
        for t in telemetry_batch:
            accel_variations.add(t.get("accel_x", 0.0))
        
        if len(accel_variations) < (points / 2) and points > 5:
            is_spoof = True
            suspicious_signals.append("IMU silence detected (Emulator pattern)")

        # 2. VELOCITY DEGRADATION CHECK (Anti-Teleportation)
        # Genuine worker movement displays organic physics.
        # We check for unrealistic jumps between coordinates.
        if points >= 2:
            prev = telemetry_batch[0]
            for curr in telemetry_batch[1:]:
                dist = MobilityIntelligence._calculate_dist(prev["lat"], prev["lon"], curr["lat"], curr["lon"])
                if dist > 500: # 500m jump between points (Teleportation)
                    is_spoof = True
                    suspicious_signals.append("Non-kinetic spatial teleportation detected")
                    break
                prev = curr

        # 3. Z-AXIS ALTITUDE CONSISTENCY
        # Fraud rings often ignore elevation changes typical of urban roads.
        altitudes = [t.get("altitude") for t in telemetry_batch if t.get("altitude") is not None]
        if altitudes and len(set(altitudes)) == 1 and points > 10:
             # Statistically improbable for a moving device to have 0 altitude change
             suspicious_signals.append("Anomalous static elevation vector")

        # Decision Logic
        if is_spoof:
            confidence = 0.15 # Low confidence
        elif suspicious_signals:
            confidence = 0.55 # Suspicious
        else:
            confidence = 0.95 # High trust

        logger.info(f"Mobility Confidence: {confidence} | Signals: {suspicious_signals}")

        return {
            "score": round(confidence, 2),
            "status": "APPROVED" if confidence > 0.8 else ("SUSPICIOUS" if confidence > 0.4 else "FRAUD_FLAGGED"),
            "signals": suspicious_signals,
            "sample_points": points
        }

    @staticmethod
    def _calculate_dist(lat1, lon1, lat2, lon2):
        """Simplistic distance calculation for heuristic demo."""
        return ((lat1 - lat2)**2 + (lon1 - lon2)**2)**0.5 * 111000 # Approx. meters
