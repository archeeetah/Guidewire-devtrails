import os
from dotenv import load_dotenv

# Load local .env file
load_dotenv()
from dotenv import load_dotenv

# Load local .env file
load_dotenv()

class Settings:
    PROJECT_NAME: str = "ShramShield API"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./shramshield.db")
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "")

settings = Settings()
