from fastapi import FastAPI
from app.routes import auth,url,redirect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="URL Shortener API",
    version="1.0.0"
)
app.include_router(auth.router)
app.include_router(url.router)
app.include_router(redirect.router)

@app.get("/")
def health_check():
    return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)