#!/usr/bin/env python3
"""
Quick test script to verify GitHub OAuth configuration
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def check_config():
    print("🔍 Checking GitHub OAuth Configuration...\n")
    
    # Check required variables
    required_vars = {
        'GITHUB_CLIENT_ID': os.getenv('GITHUB_CLIENT_ID'),
        'GITHUB_CLIENT_SECRET': os.getenv('GITHUB_CLIENT_SECRET'),
        'GITHUB_REDIRECT_URI': os.getenv('GITHUB_REDIRECT_URI', 'http://localhost:8000/api/auth/github/callback'),
        'FRONTEND_OAUTH_CALLBACK': os.getenv('FRONTEND_OAUTH_CALLBACK', 'http://localhost:5173/oauth/callback'),
    }
    
    all_set = True
    for var_name, var_value in required_vars.items():
        if var_value:
            # Mask secrets
            if 'SECRET' in var_name:
                display_value = var_value[:8] + '...' + var_value[-4:]
            else:
                display_value = var_value
            print(f"✅ {var_name}: {display_value}")
        else:
            print(f"❌ {var_name}: NOT SET")
            all_set = False
    
    print("\n" + "="*60)
    if all_set:
        print("✅ GitHub OAuth is properly configured!")
        print("\n📋 Next Steps:")
        print("1. Make sure your GitHub OAuth App callback URL is:")
        print(f"   {required_vars['GITHUB_REDIRECT_URI']}")
        print("\n2. Start the backend: python main.py")
        print("3. Start the frontend: npm run dev")
        print("4. Test login at: http://localhost:5173")
    else:
        print("❌ Configuration incomplete. Please check your .env file.")
    print("="*60)

if __name__ == "__main__":
    check_config()
