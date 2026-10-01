from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..models import UserStats, Streak, Ghost, Achievement, TypingTest, GhostRace, KeyStats

def ensure_stats(db, user_id):
    s = db.query(UserStats).filter_by(user_id=user_id).first()
    if not s:
        s = UserStats(user_id=user_id)
        db.add(s)
    st = db.query(Streak).filter_by(user_id=user_id).first()
    if not st:
        st = Streak(user_id=user_id)
        db.add(st)
    g = db.query(Ghost).filter_by(user_id=user_id).first()
    if not g:
        g = Ghost(user_id=user_id)
        db.add(g)
    db.flush()
    return s, st, g

def calculate_score(wpm, accuracy, duration):
    return round(max(0, wpm) * max(0, min(100, accuracy)) / 100 * max(1, duration) * 10, 2)

def update_after_test(db: Session, user, test, previous_ghost=None):
    s, st, g = ensure_stats(db, user.id)
    tests = db.query(TypingTest).filter_by(user_id=user.id).all()

    s.total_tests = len(tests)
    s.total_typing_time = sum(x.time_taken for x in tests)
    s.best_wpm = max((x.wpm for x in tests), default=0)
    s.best_accuracy = max((x.accuracy for x in tests), default=0)
    s.average_wpm = sum(x.wpm for x in tests) / len(tests) if tests else 0
    s.average_accuracy = sum(x.accuracy for x in tests) / len(tests) if tests else 0

    today = datetime.utcnow().date()
    last = datetime.strptime(st.last_test_date, "%Y-%m-%d").date() if st.last_test_date else None
    if last == today:
        pass
    elif last == today - timedelta(days=1):
        st.current_streak += 1
    else:
        st.current_streak = 1
    st.best_streak = max(st.best_streak, st.current_streak)
    st.last_test_date = str(today)

    if previous_ghost is not None and previous_ghost.id != test.id:
        ghost_score = previous_ghost.score or calculate_score(previous_ghost.wpm, previous_ghost.accuracy, previous_ghost.duration)
        current_score = test.score or calculate_score(test.wpm, test.accuracy, test.duration)
        test.score = current_score
        test.ghost_won = 1 if current_score > ghost_score else 0
        db.add(GhostRace(
            user_id=user.id,
            ghost_test_id=previous_ghost.id,
            current_test_id=test.id,
            ghost_score=ghost_score,
            current_score=current_score,
            won=test.ghost_won,
        ))

    # Keep the user's fastest historical run as the default ghost.
    if test.wpm >= g.best_wpm:
        g.best_wpm = test.wpm
        g.best_accuracy = test.accuracy
        g.best_test_id = test.id
        g.ghost_name = f"TRACE {s.total_tests:03d}"

    def unlock(key, condition):
        if condition and not db.query(Achievement).filter_by(
            user_id=user.id, achievement_key=key
        ).first():
            db.add(Achievement(user_id=user.id, achievement_key=key))

    unlock("FIRST_TRACE", s.total_tests >= 1)
    unlock("SPEED_DEMON", s.best_wpm >= 70)
    unlock("NO_MERCY", s.best_accuracy >= 90)
    unlock("GHOST_BREAKER", test.ghost_won == 1)
    unlock("NIGHT_WATCH", st.current_streak >= 7)
    unlock("ARCHIVIST", s.total_tests >= 100)

    db.commit()
    return s, st, g
