FROM python:3.10

WORKDIR /app

COPY requirements.txt .
RUN pip install --default-timeout=1000 --no-cache-dir -r requirements.txt

COPY . .

WORKDIR /app/backend

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "7860"]