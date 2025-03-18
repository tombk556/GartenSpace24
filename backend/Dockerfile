FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip
RUN pip install  -r requirements.txt

COPY app/ /app/app

EXPOSE 8000

COPY .env .env
COPY google-credentials.json google-credentials.json

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
