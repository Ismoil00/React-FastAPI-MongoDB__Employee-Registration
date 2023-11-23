from fastapi import APIRouter, HTTPException, status, UploadFile
from models import Employee
from config import employees_collection, database
from fastapi.encoders import jsonable_encoder
from bson import ObjectId
from schema import get_all_employees
from gridfs import GridFS


router = APIRouter()

fs = GridFS(database)


# get all employees:
@router.get("/get-employees")
async def get_employees():
    try:
        employees = get_all_employees(employees_collection.find())

        if len(employees) > 0:
            return employees
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="The Database is empty!",
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


# # saving image:
# @router.post("/save-image")
# async def save_image(image: UploadFile):
#     if image:
#         image_content = await image.read()
#         image_id = fs.put(image_content, filename=image.filename,
#                           content_type=image.content_type)
#         print("this image id >>>", image_id)
#         return "Success!"


# creating a employee:
@router.post("/create-employee")
async def create_employee(info: Employee):
    try:
        employee_dict = jsonable_encoder(info)

        # # Save the image to GridFS
        # if image:
        #     image_content = await image.read()
        #     image_id = fs.put(
        #         image_content, filename=image.filename, content_type=image.content_type
        #     )
        #     employee_dict["image_id"] = str(image_id)

        result = employees_collection.insert_one(employee_dict)

        if result.acknowledged:
            return {
                "status": "Successfully created an employee",
                "id": str(result.inserted_id),
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create employee",
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


# update a employee:
@router.put("/update-employee/{id}")
async def update_employee(id: str, info: Employee):
    try:
        employee_dict = jsonable_encoder(info)
        result = employees_collection.find_one_and_update(
            {"_id": ObjectId(id)}, {"$set": employee_dict}, return_document=True
        )

        if result:
            return {
                "status": "Successfully updated an employee",
                "id": str(result["_id"]),
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update employee",
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


# delete a employee:
@router.delete("/delete-employee/{id}")
async def delete_employee(id: str):
    try:
        result = employees_collection.find_one_and_delete(
            {"_id": ObjectId(id)})

        if result:
            return {
                "status": "Successfully deleted an employee",
                "id": str(result["_id"]),
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete employee",
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )
