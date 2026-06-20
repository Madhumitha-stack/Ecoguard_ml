import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

class Settings:
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    MODEL_PATH: str = os.getenv("MODEL_PATH", "models/poaching_risk_model.pkl")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "info")

settings = Settings()
