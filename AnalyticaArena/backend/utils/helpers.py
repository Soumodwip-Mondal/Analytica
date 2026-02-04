import pandas as pd
import numpy as np
from typing import Dict, Any, List
import mimetypes
from datetime import datetime

ALLOWED_EXTENSIONS = {'.csv', '.xlsx', '.xls', '.json'}
ALLOWED_MIME_TYPES = {
    'text/csv', 
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/json'
}

def validate_file(filename: str, file_size: int, max_size_mb: int = 50) -> Dict[str, Any]:
    """Validate uploaded file"""
    errors = []
    
    # Check file extension
    file_ext = '.' + filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    if file_ext not in ALLOWED_EXTENSIONS:
        errors.append(f"File type {file_ext} not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}")
    
    # Check file size
    max_size_bytes = max_size_mb * 1024 * 1024
    if file_size > max_size_bytes:
        errors.append(f"File size {file_size / (1024*1024):.2f}MB exceeds maximum {max_size_mb}MB")
    
    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "extension": file_ext
    }

def infer_column_types(df: pd.DataFrame) -> Dict[str, str]:
    """Infer semantic types for each column"""
    column_types = {}
    
    for col in df.columns:
        dtype = df[col].dtype
        
        # Check if numeric
        if pd.api.types.is_numeric_dtype(dtype):
            # Check if it's actually an ID or categorical
            unique_ratio = df[col].nunique() / len(df)
            if unique_ratio > 0.9:
                column_types[col] = "identifier"
            elif df[col].nunique() < 20:
                column_types[col] = "categorical"
            elif pd.api.types.is_float_dtype(dtype):
                column_types[col] = "numeric_continuous"
            else:
                column_types[col] = "numeric_discrete"
        
        # Check if datetime
        elif pd.api.types.is_datetime64_any_dtype(dtype):
            column_types[col] = "datetime"
        
        # Check if object (string)
        else:
            # Try to parse as datetime
            try:
                pd.to_datetime(df[col].dropna().head(100), errors='raise')
                column_types[col] = "datetime_string"
            except:
                unique_count = df[col].nunique()
                if unique_count < 20:
                    column_types[col] = "categorical"
                else:
                    column_types[col] = "text"
    
    return column_types

def format_number(num: float) -> str:
    """Format numbers for display"""
    if pd.isna(num):
        return "N/A"
    if abs(num) >= 1e6:
        return f"{num/1e6:.2f}M"
    elif abs(num) >= 1e3:
        return f"{num/1e3:.2f}K"
    else:
        return f"{num:.2f}"

def safe_serialize(obj: Any) -> Any:
    """Safely serialize objects for JSON"""
    if isinstance(obj, (np.integer, np.int64)):
        return int(obj)
    elif isinstance(obj, (np.floating, np.float64)):
        if np.isnan(obj) or np.isinf(obj):
            return None
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, datetime):
        return obj.isoformat()
    elif pd.isna(obj):
        return None
    return obj
