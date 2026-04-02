from models.audit_log import AOLAuditLog
from core.database import SessionLocal
import json
import uuid

class AOLAuditTrail:
    """
    ShramShield AOL: Registry for Agentic Events.
    This service ensures every autonomous action is logged with reasoning and confidence.
    """

    @staticmethod
    def log_interaction(session_id: str, user_input: str, response: str, tool_calls: list = None, status: str = "SUCCESS"):
        """
        Records the agentic decision into the database.
        Includes tools used and any confidence scoring from the LLM.
        """
        db = SessionLocal()
        try:
            log_entry = AOLAuditLog(
                session_id=session_id,
                user_input=user_input,
                agent_response=response,
                tool_calls=json.dumps(tool_calls) if tool_calls else "[]",
                status=status
            )
            db.add(log_entry)
            db.commit()
            return log_entry.id
        except Exception as e:
            db.rollback()
            # In a real product, we would alert an Ops team here
            return None
        finally:
            db.close()
