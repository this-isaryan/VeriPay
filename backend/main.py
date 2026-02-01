from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
import os
from conn_db import engine, Base
from routers import vendor as vendor_router
from routers import invoice as invoice_router
from routers import auth as auth_router

app = FastAPI(title="VeriPay API")

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET", "dev-secret-change-me"),
    same_site="lax",
    https_only=False,  # set True in production
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# ✅ INCLUDE ALL ROUTERS
app.include_router(auth_router.router)
app.include_router(vendor_router.router)
app.include_router(invoice_router.router)

@app.get("/")
def root():
    return {"status": "VeriPay backend running"}
