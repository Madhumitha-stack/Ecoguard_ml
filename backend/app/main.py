import sys
import os
import time
import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import uvicorn

# Ensure the parent directory 'backend' is in the python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import settings

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format='%(asctime)s - %(levelname)s - %(name)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("app.main")

app = FastAPI(
    title="EcoGuard-ML Core API Platform",
    description="Production-ready model serving and intelligence API platform for poaching threat mitigation",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Exception Handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.warning(f"HTTP error {exc.status_code}: {exc.detail} on {request.url.path}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTPException",
            "code": exc.status_code,
            "detail": exc.detail
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # Sanitize errors to ensure they are JSON-serializable (Pydantic v2 passes ValueError exceptions under ctx)
    errors = []
    for error in exc.errors():
        err_dict = dict(error)
        if "ctx" in err_dict and isinstance(err_dict["ctx"], dict):
            err_dict["ctx"] = {k: str(v) if isinstance(v, Exception) else v for k, v in err_dict["ctx"].items()}
        errors.append(err_dict)
        
    logger.warning(f"Schema validation error on {request.url.path}: {errors}")
    return JSONResponse(
        status_code=422,
        content={
            "error": "ValidationError",
            "code": 422,
            "message": "The request payload failed Pydantic validation checks.",
            "detail": errors
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled system exception on {request.url.path}: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "InternalServerError",
            "code": 500,
            "detail": "An unexpected error occurred during execution. Please check the server logs."
        }
    )

# Request Logging Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = (time.time() - start_time) * 1000
    logger.info(
        f"[HTTP] Method={request.method} Path={request.url.path} "
        f"Status={response.status_code} Latency={duration:.2f}ms"
    )
    return response

# Mount static assets
static_assets_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "assets")
os.makedirs(static_assets_path, exist_ok=True)
app.mount("/assets", StaticFiles(directory=static_assets_path), name="assets")

# Register Routers
from app.routes import api, views
app.include_router(views.router)
app.include_router(api.router)

if __name__ == "__main__":
    logger.info(f"Starting EcoGuard-ML Core API server at {settings.HOST}:{settings.PORT}")
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=False)
