import google.generativeai as genai
import os
import json
from typing import Dict, Any, List
from utils.prompts import (
    fill_insight_prompt,
    fill_nl_to_code_prompt,
    fill_chart_suggestion_prompt,
    fill_report_prompt
)

class AIService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
    
    async def generate_insights(self, dataset_info: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate AI insights from dataset summary"""
        try:
            prompt = fill_insight_prompt(
                dataset_name=dataset_info.get("name", "Dataset"),
                num_rows=dataset_info["num_rows"],
                num_columns=dataset_info["num_columns"],
                column_info=dataset_info["column_info"],
                statistics=dataset_info["statistics"],
                quality_issues=dataset_info["quality_issues"]
            )
            
            response = self.model.generate_content(prompt)
            
            # Parse JSON response
            insights_text = response.text.strip()
            # Remove markdown code blocks if present
            if insights_text.startswith("```json"):
                insights_text = insights_text[7:]
            if insights_text.startswith("```"):
                insights_text = insights_text[3:]
            if insights_text.endswith("```"):
                insights_text = insights_text[:-3]
            
            insights = json.loads(insights_text.strip())
            return insights
            
        except json.JSONDecodeError as e:
            print(f"Failed to parse AI response as JSON: {e}")
            # Return fallback insights
            return [{
                "title": "Dataset Overview",
                "description": f"Dataset contains {dataset_info['num_rows']} rows and {dataset_info['num_columns']} columns.",
                "category": "pattern",
                "importance": "medium"
            }]
        except Exception as e:
            print(f"Error generating insights: {e}")
            return []
    
    async def natural_language_to_code(self, question: str, dataset_info: Dict[str, Any]) -> Dict[str, Any]:
        """Convert natural language question to Pandas code"""
        try:
            prompt = fill_nl_to_code_prompt(
                columns=dataset_info["columns"],
                column_types=dataset_info["column_types"],
                shape=dataset_info["shape"],
                question=question
            )
            
            response = self.model.generate_content(prompt)
            result_text = response.text.strip()
            
            # Clean markdown formatting
            if result_text.startswith("```json"):
                result_text = result_text[7:]
            if result_text.startswith("```"):
                result_text = result_text[3:]
            if result_text.endswith("```"):
                result_text = result_text[:-3]
            
            result = json.loads(result_text.strip())
            return result
            
        except Exception as e:
            print(f"Error converting NL to code: {e}")
            return {
                "code": None,
                "needs_chart": False,
                "error": str(e)
            }
    
    async def suggest_charts(self, dataset_info: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Suggest appropriate charts for the dataset"""
        try:
            prompt = fill_chart_suggestion_prompt(
                columns=dataset_info["columns"],
                column_types=dataset_info["column_types"],
                sample_data=dataset_info["sample_data"]
            )
            
            response = self.model.generate_content(prompt)
            charts_text = response.text.strip()
            
            # Clean markdown formatting
            if charts_text.startswith("```json"):
                charts_text = charts_text[7:]
            if charts_text.startswith("```"):
                charts_text = charts_text[3:]
            if charts_text.endswith("```"):
                charts_text = charts_text[:-3]
            
            charts = json.loads(charts_text.strip())
            return charts
            
        except Exception as e:
            print(f"Error suggesting charts: {e}")
            return []
    
    async def generate_report(self, dataset_name: str, statistics: str, 
                             insights: str, chart_descriptions: str) -> str:
        """Generate comprehensive report"""
        try:
            prompt = fill_report_prompt(
                dataset_name=dataset_name,
                statistics=statistics,
                insights=insights,
                chart_descriptions=chart_descriptions
            )
            
            response = self.model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            print(f"Error generating report: {e}")
            return f"# Analysis Report\n\nError generating report: {str(e)}"

# Singleton instance
ai_service = AIService()
