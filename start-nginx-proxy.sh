#!/bin/bash

# Start Nginx Reverse Proxy for RPS AI JS
# This helps resolve port forwarding issues in VS Code environments

echo "🚀 Starting Nginx reverse proxy for RPS AI JS"
echo "📡 Proxying requests from port 8081 to NestJS app at 127.0.0.1:3005"
echo "="*60

# Check if nginx is installed
if ! command -v nginx &> /dev/null; then
    echo "❌ Nginx not found. Installing nginx..."
    sudo apt-get update
    sudo apt-get install -y nginx
fi

# Stop any existing nginx process
sudo pkill -f nginx || true

# Create nginx config for this session
NGINX_CONFIG="/tmp/rps-nginx.conf"
cat > $NGINX_CONFIG << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream rps_app {
        server 127.0.0.1:3005;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=ai:10m rate=1r/s;

    # Basic mime types
    include /etc/nginx/mime.types;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    server {
        listen 8081;
        server_name localhost;

        # CORS headers
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With" always;

        # Handle preflight OPTIONS requests
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "*";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With";
            add_header Content-Length 0;
            add_header Content-Type text/plain;
            return 204;
        }

        # Health check endpoint
        location /health {
            proxy_pass http://rps_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # GraphQL endpoint with AI rate limiting
        location /graphql {
            limit_req zone=ai burst=5 nodelay;
            
            proxy_pass http://rps_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # All other endpoints
        location / {
            limit_req zone=api burst=10 nodelay;
            
            proxy_pass http://rps_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # WebSocket support
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
EOF

# Start nginx with custom config
echo "🌐 Starting nginx on port 8081..."
sudo nginx -c $NGINX_CONFIG

echo "✅ Nginx reverse proxy started successfully!"
echo "🔗 Access URLs:"
echo "   - Main app: http://localhost:8081"
echo "   - Health: http://localhost:8081/health"
echo "   - GraphQL: http://localhost:8081/graphql"
echo ""
echo "📝 To stop nginx: sudo pkill -f nginx"
echo "📊 To check nginx status: sudo nginx -t -c $NGINX_CONFIG"
