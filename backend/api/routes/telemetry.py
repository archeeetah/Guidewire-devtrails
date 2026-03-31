from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from models.telemetry_data import TelemetryData
from services.ai_risk import generate_zone_forecast
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/telemetry", tags=["Behavioural Telemetry"])

class TelemetryPoint(BaseModel):
    user_id: int
    lat: float
    lon: float
    altitude: float = None
    accel_x: float = None
    accel_y: float = None
    accel_z: float = None
    gyro_x: float = None
    gyro_y: float = None
    gyro_z: float = None
    device_id: str = None

@router.post("/ingest")
def ingest_telemetry_batch(batch: List[TelemetryPoint], db: Session = Depends(get_db)):
    """
    Ingest a batch of high-frequency telemetry from the worker's PWA.
    Used for Zero-Trust Mobility Intelligence and Anti-Spoofing.
    """
    new_records = []
    for point in batch:
        record = TelemetryData(
            user_id=point.user_id,
            lat=point.lat,
            lon=point.lon,
            altitude=point.altitude,
            accel_x=point.accel_x,
            accel_y=point.accel_y,
            accel_z=point.accel_z,
            gyro_x=point.gyro_x,
            gyro_y=point.gyro_y,
            gyro_z=point.gyro_z,
            device_id=point.device_id
        )
        new_records.append(record)
    
    db.add_all(new_records)
    db.commit()
    
    return {"status": "success", "processed_points": len(batch)}

@router.post("/analyze-crash/{user_id}")
def analyze_telemetry_for_crash(user_id: int, db: Session = Depends(get_db)):
    """
    ShramShield Advanced Feature: Crash Detection via IMU spikes.
    Analyzes the last 10 seconds of telemetry for extreme G-Force spikes indicative of an accident.
    """
    latest_points = (
        db.query(TelemetryData)
        .filter(TelemetryData.user_id == user_id)
        .order_by(TelemetryData.timestamp.desc())
        .limit(10)
        .all()
    )

    if not latest_points:
        return {"status": "NORMAL"}

    # Heuristic: A sudden spike > 20 m/s^2 (approx 2Gs) on either axis suggests a collision/fall
    for point in latest_points:
        if point.accel_x and abs(point.accel_x) > 20.0:
            return {"status": "CRASH_DETECTED", "axis": "X", "force": point.accel_x}
        if point.accel_y and abs(point.accel_y) > 20.0:
            return {"status": "CRASH_DETECTED", "axis": "Y", "force": point.accel_y}

    return {"status": "NORMAL"}

@router.get("/forecast/{zone}")
def get_zone_intelligence_forecast(zone: str):
    """
    Predictive Intelligence Endpoint.
    Returns AI-generated probability scores for upcoming environmental disruptions in a specific zone.
    """
    return generate_zone_forecast(zone)
