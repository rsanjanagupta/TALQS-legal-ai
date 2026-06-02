from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload, qa,summarize,auth,history
import os

os.makedirs("storage", exist_ok=True)
os.makedirs("storage/documents", exist_ok=True)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "http://localhost:5173",
    "https://talqs-legal-ai.vercel.app",
]  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(qa.router)
app.include_router(summarize.router)
app.include_router(auth.router)
app.include_router(history.router)

@app.get("/")
def read_root():
    return {"message": "TALQS backend is running"}

@app.get("/test")
def test():
    return {"message": "TALQS server is working"}

