# AI generation routes
from fastapi import APIRouter, Header, HTTPException
from jose import jwt, JWTError
from datetime import datetime
from bson import ObjectId
from app.database import generations_collections
from app.config import JWT_SECRET
from app.schemas import GenerateRequest
from app.ai_service import generate_markdown

router = APIRouter(tags=["Generate"])

def get_user_id(token:str):
    try:
        payload = jwt.decode(token,JWT_SECRET,algorithms=["HS256"])
        return payload["sub"]
    except JWTError:
        raise HTTPException(status_code=401,detail="Invalid token")

@router.post("/generate")
async def generate(data: GenerateRequest, authorization:str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401,detail="Unauthorized User")
    
    token = authorization.split(" ")[1]
    user_id = get_user_id(token)
    
    if not user_id:
        return HTTPException(status_code=401,detail="Invalid token")

    output = await generate_markdown(data.input_text,data.tone,data.format,data.length)

    generation_doc = {
        "user_id": ObjectId(user_id),
        "input_text": data.input_text,
        "output_text": output,
        "tone": data.tone,
        "format": data.format,
        "created_at": datetime.utcnow()
    }

    await generations_collections.insert_one(generation_doc)

    return {"output_text": output}