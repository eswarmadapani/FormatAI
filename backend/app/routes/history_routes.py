# History routes for user generation history
from fastapi import APIRouter, Header, HTTPException
from jose import jwt
from bson import ObjectId
from app.database import generations_collections
from app.config import JWT_SECRET

router = APIRouter(tags=["History"])

def get_user_id(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload["sub"]
    except:
        return None

@router.get("/history")
async def history(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401,detail="Unauthorized")
    token = authorization.split(" ")[1]
    user_id = get_user_id(token)

    if not user_id:
        raise HTTPException(status_code=401,detail="Invalid token")
    
    response = generations_collections.find({"user_id": ObjectId(user_id)}).sort("created_at", -1)

    gen = []
    async for generation in response:
        generation["_id"] = str(generation["_id"])
        generation["user_id"] = str(generation["user_id"])
        gen.append(generation)
    return gen