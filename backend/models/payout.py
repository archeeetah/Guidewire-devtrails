from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from core.database import Base

class Payout(Base):
    __tablename__ = "payouts"

    id = Column(Integer, primary_key=True, index=True)
    policy_id = Column(Integer, ForeignKey("policies.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    trigger_type = Column(String) # e.g. Heavy Rainfall, Pollution, Curfew
    trigger_reason = Column(String)
    processed_at = Column(DateTime(timezone=True), server_default=func.now())
