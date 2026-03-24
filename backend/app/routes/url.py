from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.url import URL
from app.schemas.url import URLCreate, URLResponse
from app.core.deps import get_current_user
from app.services.short_code import encode_base62

router = APIRouter(prefix="/urls", tags=["URLs"])

@router.post("/", response_model=URLResponse)
def create_url(
    data: URLCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    url = URL(
        original_url=str(data.original_url),
        short_code="temp",
        user_id=user.id
    )
    db.add(url)
    db.commit()
    db.refresh(url)

    url.short_code = encode_base62(url.id.int)
    db.commit()
    db.refresh(url)

    return url

@router.get("/", response_model=list[URLResponse])
def list_urls(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return db.query(URL).filter(URL.user_id == user.id, URL.is_active==True).all()

@router.delete("/{url_id}")
def disable_url(
    url_id: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    url = db.query(URL).filter(
        URL.id == url_id,
        URL.user_id == user.id
    ).first()

    if not url:
        raise HTTPException(status_code=404, detail="URL not found")

    url.is_active = False
    db.commit()

    return {"message": "URL disabled successfully"}
