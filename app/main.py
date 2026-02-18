from fastapi import FastAPI
from app.routes import upload

app = FastAPI()

app.include_router(upload.router)

@app.get("/")
def read_root():
    return {"message": "TALQS backend is running"}
