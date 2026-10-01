from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import UserStats,Streak,TypingTest
from ..auth import current_user
router=APIRouter(tags=["stats"])
@router.get("/stats")
def stats(user=Depends(current_user),db:Session=Depends(get_db)):
 s=db.query(UserStats).filter_by(user_id=user.id).first()
 return {"best_wpm":s.best_wpm if s else 0,"best_accuracy":s.best_accuracy if s else 0,"average_wpm":s.average_wpm if s else 0,"average_accuracy":s.average_accuracy if s else 0,"total_tests":s.total_tests if s else 0,"total_typing_time":s.total_typing_time if s else 0}
@router.get("/stats/wpm")
def wpm(user=Depends(current_user),db:Session=Depends(get_db)):return [{"created_at":x.created_at.isoformat(),"wpm":x.wpm} for x in db.query(TypingTest).filter_by(user_id=user.id).order_by(TypingTest.created_at).all()]
@router.get("/stats/accuracy")
def accuracy(user=Depends(current_user),db:Session=Depends(get_db)):return [{"created_at":x.created_at.isoformat(),"accuracy":x.accuracy} for x in db.query(TypingTest).filter_by(user_id=user.id).order_by(TypingTest.created_at).all()]
@router.get("/streak")
def streak(user=Depends(current_user),db:Session=Depends(get_db)):
 s=db.query(Streak).filter_by(user_id=user.id).first();return {"current_streak":s.current_streak if s else 0,"best_streak":s.best_streak if s else 0,"last_test_date":s.last_test_date if s else None}
