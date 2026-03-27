from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone_number = Column(String, unique=True, index=True)
    platform = Column(String)  # Zomato, Amazon, Zepto, etc.
    platform_worker_id = Column(String)
    primary_zone = Column(String) # For hyper-local risk assessment
    upi_id = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
