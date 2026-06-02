import os
import torch
from transformers import LEDTokenizer, LEDForConditionalGeneration
from app.services.extractor import extract_pages_from_pdf

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model_path = "storage/legal_led_model"

tokenizer = LEDTokenizer.from_pretrained(model_path)
model = LEDForConditionalGeneration.from_pretrained(model_path)
model.to(device)
model.eval()

max_input_length = 4096

def summarize_pdf(file_path):
    """
    Complete pipeline:
    1. Extract text from PDF
    2. Save extracted text
    3. Generate LED summary
    4. Save summary
    5. Return summary
    """

    filename = os.path.splitext(os.path.basename(file_path))[0]

    # 1️⃣ Extract page-level text
    pages = extract_pages_from_pdf(file_path)

    # 2️⃣ Combine full text
    full_text = ""
    for page_data in pages:
        full_text += page_data["text"] + "\n"

    # 3️⃣ Save extracted text
    os.makedirs("storage", exist_ok=True)

    text_output_path = os.path.join("storage", f"{filename}.txt")
    with open(text_output_path, "w", encoding="utf-8") as text_file:
        text_file.write(full_text)

    # 4️⃣ Generate summary
    with torch.no_grad():

        inputs = tokenizer(
            full_text,
            return_tensors="pt",
            max_length=max_input_length,
            truncation=True
        )

        input_ids = inputs["input_ids"].to(device)
        attention_mask = inputs["attention_mask"].to(device)

        global_attention_mask = torch.zeros_like(input_ids)
        global_attention_mask[:, 0] = 1

        summary_ids = model.generate(
            input_ids=input_ids,
            attention_mask=attention_mask,
            global_attention_mask=global_attention_mask,
            max_length=450,
            min_length=200,
            num_beams=6,
            length_penalty=1.2,
            no_repeat_ngram_size=4,
            repetition_penalty=2.0,
            early_stopping=True
        )

        summary = tokenizer.decode(
            summary_ids[0],
            skip_special_tokens=True
        )

    # 5️⃣ Save summary
    summary_output_path = os.path.join("storage", f"{filename}_summary.txt")
    with open(summary_output_path, "w", encoding="utf-8") as summary_file:
        summary_file.write(summary)

    return summary