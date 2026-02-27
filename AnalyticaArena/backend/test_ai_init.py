import os
import sys
from dotenv import load_dotenv

# Add current directory to path so we can import services
sys.path.append(os.getcwd())

load_dotenv()

try:
    print("Attempting to import AIService...")
    from services.ai_service import AIService
    print("Import successful. Initializing AIService...")
    service = AIService()
    print("Initialization successful.")
    if service.model:
        print(f"Model initialized: {service.model.model_name}")
    else:
        print("Model is None (API key missing?)")
except Exception as e:
    print(f"FAILED to initialize AIService: {e}")
    import traceback
    traceback.print_exc()
