import fitz  # PyMuPDF

def extract_pages_from_pdf(file_path: str):
    """
    Extracts text page-by-page.
    Returns a list of dictionaries:
    [
        {"page": 1, "text": "..."},
        {"page": 2, "text": "..."}
    ]
    """

    doc = fitz.open(file_path)
    pages = []

    for page_number, page in enumerate(doc, start=1):
        text = page.get_text()
        pages.append({
            "page": page_number,
            "text": text
        })

    doc.close()
    return pages
