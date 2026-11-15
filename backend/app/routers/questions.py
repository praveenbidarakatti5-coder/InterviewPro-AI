from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import Question
from app.schemas.dtos import QuestionGenRequest, QuestionGenResponse, QuestionItem
from app.services.ai_service import ai_service

router = APIRouter(prefix="/questions", tags=["Question Generator"])

@router.post("/generate", response_model=QuestionGenResponse)
async def generate_questions(req: QuestionGenRequest, db: Session = Depends(get_db)):
    questions_data = await ai_service.generate_interview_questions(
        role=req.role,
        difficulty=req.difficulty,
        topics=req.topics,
        count=req.count
    )

    # Persist in Questions table
    for q in questions_data:
        db_q = Question(
            question_text=q["question"],
            category="Technical",
            topic=q["topic"],
            difficulty=q["difficulty"]
        )
        db.add(db_q)
    db.commit()

    return {"questions": questions_data}
