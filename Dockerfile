# Build Stage
FROM python:3.9-slim as builder

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Runtime Stage
FROM python:3.9-slim

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Copy Code
COPY . .

# Environment Variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Expose Port
EXPOSE 8000

# Run Command
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
