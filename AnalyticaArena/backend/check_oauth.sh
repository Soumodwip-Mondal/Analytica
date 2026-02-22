#!/bin/bash

echo "🔍 Checking GitHub OAuth Configuration..."
echo ""

# Load .env file
if [ -f .env ]; then
    source .env
else
    echo "❌ .env file not found!"
    exit 1
fi

# Check variables
check_var() {
    local var_name=$1
    local var_value=$2
    
    if [ -n "$var_value" ]; then
        if [[ $var_name == *"SECRET"* ]]; then
            # Mask secret
            masked="${var_value:0:8}...${var_value: -4}"
            echo "✅ $var_name: $masked"
        else
            echo "✅ $var_name: $var_value"
        fi
        return 0
    else
        echo "❌ $var_name: NOT SET"
        return 1
    fi
}

all_set=true

check_var "GITHUB_CLIENT_ID" "$GITHUB_CLIENT_ID" || all_set=false
check_var "GITHUB_CLIENT_SECRET" "$GITHUB_CLIENT_SECRET" || all_set=false

# Set defaults if not present
GITHUB_REDIRECT_URI=${GITHUB_REDIRECT_URI:-"http://localhost:8000/api/auth/github/callback"}
FRONTEND_OAUTH_CALLBACK=${FRONTEND_OAUTH_CALLBACK:-"http://localhost:5173/oauth/callback"}

check_var "GITHUB_REDIRECT_URI" "$GITHUB_REDIRECT_URI"
check_var "FRONTEND_OAUTH_CALLBACK" "$FRONTEND_OAUTH_CALLBACK"

echo ""
echo "============================================================"
if [ "$all_set" = true ]; then
    echo "✅ GitHub OAuth is properly configured!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Make sure your GitHub OAuth App callback URL is:"
    echo "   $GITHUB_REDIRECT_URI"
    echo ""
    echo "2. Start the backend: python main.py"
    echo "3. Start the frontend: cd ../frontend && npm run dev"
    echo "4. Test login at: http://localhost:5173"
else
    echo "❌ Configuration incomplete. Please check your .env file."
fi
echo "============================================================"
