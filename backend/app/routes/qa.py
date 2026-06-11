from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.qa.retriever import retrieve_relevant_chunks
from app.services.qa.generator import generate_answer
from app.database import qa_collection
from datetime import datetime

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str
    user_id: str
    document_name: str = None


@router.post("/ask")
async def ask_question(request: QuestionRequest):

    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    try:
        print("ASK USER ID =", request.user_id)
        print("DOCUMENT =", request.document_name)
        retrieved_chunks = retrieve_relevant_chunks(
            request.question,
            request.user_id
)
        context = "\n\n".join([chunk["chunk_text"] for chunk in retrieved_chunks])

        answer = generate_answer(request.question, context)

        pages = list(set([chunk["page"] for chunk in retrieved_chunks]))
        print("INSERTING QA:", request.user_id, request.question)
        qa_collection.insert_one({
        "user_id": request.user_id,
        "question": request.question,
        "answer": answer,
        "pages": pages,
        "document_name": request.document_name,
        "timestamp": datetime.utcnow()
    })

        return {
            "answer": answer,
            "pages": pages
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
