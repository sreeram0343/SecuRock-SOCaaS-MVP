FROM python:3.9-slim

WORKDIR /app

COPY ./detection_service/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY ./shared /app/shared
RUN touch /app/shared/__init__.py

COPY ./detection_service /app/detection_service
RUN touch /app/detection_service/__init__.py

CMD ["python", "-u", "-m", "detection_service.main"]
