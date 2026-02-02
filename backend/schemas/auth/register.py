from pydantic import BaseModel

class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str