from fastapi import APIRouter, HTTPException, status
from models import Employee
from config import employees_collection
from fastapi.encoders import jsonable_encoder
from bson import ObjectId
from schema import get_all_employees


router = APIRouter()


# get all employees:
@router.get("/get-employees")
async def get_employees():
    try:
        employees = get_all_employees(employees_collection.find())

        if len(employees) > 0:
            return employees
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="The Database is empty!")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# creating a employee:
@router.post("/create-employee")
async def create_employee(info: Employee):
    try:
        employee_dict = jsonable_encoder(info)
        result = employees_collection.insert_one(employee_dict)

        if result.acknowledged:
            return {"status": "Successfully created an employee", "id": str(result.inserted_id)}
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create employee")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# update a employee:
@router.put("/update-employee/{id}")
async def update_employee(id: str, info: Employee):
    try:
        employee_dict = jsonable_encoder(info)
        result = employees_collection.find_one_and_update(
            {"_id": ObjectId(id)}, {"$set": employee_dict}, return_document=True)

        if result:
            return {"status": "Successfully updated an employee", "id": str(result["_id"])}
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update employee")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# delete a employee:
@router.delete("/delete-employee/{id}")
async def delete_employee(id: str):
    try:
        result = employees_collection.find_one_and_delete(
            {"_id": ObjectId(id)})

        if result:
            return {"status": "Successfully deleted an employee", "id": str(result["_id"])}
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete employee")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
