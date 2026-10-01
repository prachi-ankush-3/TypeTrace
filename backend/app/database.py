from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./typetrace.db")
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

def _migrate_sqlite():
    if not DATABASE_URL.startswith("sqlite"):
        return
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        if "typing_tests" in tables:
            existing = {c["name"] for c in inspector.get_columns("typing_tests")}
            with engine.begin() as conn:
                if "score" not in existing:
                    conn.execute(text("ALTER TABLE typing_tests ADD COLUMN score FLOAT DEFAULT 0"))
                if "ghost_test_id" not in existing:
                    conn.execute(text("ALTER TABLE typing_tests ADD COLUMN ghost_test_id INTEGER"))
                if "ghost_won" not in existing:
                    conn.execute(text("ALTER TABLE typing_tests ADD COLUMN ghost_won INTEGER DEFAULT 0"))
    except Exception:
        pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
