import os
import json
from app.services.extractor import extract_pages_from_pdf
from app.services.chunker import create_chunks
from app.services.embedder import generate_embeddings
from app.services.vector_store import store_embeddings


def run_ingestion(file_path: str, filename: str):
    """
    Complete ingestion pipeline:
    - Extract pages
    - Save full text
    - Chunk per page
    - Generate embeddings
    - Store in FAISS
    - Persist metadata
    """

    # 1️⃣ Extract page-level text
    pages = extract_pages_from_pdf(file_path)

    # 2️⃣ Save full combined text (for summarizer)
    full_text = ""
    for page_data in pages:
        full_text += page_data["text"] + "\n"

    text_output_path = os.path.join("storage", f"{filename}.txt")
    with open(text_output_path, "w", encoding="utf-8") as text_file:
        text_file.write(full_text)

    # 3️⃣ Chunk per page and attach metadata
    all_chunks = []

    for page_data in pages:
        page_number = page_data["page"]
        page_text = page_data["text"]

        chunks = create_chunks(page_text)

        for chunk in chunks:
            all_chunks.append({
                "document": filename,
                "page": page_number,
                "chunk_text": chunk
            })

    # 4️⃣ Generate embeddings
    texts = [item["chunk_text"] for item in all_chunks]
    embeddings = generate_embeddings(texts)

    # 5️⃣ Store in FAISS
    store_embeddings(embeddings)

    # 6️⃣ Save metadata mapping
    metadata_path = os.path.join("storage", "metadata.json")

    if os.path.exists(metadata_path) and os.path.getsize(metadata_path) > 0:
        with open(metadata_path, "r", encoding="utf-8") as f:
            metadata = json.load(f)
    else:
        metadata = []

    metadata.extend(all_chunks)

    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    return len(all_chunks)
