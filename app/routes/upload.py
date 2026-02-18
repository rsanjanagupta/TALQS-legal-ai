from fastapi import APIRouter, UploadFile, File
import os
import shutil
import re

from app.services.extractor import extract_pages_from_pdf
from app.services.embedder import generate_embeddings
from app.services.vector_store import store_embeddings

router = APIRouter()

UPLOAD_DIR = "storage/documents"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# 🔹 Clean extracted text
def clean_text(text: str):
    text = text.replace("\n", " ")
    text = re.sub(r'\s+', ' ', text)
    text = text.replace('\\"', '"')
    return text.strip()


# 🔹 Sentence-based chunking (FIXED VERSION)
def create_chunks_from_pages(pages, sentences_per_chunk=5):

    chunks = []
    chunk_pages = []

    for page in pages:
        page_number = page["page"]      # ✅ correct extraction
        page_text = page["text"]        # ✅ correct extraction

        cleaned_page = clean_text(page_text)

        # Split into sentences
        sentences = re.split(r'(?<=[.!?]) +', cleaned_page)

        for i in range(0, len(sentences), sentences_per_chunk):
            chunk = " ".join(sentences[i:i + sentences_per_chunk]).strip()

            if chunk:
                chunks.append(chunk)
                chunk_pages.append(page_number)

    return chunks, chunk_pages


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):

    # 🔹 Save uploaded file
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 🔹 Extract pages (returns list of dicts)
    pages = extract_pages_from_pdf(file_path)

    # 🔹 Create clean chunks
    chunks, chunk_pages = create_chunks_from_pages(pages)

    # 🔹 Generate embeddings
    embeddings = generate_embeddings(chunks)

    # 🔹 Prepare metadata aligned with chunks
    metadata = []

    for i, chunk in enumerate(chunks):
        metadata.append({
            "document": file.filename,
            "page": chunk_pages[i],
            "chunk_text": chunk
        })

    # 🔹 Store (resets index each upload)
    store_embeddings(embeddings, metadata)

    return {
        "message": f"{file.filename} uploaded and processed successfully",
        "total_pages": len(pages),
        "chunks_created": len(chunks)
    }
