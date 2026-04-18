from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.security_middleware import setup_security_middleware
from app.routes.access_routes import router as access_router
from app.routes.ai_routes import router as ai_router
from app.routes.auth_routes import router as auth_router
from app.routes.health_routes import router as health_router
from app.routes.interview_routes import router as interview_router
from app.routes.resume_routes import router as resume_router
from app.routes.user_routes import router as user_router

app = FastAPI(
    title="CareerPilot AI API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_security_middleware(app)

app.include_router(health_router, prefix="/api/health", tags=["Health"])
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(user_router, prefix="/api/users", tags=["Users"])
app.include_router(resume_router, prefix="/api/resumes", tags=["Resumes"])
app.include_router(ai_router, prefix="/api/ai", tags=["AI"])
app.include_router(interview_router, prefix="/api/interviews", tags=["Interviews"])
app.include_router(access_router, prefix="/api/access", tags=["Access"])


@app.get("/")
def root():
    return {"message": "CareerPilot AI backend is running"}