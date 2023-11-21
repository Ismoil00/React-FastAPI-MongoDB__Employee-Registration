from fastapi import APIRouter
from models import Employee
from config import employees_collection


router = APIRouter()


# get all employees:
@router.get("/get-employees")
async def get_employees():
    pass


# creating a employee:
@router.post("/create-employee")
async def create_employee(info: Employee):
    pass


# update a employee:
@router.put("/update-employee/{id}")
async def update_employee(id: str, info: Employee):
    pass


# delete a employee:
@router.delete("/delete-employee/{id}")
async def delete_employee(id: str):
    pass