FROM python:3.9-slim

WORKDIR /app

COPY ./auth_service/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY ./shared /app/shared
# Create an __init__.py in shared if it doesn't exist, though copying folder keeps structure
RUN touch /app/shared/__init__.py

COPY ./auth_service /app/auth_service
RUN touch /app/auth_service/__init__.py

CMD ["uvicorn", "auth_service.main:app", "--host", "0.0.0.0", "--port", "8000"]
