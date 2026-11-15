from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timezone
from app.core.database import get_db
from app.schemas.dtos import MockStartRequest, MockRespondRequest
from app.models.entities import Interview, Answer, Evaluation, User
from app.routers.auth import get_current_user_from_token

router = APIRouter(prefix="/mock-interview", tags=["Mock Interview"])

@router.post("/start")
def start_mock_interview(
    req: MockStartRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token)
):
    new_interview = Interview(
        user_id=current_user.id,
        job_role=req.role,
        interview_type=req.category,
        difficulty=req.difficulty,
        total_score=0.0,
        status="In Progress"
    )
    db.add(new_interview)
    db.commit()
    db.refresh(new_interview)
    return {"interview_id": new_interview.id, "status": "started"}

@router.post("/respond")
def respond_mock_interview(req: MockRespondRequest, db: Session = Depends(get_db)):
    idx = req.question_index
    total = req.total_questions

    # Persist student response to Answer table if interview_id provided
    if req.interview_id:
        try:
            ans = Answer(
                interview_id=req.interview_id,
                question_text=f"Question #{idx}",
                answer_text=req.answer
            )
            db.add(ans)
            db.commit()
        except Exception:
            db.rollback()

    if idx >= total:
        overall_score = 82.0
        # If interview exists, update status and score
        if req.interview_id:
            try:
                interview = db.query(Interview).filter(Interview.id == req.interview_id).first()
                if interview:
                    interview.total_score = overall_score
                    interview.status = "Completed"
                    interview.completed_at = datetime.now(timezone.utc)
                    db.commit()
            except Exception:
                db.rollback()

        return {
            "completed": True,
            "report": {
                "overall_score": int(overall_score),
                "technical_score": 85,
                "communication_score": 78,
                "strong_areas": [
                    "Strong foundational understanding of language internals and memory models",
                    "Clear, concise articulation of performance bottlenecks and caching strategies",
                    "Addressed practical edge cases with structured reasoning"
                ],
                "weak_areas": [
                    "Could be more explicit with Big-O time and space complexity tradeoffs",
                    "Proactively mention distributed system trade-offs and CAP theorem applications"
                ],
                "recommendations": [
                    "Revise database isolation levels and lock contention handling",
                    "Practice structured STAR methodology for behavioral and system design prompts"
                ],
                "verdict": "Recommended for Hire (Solid Technical & Communication Performance)"
            }
        }

    follow_ups = [
        f"Thank you. To drill deeper into this, how would you optimize that implementation if the data volume scaled by 100x and requests came in concurrently?",
        f"Understood. How would you monitor and trace latency bottlenecks for this component in a production Kubernetes or cloud environment?",
        f"Good point. If a database query in this workflow suddenly stalled during a traffic spike, walk me through your exact diagnostic steps."
    ]

    return {
        "completed": False,
        "feedback": "Thank you for the detailed breakdown. You clearly communicated the core architectural concept.",
        "next_question": follow_ups[(idx - 1) % len(follow_ups)]
    }
