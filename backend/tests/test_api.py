import pytest
from starlette.testclient import TestClient
from app.main import app
from app.core.database import Base, engine, normalize_database_url
from app.models.entities import User, Interview, CodingSubmission

@pytest.fixture(scope="module")
def client():
    # Setup database schema
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as test_client:
        yield test_client

def test_database_url_normalization():
    """Verify PostgreSQL URL conversion to use psycopg driver."""
    assert normalize_database_url("sqlite:///./test.db") == "sqlite:///./test.db"
    assert normalize_database_url("postgres://user:pass@host:5432/db") == "postgresql+psycopg://user:pass@host:5432/db"
    assert normalize_database_url("postgresql://user:pass@host:5432/db") == "postgresql+psycopg://user:pass@host:5432/db"
    assert normalize_database_url("postgresql+psycopg://user:pass@host:5432/db") == "postgresql+psycopg://user:pass@host:5432/db"

def test_health_and_database_status(client):
    """Test root, health, and database connection status endpoints."""
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json()["status"] == "operational"

    health = client.get("/api/health")
    assert health.status_code == 200
    assert health.json()["status"] == "healthy"

    db_status = client.get("/api/database/status")
    assert db_status.status_code == 200
    assert db_status.json()["connected"] is True
    assert db_status.json()["type"] in ["SQLite", "PostgreSQL"]

def test_user_registration_and_login(client):
    """Test student registration, duplicate prevention, and login."""
    test_email = "student_audit@university.edu"
    register_payload = {
        "name": "Alex Morgan",
        "email": test_email,
        "password": "SecurePassword123!",
        "preferred_role": "Python Developer"
    }

    # Register
    reg_resp = client.post("/api/auth/register", json=register_payload)
    assert reg_resp.status_code in [200, 400]
    
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

    # Duplicate registration must fail with 400
    dup_resp = client.post("/api/auth/register", json=register_payload)
    assert dup_resp.status_code == 400

def test_demo_student_login(client):
    """Test 1-Click Student Demo Login credential flow."""
    login_resp = client.post("/api/auth/login", json={
        "email": "student@interviewpro.ai",
        "password": "InterviewPro2026!"
    })
    assert login_resp.status_code == 200
    data = login_resp.json()
    assert "access_token" in data
    assert data["user"]["preferred_role"] == "Python Developer"

def test_profile_update(client):
    """Test updating user profile and target job role."""
    login_resp = client.post("/api/auth/login", json={
        "email": "student@interviewpro.ai",
        "password": "InterviewPro2026!"
    })
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    update_resp = client.put("/api/auth/profile", json={
        "name": "Alex Morgan (Verified)",
        "preferred_role": "AI/ML Engineer"
    }, headers=headers)
    assert update_resp.status_code == 200
    assert update_resp.json()["preferred_role"] == "AI/ML Engineer"

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
    assert "idealAnswer" in data["questions"][0]

def test_answer_evaluation_rubric(client):
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
    assert "conceptual_understanding" in data["scores"]
    assert "completeness" in data["scores"]
    assert "clarity" in data["scores"]
    assert "relevant_examples" in data["scores"]
    assert "correct_points" in data
    assert len(data["correct_points"]) > 0

def test_mock_interview_lifecycle(client):
    """Test mock interview start, conversational follow-up, and final report."""
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
    interview_id = start_resp.json()["interview_id"]

    # Mid-session response
    mid_resp = client.post("/api/mock-interview/respond", json={
        "interview_id": interview_id,
        "role": "Python Developer",
        "question_index": 1,
        "total_questions": 3,
        "answer": "A shallow copy duplicates the outer object container, but inner nested elements still share references to the original objects.",
        "history": []
    })
    assert mid_resp.status_code == 200
    assert mid_resp.json()["completed"] is False
    assert "next_question" in mid_resp.json()

    # Final session response triggering report
    final_resp = client.post("/api/mock-interview/respond", json={
        "interview_id": interview_id,
        "role": "Python Developer",
        "question_index": 3,
        "total_questions": 3,
        "answer": "We can utilize multiprocessing to bypass the GIL for CPU-bound tasks, and asyncio for I/O bound workloads.",
        "history": []
    })
    assert final_resp.status_code == 200
    assert final_resp.json()["completed"] is True
    assert "report" in final_resp.json()
    assert "overall_score" in final_resp.json()["report"]

def test_coding_sandbox_execution(client):
    """Test executing Python code in the sandbox against test cases."""
    login_resp = client.post("/api/auth/login", json={
        "email": "student@interviewpro.ai",
        "password": "InterviewPro2026!"
    })
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    code_payload = {
        "problem_id": "p1",
        "language": "python",
        "code": "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        if target - num in seen:\n            return [seen[target - num], i]\n        seen[num] = i\n    return []\nprint(two_sum([2, 7, 11, 15], 9))"
    }
    resp = client.post("/api/coding/execute", json=code_payload, headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "Accepted"
    assert data["passed"] > 0

def test_coding_security_guard(client):
    """Test that unauthorized system calls in user code are blocked."""
    harmful_code = "import os\nos.system('echo hacked')"
    resp = client.post("/api/coding/execute", json={
        "problem_id": "p1",
        "language": "python",
        "code": harmful_code
    })
    assert resp.status_code == 200
    assert resp.json()["status"] == "Security Violation"

def test_dashboard_summary(client):
    """Test student dashboard metrics computation."""
    login_resp = client.post("/api/auth/login", json={
        "email": "student@interviewpro.ai",
        "password": "InterviewPro2026!"
    })
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    resp = client.get("/api/dashboard/summary", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "stats" in data
    assert data["stats"]["readinessScore"] >= 0
    assert "recentInterviews" in data
