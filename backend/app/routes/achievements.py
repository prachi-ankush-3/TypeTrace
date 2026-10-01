from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Achievement
from ..auth import current_user
router=APIRouter(prefix="/achievements",tags=["achievements"])
@router.get("")
def achievements(user=Depends(current_user),db:Session=Depends(get_db)):
 rows=db.query(Achievement).filter_by(user_id=user.id).all();return [{"key":x.achievement_key,"unlocked_at":x.unlocked_at} for x in rows]
