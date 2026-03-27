import os

class Settings:
    PROJECT_NAME: str = "ShramShield API"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./shramshield.db")

settings = Settings()
