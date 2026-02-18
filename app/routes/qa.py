from fastapi import APIRouter
from pydantic import BaseModel
from app.services.qa.retriever import retrieve_relevant_chunks
from app.services.qa.generator import generate_answer

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str


@router.post("/ask")
async def ask_question(request: QuestionRequest):

    # 1️⃣ Retrieve context
    retrieved_chunks = retrieve_relevant_chunks(request.question, top_k=3)

    # 2️⃣ Build context string
    context = ""

    for i, chunk in enumerate(retrieved_chunks, 1):
        context += f"Source {i} (Page {chunk['page']}):\n"
        context += chunk["chunk_text"].strip() + "\n\n"


    # 3️⃣ Generate answer
    answer = generate_answer(request.question, context)

    # 4️⃣ Extract unique sources
    sources = []
    seen = set()

    for chunk in retrieved_chunks:
        key = (chunk["document"], chunk["page"])
        if key not in seen:
            seen.add(key)
            sources.append({
                "document": chunk["document"],
                "page": chunk["page"]
            })

    return {
        "question": request.question,
        "answer": answer,
        "sources": sources,
        "confidence": "medium"
    }
