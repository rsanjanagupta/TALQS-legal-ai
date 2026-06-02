# TALQS-legal-ai
## Setup Instructions

1. Create virtual environment:
   python -m venv venv
   source venv/bin/activate

2. Install dependencies:
   pip install -r requirements.txt

3. Run server:
   uvicorn app.main:app --reload

Note:
- storage folder and metadata.json will be auto-created on first upload.
