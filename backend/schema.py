def get_employee(employee):
    return {
        "id": str(employee["_id"]),
        "first_name": employee["first_name"],
        "last_name": employee["last_name"],
        "email": employee["email"],
        "profession": employee["profession"],
        "salary": employee["salary"],
        "age": employee["age"],
        "gender": employee["gender"],
        "married": employee["married"],
        "education": employee["education"],
        "image_url": employee["image_url"],
        "address": {
            "city": employee["address"]["city"],
            "street": employee["address"]["street"],
            "building": employee["address"]["building"],
            "home": employee["address"]["home"],
        }
    }


def get_all_employees(employees):
    return [get_employee(employee) for employee in employees]
