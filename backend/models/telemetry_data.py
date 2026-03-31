from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from core.database import Base


class TelemetryData(Base):
    __tablename__ = "telemetry_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Coordinates
    lat = Column(Float)
    lon = Column(Float)
    altitude = Column(Float, nullable=True) # For Z-axis elevation validation
    
    # High-frequency sensor fusion (IMU)
    accel_x = Column(Float, nullable=True)
    accel_y = Column(Float, nullable=True)
    accel_z = Column(Float, nullable=True)
    
    gyro_x = Column(Float, nullable=True)
    gyro_y = Column(Float, nullable=True)
    gyro_z = Column(Float, nullable=True)
    
    # Metadata
    device_id = Column(String, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
