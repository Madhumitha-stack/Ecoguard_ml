# Installation & Local Setup Guide

This guide provides step-by-step instructions for setting up the **EcoGuard-ML Core** platform development environment on Windows, macOS, or Linux.

---

## 1. System Prerequisites

Before starting, ensure your host machine has the following tools installed:
*   **Python:** Version 3.12 or 3.13. Check version using: `python --version`
*   **Node.js & npm:** Node v18+ and npm v9+. Check using: `node -v` and `npm -v`
*   **Git:** Check using: `git --version`

---

## 2. Repository Setup

Clone the repository to your local workstation:
```bash
git clone https://github.com/Madhumitha-stack/ecoguard_ml.git
cd ecoguard_ml
```

---

## 3. Backend (FastAPI) Installation & Execution

The backend acts as the gateway to serve machine learning predictions, system logs, and aggregated metrics.

### Step 1: Navigate and Create Virtual Environment
```bash
cd backend
python -m venv .venv
```

### Step 2: Activate the Virtual Environment
*   **Windows (PowerShell):**
    ```powershell
    .venv\Scripts\Activate.ps1
    ```
*   **Windows (CMD):**
    ```cmd
    .venv\Scripts\activate.bat
    ```
*   **macOS / Linux:**
    ```bash
    source .venv/bin/activate
    ```

### Step 3: Install Required Dependencies
Ensure you have the latest pip version:
```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Step 4: Environment Variables Setup
Duplicate the `.env.example` file to create your local configurations:
*   **Windows:**
    ```cmd
    copy .env.example .env
    ```
*   **macOS / Linux:**
    ```bash
    cp .env.example .env
    ```

### Step 5: Start the Development Server
Execute the application entry point:
```bash
python app/main.py
```
By default, the server spins up on **`http://127.0.0.1:8001`**. You can verify that the server is active by opening a web browser and visiting `http://127.0.0.1:8001/docs` to view the Swagger UI API documentation.

---

## 4. Frontend (React + Vite) Installation & Execution

The dashboard visualizes geospatial risk predictions, optimized routes, and system logs.

### Step 1: Navigate to Frontend Directory
```bash
cd ../frontend
```

### Step 2: Install Node Packages
Install local npm packages. This reads dependencies from `package.json`:
```bash
npm install
```

### Step 3: Start the Vite Development Server
Run the local dev server:
```bash
npm run dev
```
By default, the React dev server launches on **`http://localhost:5173`**. Open this URL in your browser to interact with the command center.

---

## 5. Verification (Running E2E Checks)

Once both the backend and frontend are running, you can run the automated test suite to ensure the system is completely functional:
1. Open a new terminal window.
2. Activate the python virtual environment in the `backend/` folder.
3. Return to the workspace root and run the test suite:
   ```bash
   python automated_qa_suite.py
   ```
The test suite will check:
*   FastAPI health status (`GET /health`)
*   Data service endpoints (`/zones/high-risk`, `/hotspots`, `/patrols`, `/forecast`, `/alerts`)
*   Risk predictor model loading, schema constraints, and inference latencies.
