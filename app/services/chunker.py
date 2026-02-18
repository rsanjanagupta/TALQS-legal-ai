import re

def split_into_sentences(text: str):
    """
    Splits text into sentences using regex.
    This is lightweight and good enough for legal text.
    """
    # Split at punctuation followed by space
    sentences = re.split(r'(?<=[.!?])\s+', text)
    return sentences


def create_chunks(text: str, max_chars: int = 1000, overlap: int = 200):
    """
    Creates sentence-aware chunks with overlap.
    """

    sentences = split_into_sentences(text)

    chunks = []
    current_chunk = ""

    for sentence in sentences:

        # If adding this sentence exceeds limit → save current chunk
        if len(current_chunk) + len(sentence) > max_chars:
            chunks.append(current_chunk.strip())

            # Create overlap
            current_chunk = current_chunk[-overlap:] + " "

        current_chunk += sentence + " "

    # Add final chunk
    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks
