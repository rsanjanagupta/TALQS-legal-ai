from fastapi import APIRouter

router = APIRouter()

@router.post("/auth/google")
def google_auth(user: dict):
    return {"user_id": user.get("google_id")}