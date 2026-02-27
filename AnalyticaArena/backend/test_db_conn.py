import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def test_mongo():
    uri = os.getenv("MONGODB_URI")
    db_name = os.getenv("DATABASE_NAME")
    print(f"Testing connection to: {uri} (DB: {db_name})")
    try:
        client = AsyncIOMotorClient(uri)
        await client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        db = client[db_name]
        collections = await db.list_collection_names()
        print(f"Collections: {collections}")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_mongo())
