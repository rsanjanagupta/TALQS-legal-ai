from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

MODEL_NAME = "google/flan-t5-base"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)


def generate_answer(question: str, context: str):

    prompt = f"""
You are a legal assistant.

Using ONLY the provided context, answer the question clearly.

If the question asks about the main issue of the case,
identify the specific legal question the court was deciding.

Do NOT summarize the entire judgment.
Do NOT include dramatic language.
Answer in 2-4 clear sentences.

Context:
{context}

Question:
{question}

Answer:
"""

    inputs = tokenizer(
        prompt,
        return_tensors="pt",
        truncation=True,
        max_length=1024
    )

    input_ids = inputs["input_ids"].to(device)
    attention_mask = inputs["attention_mask"].to(device)

    outputs = model.generate(
        input_ids=input_ids,
        attention_mask=attention_mask,
        max_length=256,
        min_length=80,
        num_beams=4,
        early_stopping=True,
        no_repeat_ngram_size=3
    )

    answer = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return answer.strip()
