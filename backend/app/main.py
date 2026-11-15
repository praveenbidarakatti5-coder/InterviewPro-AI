from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.core.database import engine, Base, SessionLocal
from app.core.security import hash_password
from app.models.entities import User

# Routers
from app.routers import (
    auth,
    dashboard,
    questions,
    evaluations,
    mock_interview,
    coding,
    resume,
    analytics
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed demo student
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        demo = db.query(User).filter(User.email == "student@interviewpro.ai").first()
        if not demo:
            demo = User(
                name="Alex Morgan",
                email="student@interviewpro.ai",
                password_hash=hash_password("InterviewPro2026!"),
                preferred_role="Python Developer"
            )
            db.add(demo)
            db.commit()
            print("Seeded demo student account: student@interviewpro.ai / InterviewPro2026!")
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for InterviewPro AI – AI-Powered Interview Preparation & Assessment Platform",
    lifespan=lifespan
)

# Enable CORS for all local dev frontend ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check Endpoints
@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "database": "connected"}

# Register Modular Routers under /api
app.include_router(auth.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(questions.router, prefix="/api")
app.include_router(evaluations.router, prefix="/api")
app.include_router(mock_interview.router, prefix="/api")
app.include_router(coding.router, prefix="/api")
app.include_router(resume.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
