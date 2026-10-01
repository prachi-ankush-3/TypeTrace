import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Ghost, TypingTest, GhostRace
from ..auth import current_user
from ..services.stats import calculate_score

router = APIRouter(prefix="/ghost", tags=["ghost"])

def test_data(t):
    return {
        "id": t.id,
        "wpm": t.wpm,
        "accuracy": t.accuracy,
        "duration": t.duration,
        "time_taken": t.time_taken,
        "score": t.score or calculate_score(t.wpm, t.accuracy, t.duration),
        "created_at": t.created_at.isoformat(),
        "timeline": json.loads(t.timeline or "[]"),
        "label": f"TRACE {t.id:03d}",
    }

@router.get("")
def ghost(test_id: int | None = None, user=Depends(current_user), db: Session = Depends(get_db)):
    if test_id:
        t = db.query(TypingTest).filter_by(id=test_id, user_id=user.id).first()
        if not t:
            raise HTTPException(404, "Ghost trace not found")
        data = test_data(t)
        data["ghost_name"] = f"TRACE {t.id:03d}"
        return data

    g = db.query(Ghost).filter_by(user_id=user.id).first()
    if not g or not g.best_test_id:
        return {
            "id": None,
            "best_wpm": 0,
            "best_accuracy": 0,
            "ghost_name": "THE FIRST TRACE",
            "time_taken": 0,
            "score": 0,
            "timeline": [],
        }

    t = db.query(TypingTest).filter_by(id=g.best_test_id, user_id=user.id).first()
    if not t:
        return {"id": None, "best_wpm": 0, "best_accuracy": 0, "ghost_name": "THE FIRST TRACE", "time_taken": 0, "score": 0, "timeline": []}

    data = test_data(t)
    data["best_wpm"] = g.best_wpm
    data["best_accuracy"] = g.best_accuracy
    data["ghost_name"] = g.ghost_name
    return data

@router.get("/past")
def past(user=Depends(current_user), db: Session = Depends(get_db)):
    rows = db.query(TypingTest).filter_by(user_id=user.id).order_by(
        TypingTest.created_at.desc()
    ).all()
    return [test_data(x) for x in rows]

@router.get("/races")
def races(user=Depends(current_user), db: Session = Depends(get_db)):
    rows = db.query(GhostRace).filter_by(user_id=user.id).order_by(
        GhostRace.created_at.desc()
    ).limit(50).all()
    return [{
        "id": x.id,
        "ghost_test_id": x.ghost_test_id,
        "current_test_id": x.current_test_id,
        "ghost_score": x.ghost_score,
        "current_score": x.current_score,
        "won": bool(x.won),
        "created_at": x.created_at.isoformat(),
    } for x in rows]

@router.post("/race")
def race(user=Depends(current_user), db: Session = Depends(get_db)):
    return ghost(user=user, db=db)
