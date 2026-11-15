from fastapi import APIRouter

router = APIRouter(prefix="/analytics", tags=["Performance Analytics"])

@router.get("/history")
def get_analytics_history():
    return {
        "readiness_score": 76,
        "readiness_level": "Interview Ready (Intermediate)",
        "score_history": [
            {"attempt": "Mock 1", "score": 62, "coding": 50, "avg": 56},
            {"attempt": "Mock 2", "score": 68, "coding": 70, "avg": 69},
            {"attempt": "Mock 3", "score": 71, "coding": 80, "avg": 75},
            {"attempt": "Mock 4", "score": 79, "coding": 85, "avg": 82},
            {"attempt": "Mock 5", "score": 85, "coding": 92, "avg": 88},
        ],
        "topic_mastery": [
            {"topic": "Python", "mastery": 85, "benchmark": 80},
            {"topic": "OOP Concepts", "mastery": 78, "benchmark": 75},
            {"topic": "DSA", "mastery": 72, "benchmark": 75},
            {"topic": "Operating Sys", "mastery": 65, "benchmark": 70},
            {"topic": "DBMS & SQL", "mastery": 58, "benchmark": 75},
            {"topic": "Networks", "mastery": 62, "benchmark": 65},
        ]
    }
