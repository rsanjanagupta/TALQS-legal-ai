from fastapi import APIRouter, UploadFile, File
import os
import shutil
from app.services.pipeline import run_ingestion

router = APIRouter()

UPLOAD_DIR = "storage/documents"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save uploaded PDF
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run ingestion pipeline
    chunk_count = run_ingestion(file_path, file.filename)

    return {
        "message": f"{file.filename} uploaded and processed successfully",
        "chunks_created": chunk_count
    }
