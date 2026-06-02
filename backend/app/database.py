from pymongo import MongoClient
import os

MONGO_URI = os.getenv("MONGO_URI")

print("Mongo URI:", MONGO_URI)  # 🔥 debug

client = MongoClient(MONGO_URI)

db = client["talqs_db1"]

qa_collection = db["queries"]
summary_collection = db["documents"]