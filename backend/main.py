from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from conn_db import engine, Base
from routers import vendor as vendor_router
from routers import invoice as invoice_router

app = FastAPI(title="VeriPay API")

# CORS (required for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB tables
Base.metadata.create_all(bind=engine)

# Routers (NO extra prefix here)
app.include_router(vendor_router.router)
app.include_router(invoice_router.router)

@app.get("/")
def root():
    return {"status": "VeriPay backend running"}

@app.get("/health")
def health():
    return {"health": "ok"}
