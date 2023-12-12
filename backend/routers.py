from fastapi import APIRouter, HTTPException, status, UploadFile, File
from fastapi.responses import StreamingResponse
from models import Employee
from config import employees_collection, database
from fastapi.encoders import jsonable_encoder
from bson import ObjectId
from schema import get_all_employees
from gridfs import GridFS
from fastapi.responses import StreamingResponse
import io

router = APIRouter()

# MongoDB Method for saving large files (more than 16mb);
fs = GridFS(database)


# -------------------------------------------- END POINTS --------------------------------------------:
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
                detail=f"The Database is empty!"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


# get image by its id:
@router.get("/get-image/{image_id}")
async def get_image_by_id(image_id: str):
    try:
        image_data = fs.get(ObjectId(image_id))

        # Check if the file exists
        if image_data is None:
            raise HTTPException(
                status_code=404, detail=f"Image with id {image_id} not found"
            )

        return StreamingResponse(io.BytesIO(image_data.read()), media_type="*/*")

    except Exception as e:
        raise HTTPException(status_code=404, detail="Image not found") from e


# creating an employee:
@router.post("/create-employee")
async def create_employee(info: Employee):
    try:
        employee_dict = jsonable_encoder(info)
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


# saving an image:
@router.post("/save-image")
async def save_image(image: UploadFile = File(...)):
    try:
        image_content = await image.read()
        image_id = fs.put(image_content, filename=image.filename)

        if image_id:
            return {"message": "Image uploaded successfully!", "id": str(image_id)}
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Image could not be saved",
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


# update an employee:
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


# delete an employee:
@router.delete("/delete-employee/{id}")
async def delete_employee(id: str):
    try:
        result = employees_collection.find_one_and_delete(
            {"_id": ObjectId(id)})

        if result:
            return {
                "status": 200,
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


# delete all employees:
@router.delete("/delete-all-employees")
async def delete_all_employees():
    try:
        result = employees_collection.delete_many({})

        if result.deleted_count > 0:
            return {
                status: 200,
                "details": f"{result.deleted_count} records were successfully deleted"
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="something went wrong while trying to delete all the records!"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


# delete an image by its id:
@router.delete("/delete-image/{image_id}")
async def delete_image(image_id: str):
    try:
        # Convert the image_id to ObjectId
        image_object_id = ObjectId(image_id)

        # Check if the image exists
        if fs.exists({"_id": image_object_id}):
            # Delete the image from MongoDB Atlas
            fs.delete(image_object_id)
            return {"message": "Image deleted successfully!", "status": 200}
        else:
            raise HTTPException(status_code=404, detail="Image not found")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error deleting image: {str(e)}"
        )


# delete all images:
# @router.delete("/delete-all-images")
# async def delete_all_images():
#     try:
#         # Delete all images from MongoDB Atlas
#         fs.delete_many({})
#         return {"message": "All images deleted successfully!", "status": 200}
#     except Exception as e:
#         raise HTTPException(
#             status_code=500, detail=f"Error deleting all images: {str(e)}"
#         )
