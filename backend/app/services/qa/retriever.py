import os
import json
import numpy as np
import faiss
from app.services.embedder import generate_embeddings

INDEX_PATH = "storage/faiss_index.bin"
METADATA_PATH = "storage/metadata.json"


def retrieve_relevant_chunks(question: str, top_k: int = 3):

    if not os.path.exists(INDEX_PATH):
        raise ValueError("FAISS index not found. Upload documents first.")

    # Load index dynamically
    index = faiss.read_index(INDEX_PATH)

    # Embed question
    question_embedding = generate_embeddings([question])
    question_vector = np.array(question_embedding).astype("float32")

    # Search
    distances, indices = index.search(question_vector, top_k)

    if not os.path.exists(METADATA_PATH):
        raise ValueError("Metadata not found.")

    with open(METADATA_PATH, "r", encoding="utf-8") as f:
        metadata = json.load(f)

    results = []
    for idx in indices[0]:
        if idx < len(metadata):
            results.append(metadata[idx])

    return results
