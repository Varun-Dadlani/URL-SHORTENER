from pydantic import BaseModel, HttpUrl
from datetime import datetime
from uuid import UUID

class URLCreate(BaseModel):
    original_url: HttpUrl

class URLResponse(BaseModel):
    id: UUID
    original_url: HttpUrl
    short_code: str
    click_count: int
    created_at: datetime

    class Config:
        from_attributes = True

class URLListResponse(BaseModel):
    id: UUID
    original_url: HttpUrl
    short_code: str
    click_count: int
    created_at: datetime
    user_id: UUID
    class Config:
        from_attributes = True