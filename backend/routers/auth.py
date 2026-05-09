from fastapi import APIRouter, HTTPException, status
from models.user import UserCreate, UserLogin, UserOut, Token
from services.auth import hash_password, verify_password, create_access_token, get_initials
import database as db

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=Token)
async def signup(user_data: UserCreate):
    existing = db.get_user_by_email(user_data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    hashed = hash_password(user_data.password)
    user = db.create_user({
        "name": user_data.name,
        "email": user_data.email,
        "password_hash": hashed,
        "initials": get_initials(user_data.name),
        "plan": "free",
    })

    token = create_access_token({"sub": user["id"]})
    return Token(
        access_token=token,
        token_type="bearer",
        user=UserOut(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            initials=user["initials"],
            plan=user["plan"],
        ),
    )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    user = db.get_user_by_email(credentials.email)
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token({"sub": user["id"]})
    return Token(
        access_token=token,
        token_type="bearer",
        user=UserOut(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            initials=user["initials"],
            plan=user["plan"],
        ),
    )
