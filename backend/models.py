from pydantic import BaseModel

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
    building: str
    home: int


class Employee(BaseModel):
    first_name: str
    last_name: str
    email: str
    profession: str
    salary: float
    age: int
    gender: str
    married: bool
    education: list[str]
    address: EmployeeAddress
