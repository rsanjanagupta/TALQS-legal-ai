import faiss
import numpy as np
import os

INDEX_PATH = "storage/faiss_index.bin"
DIMENSION = 384  # must match embedding size

# Load existing index if exists
if os.path.exists(INDEX_PATH):
    index = faiss.read_index(INDEX_PATH)
else:
    index = faiss.IndexFlatL2(DIMENSION)


def store_embeddings(embeddings):
    print("DEBUG: store_embeddings called")

    vectors = np.array(embeddings).astype("float32")
    print("DEBUG: vector shape =", vectors.shape)

    index.add(vectors)
    print("DEBUG: vectors added to index")

    faiss.write_index(index, INDEX_PATH)
    print("DEBUG: FAISS index written to disk at", INDEX_PATH)

    """
    Adds embeddings to FAISS index and saves it.
    """
    vectors = np.array(embeddings).astype("float32")
    index.add(vectors)

    # Save index to disk
    faiss.write_index(index, INDEX_PATH)
