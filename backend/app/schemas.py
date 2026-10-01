from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime

class RegisterIn(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)

class LoginIn(BaseModel):
    identifier: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TestIn(BaseModel):
    duration: int = Field(ge=15, le=300)
    paragraph: str = Field(min_length=1)
    wpm: float = Field(ge=0)
    accuracy: float = Field(ge=0, le=100)
    correct_chars: int = Field(ge=0)
    incorrect_chars: int = Field(ge=0)
    errors: int = Field(ge=0)
    time_taken: float = Field(ge=0)
    timeline: list[dict] = Field(default_factory=list)
    score: float = Field(default=0, ge=0)
    ghost_test_id: Optional[int] = None

class ProfileUpdate(BaseModel):
    username: Optional[str] = Field(default=None, min_length=3, max_length=50)

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    email: str
    created_at: datetime
