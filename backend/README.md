# EcoGuard-ML Core API Platform

This directory contains the production-ready FastAPI backend and model-serving layer for **EcoGuard-ML Core**.

---

## 1. Directory Structure

```text
backend/
├── app/
│   ├── main.py                 # Application startup, middlewares, custom errors
│   ├── config.py               # Environment configuration settings
│   ├── models/                 # Model schema markers
│   ├── services/
│   │   ├── prediction_service.py   # XGBoost loading and feature preprocessing
│   │   └── data_service.py         # CSV file reader and mapper
│   ├── routes/
│   │   ├── api.py              # REST API endpoints (/health, /predict, etc.)
│   │   └── views.py            # Static views router
│   ├── schemas/
│   │   └── schemas.py          # Pydantic validation schemas
│   ├── static/
│   │   └── index.html          # Glassmorphic user interface dashboard
│   └── utils/
│
├── requirements.txt            # Package dependencies
└── .env.example                # Config environment template
```

---

## 2. Dependencies Setup

To install all backend dependencies inside your virtual environment, run:

```bash
pip install -r backend/requirements.txt
```

---

## 3. Configuration Settings

Create a `.env` file under the `backend/` folder (or copy from `.env.example`). Standard parameters:

```env
# Server details
HOST=0.0.0.0
PORT=8001

# Model weights file
MODEL_PATH=models/poaching_risk_model.pkl

# Logger level
LOG_LEVEL=info
```

---

## 4. Startup Instructions

To start the local Uvicorn FastAPI server, run:

```bash
python backend/app/main.py
```

Or run via Uvicorn CLI directly from the root workspace folder:

```bash
uvicorn backend.app.main:app --host 0.0.0.0 --port 8001
```

Once running, access the services:
*   **Web Dashboard**: `http://localhost:8001/` (Glassmorphic cards interface)
*   **Interactive API Docs (Swagger UI)**: `http://localhost:8001/docs`
*   **Alternative API Docs (ReDoc)**: `http://localhost:8001/redoc`

---

## 5. API Endpoints Reference

### Health check
*   **`GET /health`** -> Returns status indicator (`{"status": "healthy"}`).

### Threat Predictions
*   **`POST /predict`** -> Run active poaching threat inference using the loaded XGBoost model.
    *   *Input Request Schema* (`PredictRequest`): Accepts user-friendly parameters (`hour`, `month`, `season`, `species`, coordinates, weather metrics). The backend automatically encodes cyclical sin/cos attributes and one-hot categoricals.
    *   *Response Schema* (`PredictResponse`): Returns `risk_probability` (float 0.0-1.0) and `risk_level` ("High", "Medium", "Low").

### Intelligence Reports
*   **`GET /zones/high-risk`** -> Returns list of high risk zones (`high_risk_zones.csv`).
*   **`GET /hotspots`** -> Returns list of DBSCAN incident threat clusters (`high_risk_clusters.csv`).
*   **`GET /patrols`** -> Returns optimized ranger patrol schedules (`patrol_plan.csv`).
*   **`GET /forecast`** -> Returns binned 30-day ahead Prophet forecasts (`forecast_patrol_recommendations.csv`).
*   **`GET /alerts`** -> Returns sensor warning indicators (`warning_alerts.csv`).

---

## 6. Testing Instructions

To run automated checks verifying execution of all REST API routes and the custom Pydantic validator/exception handlers, run the validation script:

```bash
python .system_generated/tasks/../scratch/test_api_endpoints.py
```

*Note: The script spawns the server on port 8001, performs requests, checks status codes, and kills the subprocess cleanly.*
