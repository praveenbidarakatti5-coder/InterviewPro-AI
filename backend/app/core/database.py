import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

logger = logging.getLogger("interviewpro.database")

def normalize_database_url(url: str) -> str:
    """
    Ensure PostgreSQL URLs use the installed modern psycopg driver (v3).
    Supports postgres://, postgresql://, and SQLite.
    """
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+psycopg://", 1)
    elif url.startswith("postgresql://") and not url.startswith("postgresql+"):
        return url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url

db_url = normalize_database_url(settings.DATABASE_URL)

connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(
        db_url,
        connect_args=connect_args,
        pool_pre_ping=True
    )
except Exception as e:
    logger.warning(f"Could not initialize engine with '{db_url}': {e}. Falling back to SQLite.")
    db_url = "sqlite:///./interviewpro.db"
    engine = create_engine(
        db_url,
        connect_args={"check_same_thread": False},
        pool_pre_ping=True
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency that yields a database session per request and cleanly closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_db_connection() -> dict:
    """Test and return live status of the configured database."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_type = "PostgreSQL" if "postgresql" in engine.url.drivername else "SQLite"
        return {"connected": True, "type": db_type, "url": str(engine.url)}
    except Exception as e:
        return {"connected": False, "error": str(e), "url": str(engine.url)}
