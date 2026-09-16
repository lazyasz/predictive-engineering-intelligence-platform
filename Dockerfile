# =========================================================
# Stage 1: Build Frontend (Node.js)
# =========================================================
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --silent || npm install --silent
COPY frontend/ ./
RUN npm run build

# =========================================================
# Stage 2: Install Python Dependencies
# =========================================================
FROM python:3.11-slim AS python-builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# =========================================================
# Stage 3: Unified Production Runtime
# =========================================================
FROM python:3.11-slim AS runner
WORKDIR /app

# Copy Python packages
COPY --from=python-builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Copy Backend, ML Engine, Lakehouse, and Compiled Frontend SPA
COPY backend /app/backend
COPY ml_engine /app/ml_engine
COPY data/lakehouse/gold /app/data/lakehouse/gold
COPY data/lakehouse/audit /app/data/lakehouse/audit
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Environment configuration
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV ENVIRONMENT=production

EXPOSE 8000

# Start command handles Render $PORT dynamically or defaults to 8000
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]

