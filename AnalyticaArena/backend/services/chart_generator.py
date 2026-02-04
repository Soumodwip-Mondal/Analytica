import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional
from bson import ObjectId

class ChartGenerator:
    """Generate chart configurations based on data analysis"""
    
    @staticmethod
    def detect_chart_type(x_type: str, y_type: Optional[str] = None) -> str:
        """Detect appropriate chart type based on column types"""
        
        # Single numeric column -> Histogram
        if y_type is None and x_type in ["numeric_continuous", "numeric_discrete"]:
            return "histogram"
        
        # Categorical + Numeric -> Bar chart
        if x_type == "categorical" and y_type in ["numeric_continuous", "numeric_discrete"]:
            return "bar"
        
        # Numeric + Numeric -> Scatter
        if x_type in ["numeric_continuous", "numeric_discrete"] and y_type in ["numeric_continuous", "numeric_discrete"]:
            return "scatter"
        
        # Datetime + Numeric -> Line chart
        if x_type in ["datetime", "datetime_string"] and y_type in ["numeric_continuous", "numeric_discrete"]:
            return "line"
        
        # Categorical distribution -> Pie chart
        if x_type == "categorical" and y_type is None:
            return "pie"
        
        # Default
        return "bar"
    
    @staticmethod
    def generate_chart_data(df: pd.DataFrame, config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate chart data based on configuration"""
        chart_type = config.get("chart_type")
        x_column = config.get("x_column")
        y_column = config.get("y_column")
        group_by = config.get("group_by")
        aggregation = config.get("aggregation", "sum")
        
        data = []
        
        try:
            if chart_type == "bar":
                if group_by:
                    # Grouped bar chart
                    grouped = df.groupby([x_column, group_by])[y_column]
                    if aggregation == "mean":
                        result = grouped.mean()
                    elif aggregation == "count":
                        result = grouped.count()
                    else:
                        result = grouped.sum()
                    
                    for (x_val, group_val), y_val in result.items():
                        data.append({
                            "x": str(x_val),
                            "y": float(y_val) if not pd.isna(y_val) else 0,
                            "group": str(group_val)
                        })
                else:
                    # Simple bar chart
                    grouped = df.groupby(x_column)[y_column]
                    if aggregation == "mean":
                        result = grouped.mean()
                    elif aggregation == "count":
                        result = grouped.count()
                    else:
                        result = grouped.sum()
                    
                    for x_val, y_val in result.items():
                        data.append({
                            "x": str(x_val),
                            "y": float(y_val) if not pd.isna(y_val) else 0
                        })
            
            elif chart_type == "line":
                # Sort by x-axis (usually datetime)
                df_sorted = df.sort_values(x_column)
                if aggregation != "none":
                    grouped = df_sorted.groupby(x_column)[y_column]
                    if aggregation == "mean":
                        result = grouped.mean()
                    elif aggregation == "count":
                        result = grouped.count()
                    else:
                        result = grouped.sum()
                    
                    for x_val, y_val in result.items():
                        data.append({
                            "x": str(x_val),
                            "y": float(y_val) if not pd.isna(y_val) else 0
                        })
                else:
                    for _, row in df_sorted.head(100).iterrows():  # Limit to 100 points
                        data.append({
                            "x": str(row[x_column]),
                            "y": float(row[y_column]) if not pd.isna(row[y_column]) else 0
                        })
            
            elif chart_type == "scatter":
                # Scatter plot (limit to 500 points for performance)
                sample_df = df.sample(min(500, len(df)))
                for _, row in sample_df.iterrows():
                    data.append({
                        "x": float(row[x_column]) if not pd.isna(row[x_column]) else 0,
                        "y": float(row[y_column]) if not pd.isna(row[y_column]) else 0
                    })
            
            elif chart_type == "pie":
                # Pie chart - show top categories
                value_counts = df[x_column].value_counts().head(10)
                for category, count in value_counts.items():
                    data.append({
                        "name": str(category),
                        "value": int(count)
                    })
            
            elif chart_type == "histogram":
                # Histogram - create bins
                col_data = df[x_column].dropna()
                hist, bin_edges = np.histogram(col_data, bins=20)
                for i in range(len(hist)):
                    data.append({
                        "x": f"{bin_edges[i]:.2f}-{bin_edges[i+1]:.2f}",
                        "y": int(hist[i])
                    })
        
        except Exception as e:
            print(f"Error generating chart data: {e}")
            return []
        
        return data
    
    @staticmethod
    def create_chart_configs(df: pd.DataFrame, column_types: Dict[str, str],
                            ai_suggestions: Optional[List[Dict[str, Any]]] = None) -> List[Dict[str, Any]]:
        """Create chart configurations from AI suggestions or auto-detect"""
        
        charts = []
        
        if ai_suggestions:
            # Use AI-suggested charts
            for suggestion in ai_suggestions[:6]:  # Limit to 6 charts
                config = {
                    "id": str(ObjectId()),
                    "chart_type": suggestion.get("chart_type", "bar"),
                    "title": suggestion.get("title", "Chart"),
                    "description": suggestion.get("description", ""),
                    "x_column": suggestion.get("x_column"),
                    "y_column": suggestion.get("y_column"),
                    "group_by": suggestion.get("group_by"),
                    "aggregation": suggestion.get("aggregation", "sum")
                }
                
                # Generate actual data
                if config["x_column"] and config["x_column"] in df.columns:
                    config["data"] = ChartGenerator.generate_chart_data(df, config)
                    charts.append(config)
        
        else:
            # Auto-generate charts based on data types
            numeric_cols = [col for col, dtype in column_types.items() 
                           if dtype in ["numeric_continuous", "numeric_discrete"]]
            categorical_cols = [col for col, dtype in column_types.items() 
                               if dtype == "categorical"]
            datetime_cols = [col for col, dtype in column_types.items() 
                            if dtype in ["datetime", "datetime_string"]]
            
            # 1. Distribution of first numeric column (histogram)
            if numeric_cols:
                config = {
                    "id": str(ObjectId()),
                    "chart_type": "histogram",
                    "title": f"Distribution of {numeric_cols[0]}",
                    "description": f"Frequency distribution of {numeric_cols[0]}",
                    "x_column": numeric_cols[0],
                    "y_column": None,
                    "aggregation": "none"
                }
                config["data"] = ChartGenerator.generate_chart_data(df, config)
                charts.append(config)
            
            # 2. Categorical vs Numeric (bar chart)
            if categorical_cols and numeric_cols:
                config = {
                    "id": str(ObjectId()),
                    "chart_type": "bar",
                    "title": f"{numeric_cols[0]} by {categorical_cols[0]}",
                    "description": f"Average {numeric_cols[0]} across {categorical_cols[0]} categories",
                    "x_column": categorical_cols[0],
                    "y_column": numeric_cols[0],
                    "aggregation": "mean"
                }
                config["data"] = ChartGenerator.generate_chart_data(df, config)
                charts.append(config)
            
            # 3. Time series (line chart)
            if datetime_cols and numeric_cols:
                config = {
                    "id": str(ObjectId()),
                    "chart_type": "line",
                    "title": f"{numeric_cols[0]} over Time",
                    "description": f"Trend of {numeric_cols[0]} over {datetime_cols[0]}",
                    "x_column": datetime_cols[0],
                    "y_column": numeric_cols[0],
                    "aggregation": "sum"
                }
                config["data"] = ChartGenerator.generate_chart_data(df, config)
                charts.append(config)
            
            # 4. Categorical distribution (pie chart)
            if categorical_cols:
                config = {
                    "id": str(ObjectId()),
                    "chart_type": "pie",
                    "title": f"Distribution of {categorical_cols[0]}",
                    "description": f"Proportion of different {categorical_cols[0]} categories",
                    "x_column": categorical_cols[0],
                    "y_column": None,
                    "aggregation": "count"
                }
                config["data"] = ChartGenerator.generate_chart_data(df, config)
                charts.append(config)
            
            # 5. Numeric vs Numeric (scatter)
            if len(numeric_cols) >= 2:
                config = {
                    "id": str(ObjectId()),
                    "chart_type": "scatter",
                    "title": f"{numeric_cols[0]} vs {numeric_cols[1]}",
                    "description": f"Relationship between {numeric_cols[0]} and {numeric_cols[1]}",
                    "x_column": numeric_cols[0],
                    "y_column": numeric_cols[1],
                    "aggregation": "none"
                }
                config["data"] = ChartGenerator.generate_chart_data(df, config)
                charts.append(config)
        
        return charts

# Helper function
def generate_charts(df: pd.DataFrame, column_types: Dict[str, str],
                   ai_suggestions: Optional[List[Dict[str, Any]]] = None) -> List[Dict[str, Any]]:
    """Convenience function to generate charts"""
    return ChartGenerator.create_chart_configs(df, column_types, ai_suggestions)
