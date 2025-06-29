#!/bin/bash

# Port Forward Detection and Instructions for VS Code
# This script will help you forward ports manually in VS Code

echo "🔍 PORT FORWARD SETUP - RPS AI JS"
echo "=================================="
echo ""

# Check active ports
echo "📊 Checking active ports..."
PORTS_STATUS=""

if netstat -tlnp 2>/dev/null | grep -q ":3005"; then
    echo "✅ Port 3005 (NestJS App) - ACTIVE"
    PORTS_STATUS="$PORTS_STATUS 3005"
else
    echo "❌ Port 3005 (NestJS App) - NOT ACTIVE"
fi

if netstat -tlnp 2>/dev/null | grep -q ":8080"; then
    echo "✅ Port 8080 (Python Proxy) - ACTIVE"
    PORTS_STATUS="$PORTS_STATUS 8080"
else
    echo "❌ Port 8080 (Python Proxy) - NOT ACTIVE"
fi

if netstat -tlnp 2>/dev/null | grep -q ":9000"; then
    echo "✅ Port 9000 (Test Interface) - ACTIVE"
    PORTS_STATUS="$PORTS_STATUS 9000"
else
    echo "❌ Port 9000 (Test Interface) - NOT ACTIVE"
fi

echo ""
echo "🛠️  MANUAL PORT FORWARDING INSTRUCTIONS:"
echo "========================================"
echo ""
echo "1. Click on the 'PORTS' tab in VS Code (bottom panel)"
echo "2. Click 'Forward a Port' button"
echo "3. Enter the port numbers one by one:"

if echo "$PORTS_STATUS" | grep -q "8080"; then
    echo "   📡 8080 - Python Proxy Server (RECOMMENDED)"
fi

if echo "$PORTS_STATUS" | grep -q "3005"; then
    echo "   🚀 3005 - Direct NestJS App"
fi

if echo "$PORTS_STATUS" | grep -q "9000"; then
    echo "   🌐 9000 - Test Interface"
fi

echo ""
echo "4. After forwarding, you'll get URLs like:"
echo "   https://xxxx-8080.app.github.dev (for port 8080)"
echo "   https://xxxx-3005.app.github.dev (for port 3005)"
echo "   https://xxxx-9000.app.github.dev (for port 9000)"
echo ""

echo "🎯 RECOMMENDED SETUP:"
echo "===================="
echo "1. Forward port 8080 first (Python proxy - most reliable)"
echo "2. Forward port 9000 for test interface"
echo "3. Forward port 3005 as backup (direct access)"
echo ""

echo "📋 QUICK TEST COMMANDS:"
echo "======================"
echo "After forwarding, test with these commands:"
echo ""
echo "# Test Python proxy (port 8080)"
echo "curl https://your-forwarded-8080-url/health"
echo ""
echo "# Test GraphQL via proxy"
echo "curl -X POST https://your-forwarded-8080-url/graphql \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"query\":\"query { sayHello }\"}'"
echo ""

echo "🌟 BROWSER ACCESS:"
echo "=================="
echo "After port forwarding:"
echo "- Test Interface: https://your-forwarded-9000-url/test-interface.html"
echo "- GraphQL Playground: https://your-forwarded-8080-url/graphql"
echo "- Health Dashboard: https://your-forwarded-8080-url/health"
echo ""

# Create a simple port status file
cat > /workspaces/rps-ai-js/port-status.json << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "ports": {
    "3005": {
      "service": "NestJS Application",
      "status": "$(netstat -tlnp 2>/dev/null | grep -q ':3005' && echo 'active' || echo 'inactive')",
      "description": "Main application server"
    },
    "8080": {
      "service": "Python Proxy",
      "status": "$(netstat -tlnp 2>/dev/null | grep -q ':8080' && echo 'active' || echo 'inactive')",
      "description": "Proxy server for VS Code compatibility"
    },
    "9000": {
      "service": "Test Interface",
      "status": "$(netstat -tlnp 2>/dev/null | grep -q ':9000' && echo 'active' || echo 'inactive')",
      "description": "Web-based testing interface"
    }
  },
  "instructions": {
    "manual_forwarding": "Use VS Code PORTS tab to forward ports",
    "recommended_port": "8080",
    "test_endpoint": "/health"
  }
}
EOF

echo "📄 Port status saved to: port-status.json"
echo ""
echo "🔄 To run this check again: ./port-forward-setup.sh"
