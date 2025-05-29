from fastapi import FastAPI
from app.schemas import TranslationRequest, TranslationResponse
from app.model import translate_text

app = FastAPI(title="Model Service")

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/translate", response_model=TranslationResponse)
def translate(request: TranslationRequest):
    translated = translate_text(
        text=request.source_text,
        source_lang=request.source_lang,
        target_lang=request.target_lang
    )
    return {"translated_text": translated}

