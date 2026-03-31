from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.payout import Payout
from models.user import User
import sys

engine = create_engine("sqlite:///./shramshield.db") # assuming default path
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

try:
    user = db.query(User).filter(User.phone_number == "8888888888").first()
    print(f"User found: {user.name} (ID: {user.id})")
    
    results = db.query(Payout, User.name, User.upi_id).filter(Payout.user_id == user.id).join(User, Payout.user_id == User.id).order_by(Payout.processed_at.desc()).all()
    print(f"Success! Found {len(results)} payouts.")
except Exception as e:
    print(f"FAILED: {e}")
finally:
    db.close()
