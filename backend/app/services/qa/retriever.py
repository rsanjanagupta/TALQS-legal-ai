import os
import json
import numpy as np
import faiss
from app.services.embedder import generate_embeddings

BASE_INDEX_DIR = "storage/indexes"
BASE_METADATA_DIR = "storage/metadata"

def get_index_path(user_id):
    return os.path.join(BASE_INDEX_DIR, user_id, "faiss_index.bin")

def get_metadata_path(user_id):
    return os.path.join(BASE_METADATA_DIR, user_id, "metadata.json")
    
def retrieve_relevant_chunks(question: str, user_id: str, top_k: int = 3):

    index_path = get_index_path(user_id)
    metadata_path = get_metadata_path(user_id)

    print("RETRIEVER USER ID =", user_id)
    print("INDEX PATH =", index_path)
    print("INDEX EXISTS =", os.path.exists(index_path))
    print("METADATA PATH =", metadata_path)
    print("METADATA EXISTS =", os.path.exists(metadata_path))

    if not os.path.exists(index_path):
        raise ValueError("FAISS index not found. Upload documents first.")

    index = faiss.read_index(index_path)

    question_embedding = generate_embeddings([question])
    question_vector = np.array(question_embedding).astype("float32")

    distances, indices = index.search(question_vector, top_k)

    if not os.path.exists(metadata_path):
        raise ValueError("Metadata not found.")

    with open(metadata_path, "r", encoding="utf-8") as f:
        metadata = json.load(f)

    results = []
    for idx in indices[0]:
        if idx < len(metadata):
            results.append(metadata[idx])

    return results