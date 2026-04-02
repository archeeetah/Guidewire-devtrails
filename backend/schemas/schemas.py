from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    phone_number: str
    platform: str
    platform_worker_id: str
    primary_zone: str
    upi_id: str

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class PolicyQuoteRequest(BaseModel):
    platform: str
    primary_zone: str

class PolicyQuoteResponse(BaseModel):
    base_premium: float
    risk_adjustment: float
    final_weekly_premium: float
    recommended_triggers: list[str]
    risk_factors: list[str]

class PolicyPurchaseRequest(BaseModel):
    user_id: int
    weekly_premium: float
    coverage_amount: float
    rain_trigger_active: bool = True
    aqi_trigger_active: bool = True
    zone_lockout_active: bool = True

class PolicyResponse(BaseModel):
    id: int
    user_id: int
    weekly_premium: float
    coverage_amount: float
    is_active: bool
    starts_at: datetime
    
    class Config:
        from_attributes = True

class PayoutResponse(BaseModel):
    id: int
    policy_id: int
    user_id: int
    amount: float
    trigger_type: str
    trigger_reason: str
    payout_status: str
    transaction_id: Optional[str] = None
    confidence_score: float = 1.0
    processed_at: datetime
    user_name: Optional[str] = None
    user_upi: Optional[str] = None


    class Config:
        from_attributes = True

class AOLRequest(BaseModel):
    query: str
    session_id: str

class AOLResponse(BaseModel):
    text: str
    trace: list[dict]
    status: str = "SUCCESS"
