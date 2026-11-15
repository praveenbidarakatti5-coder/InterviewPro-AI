from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token
from app.models.entities import User, UserSkill
from app.schemas.dtos import UserRegister, UserLogin, UserProfileUpdate, UserResponse, TokenResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_current_user_from_token(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token missing or invalid",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(User).filter(User.id == payload["sub"]).first()
    if not user:
        # Fallback for demo mock session if DB was reset
        return User(
            id=payload["sub"],
            name=payload.get("name", "Student Engineer"),
            email=payload.get("email", "student@interviewpro.ai"),
            preferred_role=payload.get("role", "Python Developer")
        )
    return user

@router.post("/register", response_model=TokenResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please log in."
        )

    new_user = User(
        name=user_data.name,
        email=user_data.email.lower(),
        password_hash=hash_password(user_data.password),
        preferred_role=user_data.preferred_role or "Python Developer"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(data={
        "sub": new_user.id,
        "email": new_user.email,
        "name": new_user.name,
        "role": new_user.preferred_role
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "preferred_role": new_user.preferred_role
        }
    }

@router.post("/login", response_model=TokenResponse)
def login(creds: UserLogin, db: Session = Depends(get_db)):
    # Check demo student login shortcut
    if creds.email.lower() == "student@interviewpro.ai" and creds.password == "InterviewPro2026!":
        demo_user = db.query(User).filter(User.email == "student@interviewpro.ai").first()
        if not demo_user:
            demo_user = User(
                name="Alex Morgan",
                email="student@interviewpro.ai",
                password_hash=hash_password("InterviewPro2026!"),
                preferred_role="Python Developer"
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)

        token = create_access_token(data={
            "sub": demo_user.id,
            "email": demo_user.email,
            "name": demo_user.name,
            "role": demo_user.preferred_role
        })
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": demo_user.id,
                "name": demo_user.name,
                "email": demo_user.email,
                "preferred_role": demo_user.preferred_role
            }
        }

    user = db.query(User).filter(User.email == creds.email.lower()).first()
    if not user or not verify_password(creds.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password. Please verify your credentials."
        )

    token = create_access_token(data={
        "sub": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.preferred_role
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "preferred_role": user.preferred_role
        }
    }

@router.get("/me", response_model=UserResponse)
def get_current_user(current_user: User = Depends(get_current_user_from_token)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "preferred_role": current_user.preferred_role
    }

@router.put("/profile", response_model=UserResponse)
def update_profile(
    profile_data: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token)
):
    user = db.query(User).filter(User.id == current_user.id).first()
    if user:
        if profile_data.name:
            user.name = profile_data.name
        if profile_data.preferred_role:
            user.preferred_role = profile_data.preferred_role
        db.commit()
        db.refresh(user)
        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "preferred_role": user.preferred_role
        }

    return {
        "id": current_user.id,
        "name": profile_data.name or current_user.name,
        "email": current_user.email,
        "preferred_role": profile_data.preferred_role or current_user.preferred_role
    }
