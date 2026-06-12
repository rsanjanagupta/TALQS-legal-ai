from fastapi import APIRouter, UploadFile, File, Form
import os
import shutil
import re

from app.services.extractor import extract_pages_from_pdf
from app.services.embedder import generate_embeddings
from app.services.vector_store import store_embeddings, reset_vector_store
import app.services.vector_store as vector_store

router = APIRouter()

UPLOAD_DIR = "storage/documents"
INDEX_DIR = "storage/indexes"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(INDEX_DIR, exist_ok=True)


def clean_text(text: str):
    text = text.replace("\n", " ")
    text = re.sub(r'\s+', ' ', text)
    text = text.replace('\\"', '"')
    return text.strip()


def create_chunks_from_pages(pages, sentences_per_chunk=5):
    chunks = []
    chunk_pages = []

    for page in pages:
        page_number = page["page"]
        page_text = page["text"]
        cleaned_page = clean_text(page_text)
        sentences = re.split(r'(?<=[.!?]) +', cleaned_page)

        for i in range(0, len(sentences), sentences_per_chunk):
            chunk = " ".join(sentences[i:i + sentences_per_chunk]).strip()
            if chunk:
                chunks.append(chunk)
                chunk_pages.append(page_number)

    return chunks, chunk_pages


@router.post("/upload")
async def upload_document(
    user_id: str = Form(...),
    file: UploadFile = File(...)
):
    print("DEBUG upload user_id:", user_id)
    print("DEBUG filename:", file.filename)
    print("INDEX FILE EXISTS AFTER SAVE:",
      os.path.exists(get_index_path(user_id)))

    print("METADATA FILE EXISTS AFTER SAVE:",
      os.path.exists(get_metadata_path(user_id)))
    # Create user-specific folders
    user_doc_folder = os.path.join(UPLOAD_DIR, user_id)
    user_index_folder = os.path.join(INDEX_DIR, user_id)

    os.makedirs(user_doc_folder, exist_ok=True)
    os.makedirs(user_index_folder, exist_ok=True)

    file_path = os.path.join(user_doc_folder, file.filename)

    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print("DEBUG file saved to:", file_path)

    # Extract pages
    pages = extract_pages_from_pdf(file_path)

    # Create chunks
    chunks, chunk_pages = create_chunks_from_pages(pages)

    # Generate embeddings
    embeddings = generate_embeddings(chunks)

    metadata = []
    for i, chunk in enumerate(chunks):
        metadata.append({
            "document": file.filename,
            "page": chunk_pages[i],
            "chunk_text": chunk,
            "user_id": user_id
        })

    # Reset and store
    reset_vector_store(user_id)
    store_embeddings(embeddings, metadata, user_id)

    return {
        "success": True,
        "message": f"{file.filename} uploaded and indexed successfully",
        "filename": file.filename,
        "total_pages": len(pages),
        "chunks_created": len(chunks)
    }


@router.get("/status/{user_id}")
def document_status(user_id: str):
    return {
        "user_id": user_id,
        "document_loaded": len(vector_store.metadata_store) > 0
    }


@router.delete("/reset/{user_id}")
def reset_document(user_id: str):
    reset_vector_store(user_id)
    return {
        "success": True,
        "message": "User document index cleared successfully"
    }

@router.get("/debug/{user_id}")
def debug(user_id: str):
    return {
        "index_exists": os.path.exists(get_index_path(user_id)),
        "metadata_exists": os.path.exists(get_metadata_path(user_id)),
        "index_path": get_index_path(user_id),
        "metadata_path": get_metadata_path(user_id)
    }