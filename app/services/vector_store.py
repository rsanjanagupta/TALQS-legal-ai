import os
import json
import numpy as np
import faiss

INDEX_PATH = "storage/faiss_index.bin"
METADATA_PATH = "storage/metadata.json"


def store_embeddings(embeddings, metadata):

    print("DEBUG: store_embeddings called")

    # 🔥 1️⃣ Always reset index and metadata
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
    with open(METADATA_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print("DEBUG: metadata saved")
