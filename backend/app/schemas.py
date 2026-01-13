# Pydantic schemas for request/response validation
from pydantic import BaseModel

class SignupRequest(BaseModel):
    name:str
    email:str
    password:str

class LoginRequest(BaseModel):
    email:str
    password:str

class GenerateRequest(BaseModel):
    input_text:str
    tone:str
    format:str
    length: str = "Normal"
