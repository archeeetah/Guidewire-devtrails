from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import Base, engine
from models import user, policy
from api.routes import policies, triggers, users

# Initialize DB models
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ShramShield API",
    description="Backend for the ShramShield AI-Powered Insurance Platform",
    version="1.0.0"
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(policies.router, prefix="/api")
app.include_router(triggers.router, prefix="/api")
app.include_router(users.router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "ShramShield API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
