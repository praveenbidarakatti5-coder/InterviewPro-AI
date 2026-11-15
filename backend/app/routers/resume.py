from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.resume_parser import resume_parser

router = APIRouter(prefix="/resume", tags=["Resume Analyzer"])

@router.post("/analyze")
async def analyze_uploaded_resume(
    file: UploadFile = File(...),
    target_role: str = Form("Python Developer")
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are currently supported for resume parsing.")

    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum allowed limit (5MB).")

    text = resume_parser.extract_text_from_pdf(contents)
    result = resume_parser.analyze_resume(text=text, target_role=target_role, filename=file.filename)
    return result
