from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import RegisterIn,LoginIn,Token,UserOut
from ..auth import hash_password,verify_password,create_token,current_user
router=APIRouter(prefix="/auth",tags=["auth"])
@router.post("/register",response_model=Token)
def register(x:RegisterIn,db:Session=Depends(get_db)):
    if db.query(User).filter((User.email==x.email)|(User.username==x.username)).first():raise HTTPException(409,"Username or email already exists")
    u=User(username=x.username,email=x.email,password_hash=hash_password(x.password));db.add(u);db.commit();db.refresh(u);return {"access_token":create_token(u.id)}
@router.post("/login",response_model=Token)
def login(x:LoginIn,db:Session=Depends(get_db)):
    u=db.query(User).filter((User.email==x.identifier)|(User.username==x.identifier)).first()
    if not u or not verify_password(x.password,u.password_hash):raise HTTPException(401,"Invalid credentials")
    return {"access_token":create_token(u.id)}
@router.get("/me",response_model=UserOut)
def me(user=Depends(current_user)):return user
