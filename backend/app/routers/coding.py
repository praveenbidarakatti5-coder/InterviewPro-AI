from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.entities import CodingSubmission, User
from app.schemas.dtos import CodeExecuteRequest, CodeExecuteResponse
from app.services.code_runner import code_runner

router = APIRouter(prefix="/coding", tags=["Coding Assessment"])

SAMPLE_TEST_CASES = {
    "p1": [
        {"id": 1, "input": "nums = [2, 7, 11, 15], target = 9", "expected": "[0, 1]"},
        {"id": 2, "input": "nums = [3, 2, 4], target = 6", "expected": "[1, 2]"},
        {"id": 3, "input": "nums = [3, 3], target = 6", "expected": "[0, 1]"},
    ],
    "p2": [
        {"id": 1, "input": 's = "()"', "expected": "true"},
        {"id": 2, "input": 's = "()[]{}"', "expected": "true"},
        {"id": 3, "input": 's = "(]"', "expected": "false"},
    ]
}

@router.post("/execute", response_model=CodeExecuteResponse)
def execute_code_submission(
    req: CodeExecuteRequest,
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None)
):
    test_cases = SAMPLE_TEST_CASES.get(req.problem_id, SAMPLE_TEST_CASES["p1"])
    result = code_runner.execute_code(
        language=req.language,
        code=req.code,
        problem_id=req.problem_id,
        test_cases=test_cases
    )

    # If user is authenticated, persist submission to database
    user_id = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        payload = decode_access_token(token)
        if payload and "sub" in payload:
            user_id = payload["sub"]

    if user_id:
        try:
            score = (result["passed"] / max(result["total"], 1)) * 100.0
            submission = CodingSubmission(
                user_id=user_id,
                question_id=req.problem_id,
                programming_language=req.language,
                submitted_code=req.code,
                execution_status=result["status"],
                score=score,
                test_cases_passed=result["passed"],
                total_test_cases=result["total"]
            )
            db.add(submission)
            db.commit()
        except Exception as e:
            db.rollback()

    return result
