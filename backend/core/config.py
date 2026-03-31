import os
from dotenv import load_dotenv

# Load local .env file
load_dotenv()

class Settings:
    PROJECT_NAME: str = "ShramShield API"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./shramshield.db")
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "")
    ALLOWED_ORIGINS: list[str] = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
    SCAN_INTERVAL_MINUTES: int = int(os.getenv("SCAN_INTERVAL_MINUTES", "15"))
    AUTO_SCAN_ENABLED: bool = os.getenv("AUTO_SCAN_ENABLED", "true").lower() == "true"
    
    # RazorpayX (Simulated)
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "rzp_test_vO7S2x...")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "dummy_secret")
    RAZORPAYX_ACCOUNT_NUMBER: str = os.getenv("RAZORPAYX_ACCOUNT_NUMBER", "2323230012345678")

settings = Settings()
