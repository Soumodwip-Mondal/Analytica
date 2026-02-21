from fastapi import APIRouter, Depends, HTTPException, status, Request
from bson import ObjectId
import pandas as pd
from datetime import datetime
from typing import List
import os

from routes.auth import get_current_user
from models.chat_model import ChatQuery, ChatResponse, ChatSession, ChatMessage
from services.ai_service import ai_service
from services.query_executor import QueryExecutor
from services.chart_generator import ChartGenerator
from utils.database import get_database
from utils.limiter import limiter

router = APIRouter(prefix="/api/chat", tags=["chat"])

# Get rate limit from environment variable (default: 10 requests per minute)
CHAT_RATE_LIMIT = os.getenv("CHAT_RATE_LIMIT", "10/minute")

@router.post("/query", response_model=ChatResponse)
@limiter.limit(CHAT_RATE_LIMIT)
async def chat_query(
    request: Request,
    query: ChatQuery,
    current_user: dict = Depends(get_current_user)
):
    """Process a natural language query about the dataset"""
    db = get_database()
    
    # Get dataset
    try:
        dataset = await db.datasets.find_one({
            "_id": ObjectId(query.dataset_id),
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
    
    # Load DataFrame
    try:
        df = pd.read_json(dataset["data"], orient='records')
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error loading dataset: {str(e)}"
        )
    
    # Prepare dataset info for AI
    column_types = {col["name"]: col["semantic_type"] for col in dataset["columns"]}
    dataset_info = {
        "columns": list(df.columns),
        "column_types": column_types,
        "shape": df.shape
    }
    
    # Convert natural language to code
    try:
        ai_response = await ai_service.natural_language_to_code(query.message, dataset_info)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing query: {str(e)}"
        )
    
    if "error" in ai_response:
        return ChatResponse(
            message=f"I couldn't process that query: {ai_response['error']}",
            data=None,
            chart_config=None
        )
    
    # Execute the generated code
    code = ai_response.get("code")
    if not code:
        return ChatResponse(
            message="I couldn't generate code for that query. Can you rephrase?",
            data=None,
            chart_config=None
        )
    
    execution_result = QueryExecutor.execute_query(df, code)
    
    if not execution_result["success"]:
        return ChatResponse(
            message=f"Error executing query: {execution_result['error']}",
            data=None,
            chart_config=None,
            generated_code=code
        )
    
    # Format result
    result_data = execution_result["result"]
    result_type = execution_result["result_type"]
    
    # Generate chart if needed
    chart_config = None
    if ai_response.get("needs_chart") and ai_response.get("chart_config"):
        chart_spec = ai_response["chart_config"]
        
        # If result is a DataFrame or Series, use it for chart
        if result_type in ["DataFrame", "Series"]:
            # Convert result to DataFrame if needed
            if isinstance(result_data, list):
                result_df = pd.DataFrame(result_data)
            elif isinstance(result_data, dict):
                result_df = pd.DataFrame([result_data])
            else:
                result_df = df  # Use original dataframe
            
            # Generate chart data
            if len(result_df) > 0:
                chart_config = {
                    "chart_type": chart_spec.get("type", "bar"),
                    "title": chart_spec.get("title", "Query Result"),
                    "x_column": chart_spec.get("x_column"),
                    "y_column": chart_spec.get("y_column"),
                    "data": ChartGenerator.generate_chart_data(result_df, chart_spec)
                }
    
    # Create response message
    formatted_result = QueryExecutor.format_result_for_display(result_data, result_type)
    
    # Save to chat history
    try:
        chat_message_user = {
            "role": "user",
            "content": query.message,
            "timestamp": datetime.utcnow()
        }
        
        chat_message_assistant = {
            "role": "assistant",
            "content": formatted_result,
            "timestamp": datetime.utcnow(),
            "query_result": result_data,
            "chart_config": chart_config
        }
        
        # Find or create chat session
        chat_session = await db.chat_sessions.find_one({
            "user_id": str(current_user["_id"]),
            "dataset_id": query.dataset_id
        })
        
        if chat_session:
            # Append to existing session
            await db.chat_sessions.update_one(
                {"_id": chat_session["_id"]},
                {
                    "$push": {
                        "messages": {
                            "$each": [chat_message_user, chat_message_assistant]
                        }
                    },
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
        else:
            # Create new session
            new_session = {
                "user_id": str(current_user["_id"]),
                "dataset_id": query.dataset_id,
                "messages": [chat_message_user, chat_message_assistant],
                "created_at": datetime.utcnow()
            }
            await db.chat_sessions.insert_one(new_session)
    
    except Exception as e:
        print(f"Error saving chat history: {e}")
    
    return ChatResponse(
        message=formatted_result,
        data=result_data,
        chart_config=chart_config,
        generated_code=code
    )

@router.get("/history/{dataset_id}")
async def get_chat_history(
    dataset_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get chat history for a dataset"""
    db = get_database()
    
    chat_session = await db.chat_sessions.find_one({
        "user_id": str(current_user["_id"]),
        "dataset_id": dataset_id
    })
    
    if not chat_session:
        return {"messages": []}
    
    return {
        "session_id": str(chat_session["_id"]),
        "messages": chat_session["messages"],
        "created_at": chat_session["created_at"]
    }

@router.delete("/history/{dataset_id}")
async def clear_chat_history(
    dataset_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Clear chat history for a dataset"""
    db = get_database()
    
    result = await db.chat_sessions.delete_many({
        "user_id": str(current_user["_id"]),
        "dataset_id": dataset_id
    })
    
    return {"message": f"Cleared {result.deleted_count} chat session(s)"}
