# EcoGuard-ML Core: Production Deployment Guide

This guide outlines recommendations and workflows for containerizing and deploying the **EcoGuard-ML Core** platform to staging or production environments.

---

## 1. Containerization (Docker)

To ensure reproducibility across cloud environments, containerize the FastAPI backend and mount precompiled frontend assets.

### Backend `Dockerfile` Example
Create a `Dockerfile` in the `backend/` folder:
```dockerfile
# Use a slim Python 3.13 image
FROM python:3.13-slim

# Set working directory
WORKDIR /app

# Install system dependencies (e.g., for scikit-learn/numpy compilation)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY app/ app/

# Expose FastAPI port
EXPOSE 8001

# Command to run under Gunicorn with Uvicorn workers
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8001", "app.main:app"]
```

---

## 2. Production Process Manager (Gunicorn + Uvicorn)

For local development, `uvicorn app.main:app --reload` is sufficient. In production, run Uvicorn behind a process manager like **Gunicorn** to handle concurrency:
*   **Worker Class:** `uvicorn.workers.UvicornWorker`
*   **Workers Count:** Calculated using $(2 \times \text{number of CPU cores}) + 1$.
*   **Gunicorn Run Command:**
    ```bash
    gunicorn -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8001 app.main:app
    ```

---

## 3. Environment Variable Configuration

Create a `.env` file in production containing:
```ini
LOG_LEVEL=info
HOST=0.0.0.0
PORT=8001
ALLOWED_ORIGINS=https://your-dashboard-domain.com
```

---

## 4. Production Security Review

### CORS Wildcard Mitigation
In development, the API uses a wildcard configuration (`allow_origins=["*"]`) in `backend/app/main.py`. 
*   **Production Fix:** Modify the CORS setup to load allowed origins dynamically from an environment variable:
    ```python
    import os
    from fastapi.middleware.cors import CORSMiddleware

    allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    ```

### Input Validation Constraints
Keep Pydantic bounds strict (as defined in [schemas.py](file:///c:/Users/ADMIN/OneDrive/Desktop/ecogaurd_ml/backend/app/schemas/schemas.py)) to prevent SQL injection or buffer overflow vectors through `/predict` endpoints.
