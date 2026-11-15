import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

class Settings:
    PROJECT_NAME: str = "InterviewPro AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database Configuration (PostgreSQL with SQLite fallback)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./interviewpro.db"
    )
    
    # JWT Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "interviewpro-super-secret-jwt-key-2026-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # AI Language Model API Key
    AI_API_KEY: str = os.getenv("GEMINI_API_KEY", os.getenv("AI_API_KEY", ""))
    AI_MODEL: str = os.getenv("AI_MODEL", "gemini-2.5-flash")

settings = Settings()
