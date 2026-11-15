import pytest
from starlette.testclient import TestClient
from app.main import app
from app.core.database import Base, engine, SessionLocal
from app.models.entities import User

@pytest.fixture(scope="module")
def client():
    # Setup test database schema
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as test_client:
        yield test_client

def test_health_endpoints(client):
    """Test root and health check endpoints."""
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json()["status"] == "operational"

    health = client.get("/api/health")
    assert health.status_code == 200
    assert health.json()["status"] == "healthy"

def test_user_registration_and_login(client):
    """Test registering a new student user and logging in with JWT token."""
    test_email = "mentor_test@university.edu"
    register_payload = {
        "name": "Jordan Lee",
        "email": test_email,
        "password": "SecurePassword123!",
        "preferred_role": "Python Developer"
    }

    # Register
    reg_resp = client.post("/api/auth/register", json=register_payload)
    assert reg_resp.status_code in [200, 400]  # 400 if run multiple times
    
    # Login
    login_payload = {
        "email": test_email,
        "password": "SecurePassword123!"
    }
    login_resp = client.post("/api/auth/login", json=login_payload)
    assert login_resp.status_code == 200
    data = login_resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == test_email

def test_demo_student_login(client):
    """Test the 1-Click Student Demo Login credential flow."""
    login_resp = client.post("/api/auth/login", json={
        "email": "student@interviewpro.ai",
        "password": "InterviewPro2026!"
    })
    assert login_resp.status_code == 200
    data = login_resp.json()
    assert "access_token" in data
    assert data["user"]["preferred_role"] == "Python Developer"

def test_question_generation(client):
    """Test generating calibrated questions for a target role."""
    gen_payload = {
        "role": "Python Developer",
        "difficulty": "Intermediate",
        "topics": ["Python", "Data Structures and Algorithms"],
        "count": 2
    }
    resp = client.post("/api/questions/generate", json=gen_payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "questions" in data
    assert len(data["questions"]) >= 1
    assert "question" in data["questions"][0]

def test_answer_evaluation(client):
    """Test 5-metric AI answer evaluation."""
    eval_payload = {
        "question": "How do Python memory management and garbage collection work?",
        "topic": "Python",
        "difficulty": "Intermediate",
        "role": "Python Developer",
        "student_answer": "Python uses reference counting to track object references. When an object count drops to zero it is deallocated. It also uses cyclic garbage collection with 3 generations to detect circular references."
    }
    resp = client.post("/api/evaluations/evaluate", json=eval_payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "overall_score" in data
    assert "scores" in data
    assert "technical_accuracy" in data["scores"]
    assert "correct_points" in data
    assert len(data["correct_points"]) > 0

def test_mock_interview_flow(client):
    """Test mock interview start and conversational continuation."""
    login_resp = client.post("/api/auth/login", json={
        "email": "student@interviewpro.ai",
        "password": "InterviewPro2026!"
    })
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    start_resp = client.post("/api/mock-interview/start", json={
        "role": "Python Developer",
        "category": "Technical Interview",
        "difficulty": "Intermediate",
        "duration": 15
    }, headers=headers)
    assert start_resp.status_code == 200

    respond_resp = client.post("/api/mock-interview/respond", json={
        "role": "Python Developer",
        "question_index": 1,
        "total_questions": 3,
        "answer": "A shallow copy duplicates the outer object container, but inner nested elements still share references to the original objects.",
        "history": []
    })
    assert respond_resp.status_code == 200
    assert "next_question" in respond_resp.json()

def test_coding_sandbox_execution(client):
    """Test executing Python code in the sandbox against test cases."""
    code_payload = {
        "problem_id": "p1",
        "language": "python",
        "code": "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        if target - num in seen:\n            return [seen[target - num], i]\n        seen[num] = i\n    return []\nprint(two_sum([2, 7, 11, 15], 9))"
    }
    resp = client.post("/api/coding/execute", json=code_payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "Accepted"
    assert data["passed"] > 0
