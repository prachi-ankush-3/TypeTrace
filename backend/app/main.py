from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine, _migrate_sqlite
from .routes import auth, tests, stats, ghost, profile, achievements

Base.metadata.create_all(bind=engine)
_migrate_sqlite()

app = FastAPI(title="TypeTrace API", version="3.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://typetrace-frontend.onrender.com",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router, prefix="/api")
app.include_router(tests.router, prefix="/api")
app.include_router(stats.router, prefix="/api")
app.include_router(ghost.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(achievements.router, prefix="/api")

@app.get("/api/health")
def health():
    return {"status": "online", "service": "typetrace"}
