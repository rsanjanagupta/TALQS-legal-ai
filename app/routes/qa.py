from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.qa.retriever import retrieve_relevant_chunks
from app.services.qa.generator import generate_answer

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str


@router.post("/ask")
async def ask_question(request: QuestionRequest):

    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    try:
        retrieved_chunks = retrieve_relevant_chunks(request.question)

        context = "\n\n".join([chunk["chunk_text"] for chunk in retrieved_chunks])

        answer = generate_answer(request.question, context)

        pages = list(set([chunk["page"] for chunk in retrieved_chunks]))

        return {
            "answer": answer,
            "pages": pages
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
