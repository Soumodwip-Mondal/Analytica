from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
import pandas as pd
import io
import json
from datetime import datetime

from routes.auth import get_current_user
from models.analysis_model import AnalysisResult, AnalysisResponse, Insight, ChartConfig
from services.data_analysis import DataAnalyzer
from services.ai_service import ai_service
from services.chart_generator import generate_charts
from utils.database import get_database
from utils.helpers import safe_serialize

router = APIRouter(prefix="/api/analysis", tags=["analysis"])

@router.post("/analyze/{dataset_id}", response_model=AnalysisResponse)
async def analyze_dataset(
    dataset_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Perform comprehensive analysis on a dataset"""
    db = get_database()
    
    # Get dataset
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
    
    # Load DataFrame from stored file
    try:
        file_path = dataset.get("file_path")
        if not file_path or not os.path.exists(file_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Dataset file not found on disk"
            )
        
        file_ext = os.path.splitext(file_path)[1].lower()
        if file_ext == '.csv':
            df = pd.read_csv(file_path)
        elif file_ext in ['.xlsx', '.xls']:
            df = pd.read_excel(file_path)
        elif file_ext == '.json':
            df = pd.read_json(file_path)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file extension: {file_ext}"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error loading dataset: {str(e)}"
        )
    
    # Initialize analyzer
    analyzer = DataAnalyzer(df)
    
    # Get statistics
    statistics = analyzer.get_basic_statistics()
    
    # Get quality issues
    quality_issues = analyzer.get_data_quality_issues()
    
    # Calculate quality score
    quality_score = analyzer.calculate_quality_score(quality_issues)
    
    # Calculate KPIs
    kpis = analyzer.calculate_kpis()
    
    # Prepare data for AI
    column_types = {col["name"]: col["semantic_type"] for col in dataset["columns"]}
    
    dataset_info = {
        "name": dataset["filename"],
        "num_rows": len(df),
        "num_columns": len(df.columns),
        "column_info": analyzer.get_column_info(),
        "statistics": analyzer.get_statistics_summary(statistics),
        "quality_issues": analyzer.get_quality_issues_summary(quality_issues),
        "columns": list(df.columns),
        "column_types": column_types,
        "sample_data": df.head(5).to_string()
    }
    
    # Generate AI insights
    try:
        ai_insights = await ai_service.generate_insights(dataset_info)
    except Exception as e:
        print(f"Error generating AI insights: {e}")
        ai_insights = []
    
    # Get chart suggestions from AI
    try:
        ai_chart_suggestions = await ai_service.suggest_charts(dataset_info)
    except Exception as e:
        print(f"Error getting chart suggestions: {e}")
        ai_chart_suggestions = None
    
    # Generate charts
    charts = generate_charts(df, column_types, ai_chart_suggestions)
    
    # Create analysis document
    analysis_doc = {
        "dataset_id": dataset_id,
        "user_id": str(current_user["_id"]),
        "statistics": [safe_serialize(stat) for stat in statistics],
        "quality_score": quality_score,
        "quality_issues": [safe_serialize(issue) for issue in quality_issues],
        "insights": ai_insights,
        "charts": [safe_serialize(chart) for chart in charts],
        "kpis": {k: safe_serialize(v) for k, v in kpis.items()},
        "created_at": datetime.utcnow()
    }
    
    # Save to database
    result = await db.analyses.insert_one(analysis_doc)
    analysis_id = str(result.inserted_id)
    
    # Update dataset with analysis ID
    await db.datasets.update_one(
        {"_id": ObjectId(dataset_id)},
        {"$set": {"is_analyzed": True, "analysis_id": analysis_id}}
    )
    
    return AnalysisResponse(
        id=analysis_id,
        dataset_id=dataset_id,
        quality_score=quality_score,
        insights=[Insight(**insight) for insight in ai_insights],
        charts=[ChartConfig(**chart) for chart in charts],
        kpis=kpis,
        created_at=analysis_doc["created_at"]
    )

@router.get("/{dataset_id}", response_model=AnalysisResponse)
async def get_analysis(
    dataset_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get existing analysis for a dataset"""
    db = get_database()
    
    # Find analysis
    analysis = await db.analyses.find_one({
        "dataset_id": dataset_id,
        "user_id": str(current_user["_id"])
    })
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found. Please run analysis first."
        )
    
    return AnalysisResponse(
        id=str(analysis["_id"]),
        dataset_id=dataset_id,
        quality_score=analysis["quality_score"],
        insights=[Insight(**insight) for insight in analysis["insights"]],
        charts=[ChartConfig(**chart) for chart in analysis["charts"]],
        kpis=analysis["kpis"],
        created_at=analysis["created_at"]
    )

@router.get("/{dataset_id}/quality")
async def get_data_quality(
    dataset_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get detailed data quality report"""
    db = get_database()
    
    analysis = await db.analyses.find_one({
        "dataset_id": dataset_id,
        "user_id": str(current_user["_id"])
    })
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    return {
        "quality_score": analysis["quality_score"],
        "quality_issues": analysis["quality_issues"],
        "statistics": analysis["statistics"]
    }

@router.get("/{dataset_id}/insights")
async def get_insights(
    dataset_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get AI-generated insights"""
    db = get_database()
    
    analysis = await db.analyses.find_one({
        "dataset_id": dataset_id,
        "user_id": str(current_user["_id"])
    })
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    return {
        "insights": analysis["insights"]
    }
