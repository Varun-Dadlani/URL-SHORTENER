from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.url import URL
from datetime import datetime,timezone
from app.core.redis_client import redis

router = APIRouter()

@router.get("/{short_code}")
def redirect_url(short_code: str, db: Session = Depends(get_db)):

    original_url = redis.get(short_code)

    #REDIS HIT
    if original_url is not None:
        redis.incr(f"{short_code}:click_count")
        return RedirectResponse(original_url, status_code=302)


    #REDIS MISS
    url = db.query(URL).filter(
        URL.short_code == short_code,
        URL.is_active == True
    ).first()

    if not url:
        raise HTTPException(status_code=404, detail="URL not found")

    if url.expires_at and url.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=410, detail="URL expired")


    redis.incr(f"{short_code}:click_count")

    if url.expires_at:
        ttl = int(
            (url.expires_at - datetime.now(timezone.utc)).total_seconds()
        )

        if ttl > 0:
            redis.set(
                short_code,
                str(url.original_url),
                ex=ttl
            )
    else:
        redis.set(
            short_code,
            str(url.original_url)
        )



    return RedirectResponse(url.original_url ,status_code=302)
