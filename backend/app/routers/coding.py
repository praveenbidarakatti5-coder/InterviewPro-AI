from fastapi import APIRouter
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
def execute_code_submission(req: CodeExecuteRequest):
    test_cases = SAMPLE_TEST_CASES.get(req.problem_id, SAMPLE_TEST_CASES["p1"])
    result = code_runner.execute_code(
        language=req.language,
        code=req.code,
        problem_id=req.problem_id,
        test_cases=test_cases
    )
    return result
