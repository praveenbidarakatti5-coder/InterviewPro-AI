import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, Header
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.entities import Resume
from app.services.resume_parser import resume_parser

router = APIRouter(prefix="/resume", tags=["Resume Analyzer"])

@router.post("/analyze")
async def analyze_uploaded_resume(
    file: UploadFile = File(...),
    target_role: str = Form("Python Developer"),
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are currently supported for resume parsing.")

    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum allowed limit (5MB).")

    text = resume_parser.extract_text_from_pdf(contents)
    result = resume_parser.analyze_resume(text=text, target_role=target_role, filename=file.filename)

    # Persist resume if user authenticated
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        payload = decode_access_token(token)
        if payload and "sub" in payload:
            try:
                db_resume = Resume(
                    user_id=payload["sub"],
                    filename=file.filename,
                    extracted_text=text[:2000] if text else "",
                    analysis_json=json.dumps(result)
                )
                db.add(db_resume)
                db.commit()
            except Exception:
                db.rollback()

    return result
