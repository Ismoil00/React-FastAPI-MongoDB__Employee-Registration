from pymongo import MongoClient

client = MongoClient(
    "mongodb+srv://ismoil:ismoil@myfirstcluster.11mqx2p.mongodb.net/?retryWrites=true&w=majority")

database = client.Employees_Registration_App

employees_collection = database["employees_info"]
