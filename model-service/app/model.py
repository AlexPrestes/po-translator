import torch
from transformers import pipeline

# Verifica se a GPU está disponível e define o device
device = 0 if torch.cuda.is_available() else -1
print(f"Usando device: {'GPU' if device == 0 else 'CPU'}")

# Carrega o pipeline de tradução
translator = pipeline("translation", model="Helsinki-NLP/opus-mt-tc-big-en-pt", device=device)

def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    result = translator(text)
    return result[0]['translation_text']

