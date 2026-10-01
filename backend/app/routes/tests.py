import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import TypingTest
from ..schemas import TestIn
from ..auth import current_user
from ..services.stats import update_after_test, calculate_score

router = APIRouter(prefix="/tests", tags=["tests"])

def serialize(x):
    return {
        "id": x.id,
        "duration": x.duration,
        "wpm": x.wpm,
        "accuracy": x.accuracy,
        "errors": x.errors,
        "correct_chars": x.correct_chars,
        "incorrect_chars": x.incorrect_chars,
        "time_taken": x.time_taken,
        "score": x.score or calculate_score(x.wpm, x.accuracy, x.duration),
        "ghost_test_id": x.ghost_test_id,
        "ghost_won": bool(x.ghost_won),
        "created_at": x.created_at.isoformat(),
        "paragraph": x.paragraph,
    }

@router.post("")
def create_test(x: TestIn, user=Depends(current_user), db: Session = Depends(get_db)):
    previous_ghost = None
    if x.ghost_test_id:
        previous_ghost = db.query(TypingTest).filter_by(
            id=x.ghost_test_id, user_id=user.id
        ).first()
        if not previous_ghost:
            raise HTTPException(404, "Ghost trace not found")

    score = x.score or calculate_score(x.wpm, x.accuracy, x.duration)
    t = TypingTest(
        user_id=user.id,
        duration=x.duration,
        paragraph=x.paragraph,
        wpm=x.wpm,
        accuracy=x.accuracy,
        correct_chars=x.correct_chars,
        incorrect_chars=x.incorrect_chars,
        errors=x.errors,
        time_taken=x.time_taken,
        score=score,
        ghost_test_id=x.ghost_test_id,
        timeline=json.dumps(x.timeline),
    )
    db.add(t)
    db.flush()
    s, st, g = update_after_test(db, user, t, previous_ghost)

    ghost_data = None
    if previous_ghost:
        ghost_score = previous_ghost.score or calculate_score(
            previous_ghost.wpm, previous_ghost.accuracy, previous_ghost.duration
        )
        ghost_data = {
            "id": previous_ghost.id,
            "wpm": previous_ghost.wpm,
            "accuracy": previous_ghost.accuracy,
            "score": ghost_score,
            "won": bool(t.ghost_won),
            "score_delta": round(t.score - ghost_score, 2),
            "wpm_delta": round(t.wpm - previous_ghost.wpm, 2),
        }

    return {
        "id": t.id,
        "stats": s.total_tests,
        "streak": st.current_streak,
        "ghost_wpm": g.best_wpm,
        "score": t.score,
        "ghost": ghost_data,
    }

@router.get("")
def get_tests(user=Depends(current_user), db: Session = Depends(get_db)):
    rows = db.query(TypingTest).filter_by(user_id=user.id).order_by(
        TypingTest.created_at.desc()
    ).all()
    return [serialize(x) for x in rows]

@router.get("/{test_id}")
def get_test(test_id: int, user=Depends(current_user), db: Session = Depends(get_db)):
    x = db.query(TypingTest).filter_by(id=test_id, user_id=user.id).first()
    if not x:
        raise HTTPException(404, "Trace not found")
    data = serialize(x)
    data["timeline"] = json.loads(x.timeline or "[]")
    return data
