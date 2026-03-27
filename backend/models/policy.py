from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from core.database import Base

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    weekly_premium = Column(Float)  # Dynamically calculated
    coverage_amount = Column(Float)
    
    # Parametric Triggers (simplified for Phase 1)
    rain_trigger_active = Column(Boolean, default=False)
    aqi_trigger_active = Column(Boolean, default=False)
    zone_lockout_active = Column(Boolean, default=False)
    
    is_active = Column(Boolean, default=True)
    starts_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))
