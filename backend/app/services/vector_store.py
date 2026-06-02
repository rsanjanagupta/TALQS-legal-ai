import os
import json
import numpy as np
import faiss

BASE_INDEX_DIR = "storage/indexes"
BASE_METADATA_DIR = "storage/metadata"

# 🔹 Global state (per user)
index = None
metadata_store = []


def get_index_path(user_id: str):
    return os.path.join(BASE_INDEX_DIR, user_id, "faiss_index.bin")

def get_metadata_path(user_id: str):
    return os.path.join(BASE_METADATA_DIR, user_id, "metadata.json")


# 🔹 Load existing index on startup for a user
def load_index(user_id: str):
    global index, metadata_store

    index_path = get_index_path(user_id)
    metadata_path = get_metadata_path(user_id)

    if os.path.exists(index_path):
        index = faiss.read_index(index_path)
    else:
        index = None

    if os.path.exists(metadata_path):
        with open(metadata_path, "r", encoding="utf-8") as f:
            metadata_store = json.load(f)
    else:
        metadata_store = []


# 🔹 Store embeddings (overwrite mode)
def store_embeddings(embeddings, metadata, user_id: str):
    global index, metadata_store

    print("DEBUG: store_embeddings called")

    index_path = get_index_path(user_id)
    metadata_path = get_metadata_path(user_id)

    # Make sure folders exist
    os.makedirs(os.path.dirname(index_path), exist_ok=True)
    os.makedirs(os.path.dirname(metadata_path), exist_ok=True)

    # 1️⃣ Reset existing files
    if os.path.exists(index_path):
        os.remove(index_path)
    if os.path.exists(metadata_path):
        os.remove(metadata_path)

    # 2️⃣ Convert embeddings to numpy
    vectors = np.array(embeddings).astype("float32")
    dimension = vectors.shape[1]
    print("DEBUG: vector shape =", vectors.shape)

    # 3️⃣ Create new FAISS index
    index = faiss.IndexFlatL2(dimension)
    index.add(vectors)
    print("DEBUG: vectors added to index")

    # 4️⃣ Save index
    faiss.write_index(index, index_path)
    print("DEBUG: FAISS index written")

    # 5️⃣ Save metadata
    metadata_store = metadata
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata_store, f, indent=2)

    print("DEBUG: metadata saved")


# 🔹 Reset vector store for a specific user
def reset_vector_store(user_id: str):
    global index, metadata_store

    index_path = get_index_path(user_id)
    metadata_path = get_metadata_path(user_id)

    if os.path.exists(index_path):
        os.remove(index_path)
    if os.path.exists(metadata_path):
        os.remove(metadata_path)

    index = None
    metadata_store = []

    print(f"DEBUG: vector store reset for user {user_id}")