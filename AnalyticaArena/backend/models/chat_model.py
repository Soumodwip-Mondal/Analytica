from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from bson import ObjectId

class ChatMessage(BaseModel):
    role: str  # user or assistant
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    chart_config: Optional[Dict[str, Any]] = None
    query_result: Optional[Any] = None

class ChatSession(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    user_id: str
    dataset_id: str
    messages: List[ChatMessage] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class ChatQuery(BaseModel):
    dataset_id: str
    message: str

class ChatResponse(BaseModel):
    message: str
    data: Optional[Any] = None
    chart_config: Optional[Dict[str, Any]] = None
    generated_code: Optional[str] = None
