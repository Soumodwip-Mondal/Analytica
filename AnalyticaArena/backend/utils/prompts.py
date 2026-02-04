"""Prompt templates for Gemini AI"""

INSIGHT_GENERATION_PROMPT = """You are an expert data analyst. Analyze the following dataset summary and provide actionable business insights.

Dataset Name: {dataset_name}
Number of Rows: {num_rows}
Number of Columns: {num_columns}

Column Information:
{column_info}

Statistical Summary:
{statistics}

Data Quality Issues:
{quality_issues}

Task: Generate 5-8 key insights about this dataset. For each insight:
1. Identify a pattern, trend, or anomaly
2. Explain its significance
3. Suggest a business action or recommendation

Format your response as a JSON array with this structure:
[
  {{
    "title": "Brief insight title",
    "description": "Detailed explanation of the insight",
    "category": "trend|pattern|anomaly|recommendation",
    "importance": "high|medium|low"
  }}
]

Only return valid JSON, no additional text."""

NL_TO_CODE_PROMPT = """You are a Python data analysis code generator. Convert the user's natural language question into safe Pandas code.

Dataset Information:
- Columns: {columns}
- Column Types: {column_types}
- Shape: {shape}

User Question: {question}

Rules:
1. The dataframe is available as variable 'df'
2. Only use Pandas operations, no external libraries
3. Return a dictionary with 'code' and 'chart_config' keys
4. Code should handle errors gracefully
5. If visualizable, provide chart configuration

Example response format:
{{
  "code": "result = df.groupby('category')['value'].mean().sort_values(ascending=False).head(5)",
  "needs_chart": true,
  "chart_config": {{
    "type": "bar",
    "x_column": "category",
    "y_column": "value",
    "title": "Top 5 Categories by Average Value"
  }}
}}

Generate the response as valid JSON only."""

CHART_SUGGESTION_PROMPT = """You are a data visualization expert. Suggest the best charts for this dataset.

Dataset Information:
Columns: {columns}
Column Types: {column_types}
Sample Data:
{sample_data}

Task: Suggest 4-6 meaningful charts that would provide valuable insights.

For each chart, consider:
- What patterns or relationships it reveals
- Why it's valuable for understanding the data
- Appropriate chart type based on data types

Return a JSON array with this structure:
[
  {{
    "chart_type": "bar|line|pie|scatter|histogram|box",
    "title": "Chart title",
    "description": "What this chart reveals",
    "x_column": "column_name or null",
    "y_column": "column_name or null",
    "group_by": "column_name or null",
    "aggregation": "sum|mean|count|none"
  }}
]

Only return valid JSON."""

REPORT_GENERATION_PROMPT = """You are a professional data analyst writing an executive report.

Dataset: {dataset_name}
Statistics: {statistics}
Insights: {insights}
Charts: {chart_descriptions}

Create a comprehensive analytics report with these sections:

1. Executive Summary (2-3 sentences)
2. Dataset Overview
3. Key Findings (3-5 main findings)
4. Detailed Insights
5. Recommendations (3-5 actionable items)
6. Conclusion

Write in a professional, clear, and actionable tone. Use markdown formatting.
Focus on business value, not technical details."""

def fill_insight_prompt(dataset_name: str, num_rows: int, num_columns: int, 
                       column_info: str, statistics: str, quality_issues: str) -> str:
    """Fill insight generation prompt template"""
    return INSIGHT_GENERATION_PROMPT.format(
        dataset_name=dataset_name,
        num_rows=num_rows,
        num_columns=num_columns,
        column_info=column_info,
        statistics=statistics,
        quality_issues=quality_issues
    )

def fill_nl_to_code_prompt(columns: list, column_types: dict, shape: tuple, question: str) -> str:
    """Fill natural language to code prompt template"""
    return NL_TO_CODE_PROMPT.format(
        columns=", ".join(columns),
        column_types=str(column_types),
        shape=f"{shape[0]} rows × {shape[1]} columns",
        question=question
    )

def fill_chart_suggestion_prompt(columns: list, column_types: dict, sample_data: str) -> str:
    """Fill chart suggestion prompt template"""
    return CHART_SUGGESTION_PROMPT.format(
        columns=", ".join(columns),
        column_types=str(column_types),
        sample_data=sample_data
    )

def fill_report_prompt(dataset_name: str, statistics: str, insights: str, chart_descriptions: str) -> str:
    """Fill report generation prompt template"""
    return REPORT_GENERATION_PROMPT.format(
        dataset_name=dataset_name,
        statistics=statistics,
        insights=insights,
        chart_descriptions=chart_descriptions
    )
