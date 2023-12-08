from fastapi import APIRouter, HTTPException, status, UploadFile
from fastapi.responses import StreamingResponse
from models import Employee
from config import employees_collection, database
from fastapi.encoders import jsonable_encoder
from bson import ObjectId
from schema import get_all_employees
from gridfs import GridFS


router = APIRouter()

# MongoDB Method for saving large files (more than 16mb);
fs = GridFS(database)


# END POINTS:
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


# get image:
@router.get("/get-image/{image_id}")
async def get_image(image_id: str):
    try:
        # Retrieve image content from MongoDB
        file_data = fs.get(ObjectId(image_id))

        # Check if the file exists
        if file_data is None:
            raise HTTPException(
                status_code=404, detail=f"Image with id {image_id} not found"
            )

        # Create a StreamingResponse to send the image to the client
        return StreamingResponse(
            iter(file_data),
            media_type=file_data.content_type,
            headers={"Content-Disposition": f"filename={file_data.filename}"},
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


# creating a employee:
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


# saving image:
@router.post("/save-image")
async def save_image(image: UploadFile):
    try:
        print(image)
        image_content = await image.read()
        image_id = fs.put(
            image_content, filename=image.filename, content_type=image.content_type
        )

        if image_id:
            return str(image_id)
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Image could not be saved",
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
        print("Error:", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )
