from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    phone_number: str
    platform: str
    primary_zone: str

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
