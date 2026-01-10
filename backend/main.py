from fastapi import FastAPI
from conn_db import engine, Base
from models import Vendor
from routers import vendor as vendor_router

app = FastAPI(title="VeriPay API")

Base.metadata.create_all(bind=engine)

app.include_router(vendor_router.router)

@app.get("/")
def root():
    return {"status": "VeriPay backend running"}

@app.get("/health")
def health():
    return {"health": "ok"}
