from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.url import URL
from datetime import datetime,timezone

router = APIRouter()

@router.get("/{short_code}")
def redirect_url(short_code: str, db: Session = Depends(get_db)):
    url = db.query(URL).filter(
        URL.short_code == short_code,
        URL.is_active == True
    ).first()

    if not url:
        raise HTTPException(status_code=404, detail="URL not found")

    if url.expires_at and url.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=410, detail="URL expired")
    
    url.click_count += 1
    db.commit()

    return RedirectResponse(url.original_url ,status_code=302)
