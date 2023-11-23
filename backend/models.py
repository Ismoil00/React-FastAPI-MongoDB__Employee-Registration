from pydantic import BaseModel
from fastapi import UploadFile

form = {
    "first_name": "",
    "last_name": "",
    "email": "",
    "profession": "",
    "salary": 0.0,
    "age": 0,
    "gender": "",
    "married": False,
    "education": [""],
    "address": {
        "city": "",
        "street": "",
        "building": "",
        "home": 0,
    },
}


class EmployeeAddress(BaseModel):
    city: str
    street: str
    building: str | None = None
    home: int | None = None


class Employee(BaseModel):
    first_name: str
    last_name: str
    email: str
    profession: str
    salary: float | None = None
    age: int
    gender: str
    married: bool | None = None
    education: list[str] | None = None
    address: EmployeeAddress
    image_id: str | None = None
