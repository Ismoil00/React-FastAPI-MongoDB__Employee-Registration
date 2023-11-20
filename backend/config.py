from pymongo import MongoClient

URL = "mongodb+srv://ismoil:ismoil@myfirstcluster.11mqx2p.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(URL)

database = client.Employees_Registration_App

employees_collection = database["employees_info"]
