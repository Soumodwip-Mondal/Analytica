import pandas as pd
import numpy as np
from typing import Dict, List, Any, Tuple
from scipy import stats
import json

class DataAnalyzer:
    """Comprehensive data analysis and profiling"""
    
    def __init__(self, df: pd.DataFrame):
        self.df = df
    
    def get_basic_statistics(self) -> List[Dict[str, Any]]:
        """Calculate basic statistics for numerical columns"""
        stats_list = []
        
        for col in self.df.select_dtypes(include=[np.number]).columns:
            col_data = self.df[col].dropna()
            
            if len(col_data) > 0:
                stats_dict = {
                    "column": col,
                    "mean": float(col_data.mean()),
                    "median": float(col_data.median()),
                    "std": float(col_data.std()),
                    "min": float(col_data.min()),
                    "max": float(col_data.max()),
                    "q25": float(col_data.quantile(0.25)),
                    "q75": float(col_data.quantile(0.75))
                }
                
                # Try to calculate mode
                try:
                    mode_val = col_data.mode()
                    if len(mode_val) > 0:
                        stats_dict["mode"] = float(mode_val.iloc[0])
                except:
                    stats_dict["mode"] = None
                
                stats_list.append(stats_dict)
        
        return stats_list
    
    def detect_outliers(self, column: str) -> Tuple[int, List[float]]:
        """Detect outliers using IQR method"""
        if column not in self.df.columns:
            return 0, []
        
        col_data = self.df[column].dropna()
        
        if not pd.api.types.is_numeric_dtype(col_data):
            return 0, []
        
        q1 = col_data.quantile(0.25)
        q3 = col_data.quantile(0.75)
        iqr = q3 - q1
        
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        
        outliers = col_data[(col_data < lower_bound) | (col_data > upper_bound)]
        
        return len(outliers), outliers.tolist()[:10]  # Return first 10 outliers
    
    def get_data_quality_issues(self) -> List[Dict[str, Any]]:
        """Identify data quality issues"""
        issues = []
        
        # Check for missing values
        for col in self.df.columns:
            missing_count = self.df[col].isna().sum()
            if missing_count > 0:
                missing_pct = (missing_count / len(self.df)) * 100
                severity = "high" if missing_pct > 20 else ("medium" if missing_pct > 5 else "low")
                
                issues.append({
                    "column": col,
                    "issue_type": "missing_values",
                    "severity": severity,
                    "description": f"{missing_count} missing values ({missing_pct:.1f}%)",
                    "count": int(missing_count),
                    "percentage": round(missing_pct, 2)
                })
        
        # Check for outliers in numeric columns
        for col in self.df.select_dtypes(include=[np.number]).columns:
            outlier_count, outliers = self.detect_outliers(col)
            if outlier_count > 0:
                outlier_pct = (outlier_count / len(self.df)) * 100
                severity = "high" if outlier_pct > 10 else ("medium" if outlier_pct > 3 else "low")
                
                issues.append({
                    "column": col,
                    "issue_type": "outliers",
                    "severity": severity,
                    "description": f"{outlier_count} outliers detected ({outlier_pct:.1f}%)",
                    "count": outlier_count,
                    "percentage": round(outlier_pct, 2)
                })
        
        # Check for duplicates
        duplicate_count = self.df.duplicated().sum()
        if duplicate_count > 0:
            dup_pct = (duplicate_count / len(self.df)) * 100
            severity = "high" if dup_pct > 10 else ("medium" if dup_pct > 2 else "low")
            
            issues.append({
                "column": "all",
                "issue_type": "duplicates",
                "severity": severity,
                "description": f"{duplicate_count} duplicate rows ({dup_pct:.1f}%)",
                "count": int(duplicate_count),
                "percentage": round(dup_pct, 2)
            })
        
        # Check for data imbalance in categorical columns
        for col in self.df.select_dtypes(include=['object', 'category']).columns:
            value_counts = self.df[col].value_counts()
            if len(value_counts) > 1:
                max_pct = (value_counts.iloc[0] / len(self.df)) * 100
                if max_pct > 80:
                    issues.append({
                        "column": col,
                        "issue_type": "imbalance",
                        "severity": "medium",
                        "description": f"Highly imbalanced: '{value_counts.index[0]}' accounts for {max_pct:.1f}%",
                        "count": int(value_counts.iloc[0]),
                        "percentage": round(max_pct, 2)
                    })
        
        return issues
    
    def calculate_quality_score(self, quality_issues: List[Dict[str, Any]]) -> float:
        """Calculate overall data quality score (0-100)"""
        if not quality_issues:
            return 100.0
        
        # Deduct points based on severity
        deductions = 0
        for issue in quality_issues:
            if issue["severity"] == "high":
                deductions += 15
            elif issue["severity"] == "medium":
                deductions += 8
            else:
                deductions += 3
        
        score = max(0, 100 - deductions)
        return round(score, 1)
    
    def get_column_info(self) -> str:
        """Get formatted column information"""
        info_lines = []
        for col in self.df.columns:
            dtype = str(self.df[col].dtype)
            missing = self.df[col].isna().sum()
            unique = self.df[col].nunique()
            info_lines.append(f"- {col}: {dtype}, {missing} missing, {unique} unique values")
        return "\n".join(info_lines)
    
    def get_statistics_summary(self, stats: List[Dict[str, Any]]) -> str:
        """Format statistics for AI prompt"""
        if not stats:
            return "No numerical columns found"
        
        summary_lines = []
        for stat in stats:
            summary_lines.append(
                f"- {stat['column']}: mean={stat['mean']:.2f}, "
                f"median={stat['median']:.2f}, std={stat['std']:.2f}, "
                f"range=[{stat['min']:.2f}, {stat['max']:.2f}]"
            )
        return "\n".join(summary_lines)
    
    def get_quality_issues_summary(self, issues: List[Dict[str, Any]]) -> str:
        """Format quality issues for AI prompt"""
        if not issues:
            return "No significant data quality issues detected"
        
        issue_lines = []
        for issue in issues:
            issue_lines.append(f"- [{issue['severity'].upper()}] {issue['column']}: {issue['description']}")
        return "\n".join(issue_lines)
    
    def calculate_kpis(self) -> Dict[str, Any]:
        """Calculate key performance indicators"""
        kpis = {
            "total_records": int(len(self.df)),
            "total_columns": int(len(self.df.columns)),
            "numeric_columns": int(len(self.df.select_dtypes(include=[np.number]).columns)),
            "categorical_columns": int(len(self.df.select_dtypes(include=['object', 'category']).columns)),
            "missing_cells": int(self.df.isna().sum().sum()),
            "duplicate_rows": int(self.df.duplicated().sum()),
            "memory_usage_mb": round(self.df.memory_usage(deep=True).sum() / (1024 * 1024), 2)
        }
        
        # Calculate completeness percentage
        total_cells = len(self.df) * len(self.df.columns)
        kpis["data_completeness"] = round(((total_cells - kpis["missing_cells"]) / total_cells) * 100, 1)
        
        return kpis
