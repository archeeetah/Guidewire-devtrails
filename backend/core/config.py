import os

class Settings:
    PROJECT_NAME: str = "ShramShield API"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./shramshield.db")
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "")

settings = Settings()
