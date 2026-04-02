import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import Base, engine
from models.user import User
from models.policy import Policy
from models.payout import Payout
from models.telemetry_log import TelemetryScanLog
from models.telemetry_data import TelemetryData
from models.audit_log import AOLAuditLog
from schemas.schemas import AOLRequest, AOLResponse
from services.agent.agent_orchestrator import orchestrator
from services.agent.audit_trail import AOLAuditTrail
from api.routes import policies, triggers, users, payouts, admin, monitoring, telemetry

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from core.security import limiter
from core.config import settings
from services.scheduler import start_scheduler, stop_scheduler

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s"
)
logger = logging.getLogger("shramshield")

# Initialize DB models (including new TelemetryScanLog)
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage startup/shutdown lifecycle for the autonomous scanner."""
    # Startup
    if settings.AUTO_SCAN_ENABLED:
        logger.info("AUTO_SCAN_ENABLED=true — Starting Autonomous Telemetry Scanner...")
        start_scheduler()
    else:
        logger.info("AUTO_SCAN_ENABLED=false — Autonomous Scanner is disabled.")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Autonomous Telemetry Scanner...")
    stop_scheduler()


app = FastAPI(
    title="ShramShield API",
    description="Backend for the ShramShield AI-Powered Insurance Platform",
    lifespan=lifespan
)

# Add rate limiter state and exception handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# HARDENED CORS: Only allow origins defined in settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(policies.router, prefix="/api")
app.include_router(triggers.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(payouts.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(monitoring.router, prefix="/api")
app.include_router(telemetry.router, prefix="/api")

@app.post("/api/agent/interact", response_model=AOLResponse)
async def agent_interact(req: AOLRequest):
    """
    ShramShield AOL: The Agentic Gateway.
    Processes user queries through the Gemini-powered Reasoning Loop.
    Logs every action for the investor-grade audit trail.
    """
    try:
        # Process query through the Orchestrator
        result = orchestrator.interact(req.query)
        
        # Log to the Audit Trail for investors
        AOLAuditTrail.log_interaction(
            session_id=req.session_id,
            user_input=req.query,
            response=result["text"],
            tool_calls=result["trace"]
        )
        
        return AOLResponse(
            text=result["text"],
            trace=result["trace"],
            status="SUCCESS"
        )
    except Exception as e:
        logger.error(f"AOL Error: {str(e)}")
        return AOLResponse(
            text="I'm sorry, I'm having trouble reasoning right now. Please try again or check your connection.",
            trace=[],
            status="ERROR"
        )


@app.get("/")
def read_root():
    return {"status": "ok", "message": "ShramShield API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

