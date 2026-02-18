from fastapi import FastAPI
from app.routes import upload, qa

app = FastAPI()

app.include_router(upload.router)
app.include_router(qa.router)


@app.get("/")
def read_root():
    return {"message": "TALQS backend is running"}
