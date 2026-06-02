from fastapi import APIRouter
from app.database import qa_collection, summary_collection

router = APIRouter()


@router.get("/qa/history/{user_id}")
def get_qa_history(user_id: str):
    data = list(qa_collection.find({"user_id": user_id}, {"_id": 0}))
    for item in data:
        item["timestamp"] = str(item["timestamp"])
    return {
        "count": len(data),
        "history": data
    }


@router.get("/summaries/history/{user_id}")
def get_summary_history(user_id: str):
    data = list(summary_collection.find({"user_id": user_id}, {"_id": 0}))
    for item in data:
        item["timestamp"] = str(item["timestamp"])
    return {
        "count": len(data),
        "summaries": data
    }