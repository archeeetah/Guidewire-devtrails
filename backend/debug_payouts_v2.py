from core.database import engine, SessionLocal
from models.payout import Payout
from models.user import User
import sys

db = SessionLocal()

try:
    phone = "8888888888" # Test phone from subagent
    user = db.query(User).filter(User.phone_number == phone).first()
    if not user:
        print(f"FAILED: User {phone} not found in database.")
        sys.exit(1)
        
    print(f"User found: {user.name} (ID: {user.id})")
    
    # Attempting the specific query that fails
    results = db.query(Payout, User.name, User.upi_id).filter(Payout.user_id == user.id).join(User, Payout.user_id == User.id).order_by(Payout.processed_at.desc()).all()
    print(f"Success! Found {len(results)} payouts.")
    
    for p, name, upi in results:
        print(f" - Payout {p.id}: {p.amount} ({p.trigger_type})")
        
except Exception as e:
    print(f"FAILED: {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()
