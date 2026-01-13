# Main FastAPI application entry point
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth_routes import router as auth_routes
from app.routes.generate_routes import router as generate_routes
from app.routes.history_routes import router as history_routes

app = FastAPI()

@app.on_event("startup")
async def startup_db_client():
    try:
        # Test database connection
        from app.database import client
        await client.admin.command('ping')
        print("\n" + "="*60)
        print("✅ SUCCESS: Connected to MongoDB!")
        print("📊 Database: formatai")
        print("🔗 Connection: Active")
        print("="*60 + "\n")
    except Exception as e:
        print("\n" + "="*60)
        print("❌ ERROR: Failed to connect to MongoDB!")
        print(f"🔴 Error: {str(e)}")
        print("="*60 + "\n")

@app.get("/")
async def root():
    return {
        "message": "🚀 FormatAI Server is running!",
    }

@app.get("/debug/config")
async def debug_config():
    from app.config import MONGO_URI, JWT_SECRET, GROQ_API_KEY
    # Mask sensitive data
    masked_uri = MONGO_URI[:20] + "..." + MONGO_URI[-30:] if MONGO_URI else "Not set"
    return {
        "mongo_uri_preview": masked_uri,
        "jwt_secret_set": bool(JWT_SECRET),
        "groq_api_key_set": bool(GROQ_API_KEY),
    }




app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes)
app.include_router(generate_routes)
app.include_router(history_routes)