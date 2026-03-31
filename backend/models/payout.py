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
    
    # RazorpayX Integration Fields
    payout_status = Column(String, default="PROCESSING") # PROCESSING, SETTLED, FAILED
    transaction_id = Column(String, unique=True, index=True, nullable=True)
    payment_method = Column(String, default="UPI")
    
    # Zero-Trust Validation Architecture
    confidence_score = Column(Float, default=1.0) # Mobility Confidence [0.0 - 1.0]
    
    processed_at = Column(DateTime(timezone=True), server_default=func.now())

