from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload, qa


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(qa.router)

@app.get("/")
def read_root():
    return {"message": "TALQS backend is running"}
