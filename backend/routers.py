from fastapi import APIRouter
from models import Employee
from config import employees_collection

router = APIRouter()


@router.post("/create-employee")
async def create_employee(info: Employee):
    pass
