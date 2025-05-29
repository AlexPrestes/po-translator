from pydantic import BaseModel

class TranslationRequest(BaseModel):
    source_text: str
    source_lang: str
    target_lang: str

class TranslationResponse(BaseModel):
    translated_text: str

