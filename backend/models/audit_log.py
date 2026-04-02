from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from core.database import Base
from datetime import datetime

class AOLAuditLog(Base):
    """
    ShramShield AOL: Audit Trail for Agentic Decisions.
    Stores the lifecycle of an agentic interaction for investor auditing and compliance.
    """
    __tablename__ = "aol_audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    session_id = Column(String(100), index=True) # To group multiple turns
    user_input = Column(Text)
    agent_response = Column(Text)
    tool_calls = Column(Text) # JSON string of tools triggered
    confidence_score = Column(Float, nullable=True) # If extracted from reasoning
    status = Column(String(50)) # e.g., 'SUCCESS', 'FLAGGED', 'ERROR'
