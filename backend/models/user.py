from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    initials: str
    plan: str = "free"


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut
