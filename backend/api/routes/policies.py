from fastapi import APIRouter
from schemas.schemas import PolicyQuoteRequest, PolicyQuoteResponse
from services.ai_risk import calculate_risk_premium

router = APIRouter(prefix="/policies", tags=["Policies"])

@router.post("/quote", response_model=PolicyQuoteResponse)
def get_policy_quote(request: PolicyQuoteRequest):
    """
    Get a dynamic, AI-adjusted weekly premium quote 
    based on the worker's platform and primary operating zone.
    """
    quote_data = calculate_risk_premium(request.platform, request.primary_zone)
    return PolicyQuoteResponse(**quote_data)
