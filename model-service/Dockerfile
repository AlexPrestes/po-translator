# Use uma imagem base oficial do PyTorch que já vem com CUDA e cuDNN
FROM pytorch/pytorch:2.2.0-cuda12.1-cudnn8-runtime

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copie o arquivo de requisitos ANTES de instalar
COPY requirements.txt .

# Instale as dependências, USANDO O ÍNDICE ESPECÍFICO DO PYTORCH PARA CUDA
# Esta linha é crucial para encontrar torch==2.2.0+cu121
RUN pip install --no-cache-dir -r requirements.txt --index-url https://download.pytorch.org/whl/cu121 --extra-index-url https://pypi.org/simple

# Copie o restante do código da sua aplicação (após a instalação das dependências)
COPY . .

# Exponha a porta que o FastAPI/Flask usa (usando 8001 para consistência com o que já havíamos configurado)
EXPOSE 8000

# Comando para rodar a aplicação usando Uvicorn
# Ajustei para "app:app" que é o mais comum, assumindo que seu app principal está em app.py e se chama 'app'
# Se o seu arquivo principal for `main.py` dentro de uma pasta `app` (ex: `app/main.py`),
# então o comando correto seria `app.main:app` ou ajuste o COPY para copiar `app` para `/app` corretamente.
# No exemplo estou supondo que o arquivo principal é `app.py` no raiz de `/app`.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
