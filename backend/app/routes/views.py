from fastapi import APIRouter
from fastapi.responses import HTMLResponse
import os

router = APIRouter()

@router.get("/", response_class=HTMLResponse, include_in_schema=False)
def get_dashboard():
    static_dir = os.path.join(os.path.dirname(__file__), "..", "static")
    html_path = os.path.join(static_dir, "index.html")
    if os.path.exists(html_path):
        try:
            with open(html_path, "r", encoding="utf-8") as f:
                return HTMLResponse(content=f.read(), status_code=200)
        except Exception as e:
            return HTMLResponse(content=f"<h1>Error loading dashboard: {str(e)}</h1>", status_code=500)
    return HTMLResponse(
        content="<h1>EcoGuard-ML Core Dashboard Offline</h1><p>index.html is missing in static folder.</p>",
        status_code=404
    )
