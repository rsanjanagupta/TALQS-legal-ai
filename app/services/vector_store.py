import os
import json
import numpy as np
import faiss

INDEX_PATH = "storage/faiss_index.bin"
METADATA_PATH = "storage/metadata.json"

# 🔹 Global state
index = None
metadata_store = []


# 🔹 Load existing index on startup
def load_index():
    global index, metadata_store

    if os.path.exists(INDEX_PATH):
        index = faiss.read_index(INDEX_PATH)
    else:
        index = None

    if os.path.exists(METADATA_PATH):
        with open(METADATA_PATH, "r", encoding="utf-8") as f:
            metadata_store = json.load(f)
    else:
        metadata_store = []


# 🔹 Store embeddings (overwrite mode)
def store_embeddings(embeddings, metadata):

    global index, metadata_store

    print("DEBUG: store_embeddings called")

    # 1️⃣ Reset existing files
    if os.path.exists(INDEX_PATH):
        os.remove(INDEX_PATH)

    if os.path.exists(METADATA_PATH):
        os.remove(METADATA_PATH)

    # 2️⃣ Convert embeddings to numpy
    vectors = np.array(embeddings).astype("float32")
    dimension = vectors.shape[1]

    print("DEBUG: vector shape =", vectors.shape)

    # 3️⃣ Create new FAISS index
    index = faiss.IndexFlatL2(dimension)
    index.add(vectors)

    print("DEBUG: vectors added to index")

    # 4️⃣ Save index
    faiss.write_index(index, INDEX_PATH)
    print("DEBUG: FAISS index written")

    # 5️⃣ Save metadata
    metadata_store = metadata
    with open(METADATA_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata_store, f, indent=2)

    print("DEBUG: metadata saved")


# 🔹 Reset entire vector store
def reset_vector_store():
    global index, metadata_store

    if os.path.exists(INDEX_PATH):
        os.remove(INDEX_PATH)

    if os.path.exists(METADATA_PATH):
        os.remove(METADATA_PATH)

    index = None
    metadata_store = []

    print("DEBUG: vector store reset")

load_index()
