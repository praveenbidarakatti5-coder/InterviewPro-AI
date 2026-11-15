import uuid
from datetime import datetime, timezone

def utc_now():
    return datetime.now(timezone.utc)
from sqlalchemy import (
    Column, 
    String, 
    Integer, 
    Float, 
    Text, 
    Boolean, 
    DateTime, 
    ForeignKey
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    preferred_role = Column(String(100), default="Python Developer", nullable=False)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    skills = relationship("UserSkill", back_populates="user", cascade="all, delete-orphan")
    interviews = relationship("Interview", back_populates="user", cascade="all, delete-orphan")
    coding_submissions = relationship("CodingSubmission", back_populates="user", cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    recommendations = relationship("LearningRecommendation", back_populates="user", cascade="all, delete-orphan")


class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    proficiency_level = Column(String(50), default="Intermediate")

    user = relationship("User", back_populates="skills")


class Question(Base):
    __tablename__ = "questions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    question_text = Column(Text, nullable=False)
    category = Column(String(100), default="Technical")
    topic = Column(String(100), nullable=False)
    difficulty = Column(String(50), default="Intermediate")
    created_at = Column(DateTime, default=utc_now)


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_role = Column(String(100), nullable=False)
    interview_type = Column(String(100), default="Technical Interview")
    difficulty = Column(String(50), default="Intermediate")
    total_score = Column(Float, default=0.0)
    status = Column(String(50), default="Completed")
    started_at = Column(DateTime, default=utc_now)
    completed_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="interviews")
    answers = relationship("Answer", back_populates="interview", cascade="all, delete-orphan")


class Answer(Base):
    __tablename__ = "answers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    interview_id = Column(String(36), ForeignKey("interviews.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(String(36), nullable=True)
    question_text = Column(Text, nullable=True)
    answer_text = Column(Text, nullable=False)
    submitted_at = Column(DateTime, default=utc_now)

    interview = relationship("Interview", back_populates="answers")
    evaluation = relationship("Evaluation", back_populates="answer", uselist=False, cascade="all, delete-orphan")


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    answer_id = Column(String(36), ForeignKey("answers.id", ondelete="CASCADE"), nullable=False)
    technical_accuracy = Column(Float, default=0.0)
    completeness = Column(Float, default=0.0)
    clarity = Column(Float, default=0.0)
    conceptual_understanding = Column(Float, default=0.0)
    relevant_examples = Column(Float, default=0.0)
    overall_score = Column(Float, default=0.0)
    correct_points = Column(Text, nullable=True)
    missing_concepts = Column(Text, nullable=True)
    suggestions = Column(Text, nullable=True)
    ideal_answer = Column(Text, nullable=True)
    topics_to_revise = Column(String(255), nullable=True)

    answer = relationship("Answer", back_populates="evaluation")


class CodingQuestion(Base):
    __tablename__ = "coding_questions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String(50), default="Beginner")
    test_cases_json = Column(Text, nullable=True)
    supported_languages_json = Column(Text, default='["python", "c", "java"]')
    created_at = Column(DateTime, default=utc_now)


class CodingSubmission(Base):
    __tablename__ = "coding_submissions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(String(36), nullable=False)
    programming_language = Column(String(50), nullable=False)
    submitted_code = Column(Text, nullable=False)
    execution_status = Column(String(50), default="Pending")
    score = Column(Float, default=0.0)
    test_cases_passed = Column(Integer, default=0)
    total_test_cases = Column(Integer, default=0)
    submitted_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="coding_submissions")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    extracted_text = Column(Text, nullable=True)
    analysis_json = Column(Text, nullable=True)
    uploaded_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="resumes")


class LearningRecommendation(Base):
    __tablename__ = "learning_recommendations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    topic = Column(String(100), nullable=False)
    recommendation = Column(Text, nullable=False)
    priority = Column(String(50), default="High")
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="recommendations")
