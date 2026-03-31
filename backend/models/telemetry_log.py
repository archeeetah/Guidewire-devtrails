from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from core.database import Base


class TelemetryScanLog(Base):
    __tablename__ = "telemetry_scan_logs"

    id = Column(Integer, primary_key=True, index=True)
    zone = Column(String)                     # Zone that was scanned
    scan_type = Column(String)                # "automated" or "manual"
    status = Column(String)                   # "clear" or "disrupted"
    triggers_fired = Column(Integer, default=0)  # Number of payouts triggered
    telemetry_snapshot = Column(String)       # JSON string of raw weather data
    scanned_at = Column(DateTime(timezone=True), server_default=func.now())
