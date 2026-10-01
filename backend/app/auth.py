import os
from datetime import datetime,timedelta
from jose import jwt,JWTError
from passlib.context import CryptContext
from fastapi import Depends,HTTPException,status
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .database import get_db
from .models import User
SECRET_KEY=os.getenv("SECRET_KEY","dev-only-change-me");ALGORITHM="HS256";EXPIRE_MINUTES=60*24*7
pwd=CryptContext(schemes=["bcrypt"],deprecated="auto");bearer=HTTPBearer(auto_error=False)
def hash_password(x):return pwd.hash(x)
def verify_password(x,h):return pwd.verify(x,h)
def create_token(user_id):
    return jwt.encode({"sub":str(user_id),"exp":datetime.utcnow()+timedelta(minutes=EXPIRE_MINUTES)},SECRET_KEY,algorithm=ALGORITHM)
def current_user(credentials:HTTPAuthorizationCredentials=Depends(bearer),db:Session=Depends(get_db)):
    if not credentials:raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Authentication required")
    try:uid=int(jwt.decode(credentials.credentials,SECRET_KEY,algorithms=[ALGORITHM])["sub"])
    except (JWTError,ValueError,KeyError):raise HTTPException(status_code=401,detail="Invalid or expired token")
    user=db.get(User,uid)
    if not user:raise HTTPException(status_code=401,detail="User not found")
    return user
