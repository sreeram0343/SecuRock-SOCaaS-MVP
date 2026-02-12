FROM python:3.9-slim

WORKDIR /app

COPY ./alert_service/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY ./shared /app/shared
RUN touch /app/shared/__init__.py

COPY ./alert_service /app/alert_service
RUN touch /app/alert_service/__init__.py

CMD ["uvicorn", "alert_service.main:app", "--host", "0.0.0.0", "--port", "8000"]
