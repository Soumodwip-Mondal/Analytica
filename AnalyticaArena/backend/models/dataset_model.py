from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime
from bson import ObjectId

class ColumnInfo(BaseModel):
    name: str
    dtype: str
    semantic_type: str  # numeric, categorical, datetime, text, identifier
    missing_count: int
    missing_percentage: float
    unique_count: int
    sample_values: List[Any] = []

class DatasetMetadata(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    user_id: str
    filename: str
    original_filename: str
    file_size: int
    file_type: str  # csv, xlsx, json
    
    # Data information
    num_rows: int
    num_columns: int
    columns: List[ColumnInfo]
    
    # Storage
    file_path: Optional[str] = None  # GridFS file ID or path
    
    # Timestamps
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    last_accessed: Optional[datetime] = None
    
    # Status
    is_analyzed: bool = False
    analysis_id: Optional[str] = None

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class DatasetCreate(BaseModel):
    filename: str
    file_type: str

class DatasetResponse(BaseModel):
    id: str
    filename: str
    num_rows: int
    num_columns: int
    uploaded_at: datetime
    is_analyzed: bool
