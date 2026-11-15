from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field

# User Schemas
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str
    password: str = Field(..., min_length=6)
    preferred_role: str = "Python Developer"

class UserLogin(BaseModel):
    email: str
    password: str

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    preferred_role: Optional[str] = None
    skills: Optional[List[Dict[str, str]]] = None

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    preferred_role: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Question Generator Schemas
class QuestionGenRequest(BaseModel):
    role: str = "Python Developer"
    difficulty: str = "Intermediate"
    topics: List[str] = ["Python"]
    count: int = 3

class QuestionItem(BaseModel):
    id: str
    role: str
    topic: str
    difficulty: str
    question: str
    idealAnswer: Optional[str] = None

class QuestionGenResponse(BaseModel):
    questions: List[QuestionItem]

# Evaluation Schemas
class EvaluationRequest(BaseModel):
    question: str
    topic: str
    difficulty: str
    role: str
    student_answer: str

class EvaluationScores(BaseModel):
    technical_accuracy: float
    conceptual_understanding: float
    completeness: float
    clarity: float
    relevant_examples: float

class EvaluationResponse(BaseModel):
    overall_score: float
    scores: EvaluationScores
    correct_points: List[str]
    missing_concepts: List[str]
    suggested_improvements: str
    ideal_answer: str
    topics_to_revise: List[str]

# Mock Interview Schemas
class MockStartRequest(BaseModel):
    role: str
    category: str
    difficulty: str
    duration: int = 15

class MockRespondRequest(BaseModel):
    role: str
    question_index: int
    total_questions: int
    answer: str
    history: List[Dict[str, Any]]

# Coding Sandbox Schemas
class CodeExecuteRequest(BaseModel):
    problem_id: str
    language: str
    code: str

class TestCaseResult(BaseModel):
    id: int
    input: str
    expected: str
    actual: str
    passed: bool

class CodeExecuteResponse(BaseModel):
    status: str
    passed: int
    total: int
    execution_time: str
    memory: str
    stdout: str
    test_results: List[TestCaseResult]
