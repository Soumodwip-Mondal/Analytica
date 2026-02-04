import pandas as pd
from typing import Dict, Any
import io
import sys
from contextlib import redirect_stdout, redirect_stderr

class QueryExecutor:
    """Safely execute AI-generated Pandas code on datasets"""
    
    @staticmethod
    def execute_query(df: pd.DataFrame, code: str) -> Dict[str, Any]:
        """
        Execute Pandas code in a restricted environment
        Returns: {success: bool, result: Any, error: str}
        """
        
        # Create a safe execution environment
        safe_globals = {
            'pd': pd,
            'df': df.copy(),  # Work on a copy to prevent modifications
            '__builtins__': {
                'print': print,
                'len': len,
                'str': str,
                'int': int,
                'float': float,
                'bool': bool,
                'list': list,
                'dict': dict,
                'tuple': tuple,
                'set': set,
                'min': min,
                'max': max,
                'sum': sum,
                'round': round,
                'abs': abs,
            }
        }
        
        safe_locals = {}
        
        try:
            # Capture stdout and stderr
            stdout_capture = io.StringIO()
            stderr_capture = io.StringIO()
            
            with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
                # Execute the code
                exec(code, safe_globals, safe_locals)
            
            # Get the result
            result = safe_locals.get('result', None)
            
            # Convert result to JSON-serializable format
            if isinstance(result, pd.DataFrame):
                result_data = result.head(100).to_dict(orient='records')
            elif isinstance(result, pd.Series):
                result_data = result.head(100).to_dict()
            elif isinstance(result, (list, dict, str, int, float, bool)):
                result_data = result
            else:
                result_data = str(result)
            
            return {
                "success": True,
                "result": result_data,
                "result_type": type(result).__name__,
                "error": None
            }
            
        except Exception as e:
            return {
                "success": False,
                "result": None,
                "result_type": None,
                "error": str(e)
            }
    
    @staticmethod
    def format_result_for_display(result: Any, result_type: str) -> str:
        """Format query result for chat display"""
        if result is None:
            return "No result returned"
        
        if result_type == "DataFrame":
            if isinstance(result, list) and len(result) > 0:
                return f"Found {len(result)} records"
            return "Empty result"
        
        elif result_type == "Series":
            if isinstance(result, dict):
                return "\n".join([f"{k}: {v}" for k, v in list(result.items())[:10]])
            return str(result)
        
        elif isinstance(result, (int, float)):
            return f"Result: {result:,}"
        
        elif isinstance(result, list):
            if len(result) <= 5:
                return str(result)
            return f"{result[:5]}... ({len(result)} items total)"
        
        return str(result)
