from sentence_transformers import SentenceTransformer

# Load model once (very important)
model = SentenceTransformer("all-MiniLM-L6-v2")

def generate_embeddings(chunks):
    """
    Takes list of text chunks
    Returns numpy array of embeddings
    """
    embeddings = model.encode(chunks)
    return embeddings
