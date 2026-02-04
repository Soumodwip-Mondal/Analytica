from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
from datetime import datetime
from bson import ObjectId

class StatisticalSummary(BaseModel):
    column: str
    mean: Optional[float] = None
    median: Optional[float] = None
    mode: Optional[Any] = None
    std: Optional[float] = None
    min: Optional[float] = None
    max: Optional[float] = None
    q25: Optional[float] = None
    q75: Optional[float] = None

class DataQualityIssue(BaseModel):
    column: str
    issue_type: str  # missing_values, outliers, duplicates, imbalance
    severity: str  # high, medium, low
    description: str
    count: int
    percentage: Optional[float] = None

class Insight(BaseModel):
    title: str
    description: str
    category: str  # trend, pattern, anomaly, recommendation
    importance: str  # high, medium, low

class ChartConfig(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    chart_type: str  # bar, line, pie, scatter, histogram, box
    title: str
    description: Optional[str] = None
    x_column: Optional[str] = None
    y_column: Optional[str] = None
    group_by: Optional[str] = None
    aggregation: Optional[str] = None  # sum, mean, count, none
    data: List[Dict[str, Any]] = []
    config: Dict[str, Any] = {}

class AnalysisResult(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    dataset_id: str
    user_id: str
    
    # Statistical analysis
    statistics: List[StatisticalSummary] = []
    
    # Data quality
    quality_score: float  # 0-100
    quality_issues: List[DataQualityIssue] = []
    
    # AI-generated insights
    insights: List[Insight] = []
    
    # Suggested charts
    charts: List[ChartConfig] = []
    
    # KPIs
    kpis: Dict[str, Any] = {}
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class AnalysisResponse(BaseModel):
    id: str
    dataset_id: str
    quality_score: float
    insights: List[Insight]
    charts: List[ChartConfig]
    kpis: Dict[str, Any]
    created_at: datetime
