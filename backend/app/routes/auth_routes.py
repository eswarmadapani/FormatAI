from fastapi import APIRouter, HTTPException
from app.database import users_collections
from app.schemas import SignupRequest, LoginRequest
from app.auth import hash_password, verify_password, create_token

router = APIRouter(prefix="/Auth", tags=["Auth"])


@router.post("/signup")
async def signup(data: SignupRequest):
    existing_user = await users_collections.find_one({"email": data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    try:
        hashed_pw = hash_password(data.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    user_doc = {
        "name": data.name,
        "email": data.email,
        "password_hash": hashed_pw
    }

    result = await users_collections.insert_one(user_doc)
    return {"message": "Signup successful", "user_id": str(result.inserted_id)}


@router.post("/login")
async def login(data: LoginRequest):
    user = await users_collections.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(str(user["_id"]))
    return {"message": "Login successful", "access_token": token}


@router.get("/users/debug")
async def get_all_users():
    """Debug endpoint to view all users (remove in production!)"""
    users = []
    async for user in users_collections.find():
        users.append({
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "has_password": bool(user.get("password_hash"))
        })
    return {"total_users": len(users), "users": users}
