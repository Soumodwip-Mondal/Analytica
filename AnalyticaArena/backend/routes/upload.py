from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from typing import List
import pandas as pd
import io
import os
import uuid
import aiofiles
from datetime import datetime
from bson import ObjectId

from routes.auth import get_current_user
from models.dataset_model import DatasetMetadata, ColumnInfo, DatasetResponse
from utils.database import get_database
from utils.helpers import validate_file, infer_column_types, safe_serialize

router = APIRouter(prefix="/api/upload", tags=["upload"])

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE_MB", 50)) * 1024 * 1024

@router.post("/", response_model=DatasetResponse)
async def upload_dataset(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload and process a dataset"""
    
    # Read file content
    content = await file.read()
    file_size = len(content)
    
    # Validate file
    validation = validate_file(file.filename, file_size)
    if not validation["valid"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"errors": validation["errors"]}
        )
    
    file_ext = validation["extension"]
    
    # Generate unique filename for storage
    file_id = str(uuid.uuid4())
    stored_filename = f"{file_id}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, stored_filename)
    
    # Save file to disk
    try:
        async with aiofiles.open(file_path, "wb") as f:
            await f.write(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving file to disk: {str(e)}"
        )
    
    # Parse file for column inference and row check
    try:
        if file_ext == '.csv':
            df = pd.read_csv(io.BytesIO(content))
        elif file_ext in ['.xlsx', '.xls']:
            df = pd.read_excel(io.BytesIO(content))
        elif file_ext == '.json':
            df = pd.read_json(io.BytesIO(content))
        else:
            # Cleanup if invalid
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported file type"
            )
        
        # Check row limit
        max_rows = int(os.getenv("MAX_ROWS", 100000))
        if len(df) > max_rows:
            # Cleanup if over limit
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Dataset exceeds maximum row limit of {max_rows}"
            )
        
    except Exception as e:
        # Cleanup on error
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error parsing file: {str(e)}"
        )
    
    # Infer column types
    column_types = infer_column_types(df)
    
    # Create column information
    columns_info = []
    for col in df.columns:
        col_data = df[col]
        missing_count = int(col_data.isna().sum())
        missing_pct = (missing_count / len(df)) * 100
        
        # Get sample values
        sample_values = col_data.dropna().head(5).tolist()
        sample_values = [safe_serialize(v) for v in sample_values]
        
        column_info = ColumnInfo(
            name=col,
            dtype=str(col_data.dtype),
            semantic_type=column_types.get(col, "text"),
            missing_count=missing_count,
            missing_percentage=round(missing_pct, 2),
            unique_count=int(col_data.nunique()),
            sample_values=sample_values
        )
        columns_info.append(column_info)
    
    # Store dataset in database
    db = get_database()
    
    dataset_doc = {
        "user_id": str(current_user["_id"]),
        "filename": file.filename,
        "original_filename": file.filename,
        "file_path": file_path,  # Store file path
        "file_size": file_size,
        "file_type": file_ext.replace('.', ''),
        "num_rows": len(df),
        "num_columns": len(df.columns),
        "columns": [col.model_dump() for col in columns_info],
        "uploaded_at": datetime.utcnow(),
        "is_analyzed": False
    }
    
    result = await db.datasets.insert_one(dataset_doc)
    dataset_id = str(result.inserted_id)
    
    return DatasetResponse(
        id=dataset_id,
        filename=file.filename,
        num_rows=len(df),
        num_columns=len(df.columns),
        uploaded_at=dataset_doc["uploaded_at"],
        is_analyzed=False
    )

@router.get("/datasets", response_model=List[DatasetResponse])
async def get_user_datasets(current_user: dict = Depends(get_current_user)):
    """Get all datasets for the current user"""
    db = get_database()
    
    datasets = await db.datasets.find(
        {"user_id": str(current_user["_id"])}
    ).sort("uploaded_at", -1).to_list(100)
    
    return [
        DatasetResponse(
            id=str(dataset["_id"]),
            filename=dataset["filename"],
            num_rows=dataset["num_rows"],
            num_columns=dataset["num_columns"],
            uploaded_at=dataset["uploaded_at"],
            is_analyzed=dataset.get("is_analyzed", False)
        )
        for dataset in datasets
    ]

@router.get("/dataset/{dataset_id}")
async def get_dataset_details(
    dataset_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get detailed information about a specific dataset"""
    db = get_database()
    
    try:
        dataset = await db.datasets.find_one({
            "_id": ObjectId(dataset_id),
            "user_id": str(current_user["_id"])
        })
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid dataset ID"
        )
    
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    # Update last accessed
    await db.datasets.update_one(
        {"_id": ObjectId(dataset_id)},
        {"$set": {"last_accessed": datetime.utcnow()}}
    )
    
    return {
        "id": str(dataset["_id"]),
        "filename": dataset["filename"],
        "num_rows": dataset["num_rows"],
        "num_columns": dataset["num_columns"],
        "columns": dataset["columns"],
        "uploaded_at": dataset["uploaded_at"],
        "is_analyzed": dataset.get("is_analyzed", False),
        "analysis_id": dataset.get("analysis_id")
    }

@router.delete("/dataset/{dataset_id}")
async def delete_dataset(
    dataset_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a dataset"""
    db = get_database()
    
    try:
        # Get dataset to find file path
        dataset = await db.datasets.find_one({
            "_id": ObjectId(dataset_id),
            "user_id": str(current_user["_id"])
        })
        
        if not dataset:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Dataset not found"
            )
            
        # Delete from database
        result = await db.datasets.delete_one({
            "_id": ObjectId(dataset_id),
            "user_id": str(current_user["_id"])
        })
        
        # Delete file from disk
        file_path = dataset.get("file_path")
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"Error deleting file {file_path}: {e}")
                
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error deleting dataset: {str(e)}"
        )
    
    # Also delete associated analysis
    await db.analyses.delete_many({"dataset_id": dataset_id})
    
    return {"message": "Dataset deleted successfully"}
