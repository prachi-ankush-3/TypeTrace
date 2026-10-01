from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User,UserStats,Streak
from ..schemas import ProfileUpdate
from ..auth import current_user
router=APIRouter(tags=["profile"])
@router.get("/profile")
def profile(user=Depends(current_user),db:Session=Depends(get_db)):
 s=db.query(UserStats).filter_by(user_id=user.id).first();st=db.query(Streak).filter_by(user_id=user.id).first()
 return {"username":user.username,"email":user.email,"created_at":user.created_at,"best_wpm":s.best_wpm if s else 0,"current_streak":st.current_streak if st else 0}
@router.put("/profile")
def update(x:ProfileUpdate,user=Depends(current_user),db:Session=Depends(get_db)):
 if x.username and x.username!=user.username and db.query(User).filter_by(username=x.username).first():raise HTTPException(409,"Username already exists")
 if x.username:user.username=x.username
 db.commit();return {"username":user.username}
