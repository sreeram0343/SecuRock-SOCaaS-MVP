FROM python:3.9-slim

WORKDIR /app

COPY ./ingestion_service/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY ./shared /app/shared
RUN touch /app/shared/__init__.py

COPY ./ingestion_service /app/ingestion_service
RUN touch /app/ingestion_service/__init__.py

CMD ["uvicorn", "ingestion_service.main:app", "--host", "0.0.0.0", "--port", "8000"]
