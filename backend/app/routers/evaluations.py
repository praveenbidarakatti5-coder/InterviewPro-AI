from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.dtos import EvaluationRequest, EvaluationResponse
from app.services.ai_service import ai_service

router = APIRouter(prefix="/evaluations", tags=["Answer Evaluation"])

@router.post("/evaluate", response_model=EvaluationResponse)
async def evaluate_answer(req: EvaluationRequest, db: Session = Depends(get_db)):
    result = await ai_service.evaluate_student_answer(
        question=req.question,
        topic=req.topic,
        difficulty=req.difficulty,
        role=req.role,
        student_answer=req.student_answer
    )
    return result
