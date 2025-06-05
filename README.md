# po-translator
Editor e Tradutor de arquivos .po e .pot

Na versão atual o modelo usado para tradução esta fixado no código (model-service/app/model.py), sendo o modelo de tradução (Helsinki-NLP/opus-mt-tc-big-en-pt)[https://huggingface.co/Helsinki-NLP/opus-mt-tc-big-en-pt].

## Futuro (não necessariamente na ordem)
- Facilitar a mudança de modelos na interface do usuário;
- Incoporar API da OpenAI, Google e DeepL (mais utilizadas);
- implementar pipeline para fine-tune de modelos locais, para uma tradução mais coesa;
- implementar a utilização de mais tipos de arquivos.
