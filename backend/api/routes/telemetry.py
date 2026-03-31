from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from models.telemetry_data import TelemetryData
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
