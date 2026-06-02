from fastapi import APIRouter
from pydantic import BaseModel
from app.services.summarize import summarize_pdf
import os
from app.database import summary_collection
from datetime import datetime
router = APIRouter()

UPLOAD_DIR = "storage/documents"

class SummarizeRequest(BaseModel):
    user_id: str
    filename: str

@router.post("/summarize")
def summarize_document(request: SummarizeRequest):
    file_path = os.path.join(UPLOAD_DIR, request.user_id, request.filename)

    if not os.path.exists(file_path):
        return {"success": False, "message": "File not found"}

    summary = summarize_pdf(file_path)
    print("INSERTING SUMMARY:", request.user_id, request.filename)
    summary_collection.insert_one({
    "user_id": request.user_id,
    "summary": summary,
    "document_name": request.filename,
    "timestamp": datetime.utcnow()
})
    return {
        "success": True,
        "summary": summary
    }