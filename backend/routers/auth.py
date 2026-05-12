from fastapi import APIRouter, HTTPException, status, Depends
from models.user import UserCreate, UserLogin, UserOut, Token
from services.auth import (
    hash_password, verify_password, create_access_token,
    get_initials, get_current_user,
)
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


@router.get("/me", response_model=UserOut)
async def me(current_user: dict = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    return UserOut(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"],
        initials=current_user["initials"],
        plan=current_user["plan"],
    )


@router.post("/upgrade-plan")
async def upgrade_plan(body: dict, current_user: dict = Depends(get_current_user)):
    """Change the current user's subscription plan (demo endpoint — no payment)."""
    new_plan = body.get("plan", "").lower()
    valid_plans = {"free", "pro", "premium"}
    if new_plan not in valid_plans:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid plan. Choose from: {', '.join(valid_plans)}",
        )
    db.update_user_plan(current_user["id"], new_plan)
    updated = db.get_user_by_id(current_user["id"])
    return UserOut(
        id=updated["id"],
        name=updated["name"],
        email=updated["email"],
        initials=updated["initials"],
        plan=updated["plan"],
    )
