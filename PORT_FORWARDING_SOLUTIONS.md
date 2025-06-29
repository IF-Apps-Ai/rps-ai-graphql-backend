# 🔧 PORT FORWARDING SOLUTIONS - RPS AI JS

## 🚨 Problem: VS Code Port Forwarding Issue

**Error:** `Unable to forward localhost:3005. G.sendTelemetryEvent is not a function`

This is a known issue with VS Code's built-in port forwarding in some environments (especially Codespaces/remote development).

---

## ✅ SOLUTIONS PROVIDED

### 🐍 **Solution 1: Python Proxy Server (Recommended)**

**Port:** `8080`  
**File:** `proxy-server.py`

```bash
# Start Python proxy server
cd /workspaces/rps-ai-js
python3 proxy-server.py
```

**Access URLs:**
- Main app: `http://localhost:8080`
- Health check: `http://localhost:8080/health`
- GraphQL: `http://localhost:8080/graphql`

**Features:**
- ✅ Lightweight and fast
- ✅ CORS headers included
- ✅ Error handling
- ✅ Request/response logging
- ✅ Works in any environment

### 🌐 **Solution 2: Nginx Reverse Proxy**

**Port:** `8081`  
**File:** `start-nginx-proxy.sh`

```bash
# Start Nginx proxy server
cd /workspaces/rps-ai-js
./start-nginx-proxy.sh
```

**Access URLs:**
- Main app: `http://localhost:8081`  
- Health check: `http://localhost:8081/health`
- GraphQL: `http://localhost:8081/graphql`

**Features:**
- ✅ Production-grade reverse proxy
- ✅ Rate limiting included
- ✅ Gzip compression
- ✅ Security headers
- ✅ Load balancing ready

### 🚢 **Solution 3: Direct Access (Original)**

**Port:** `3005`  
**Direct access:** `http://127.0.0.1:3005`

```bash
# Access directly (if port forwarding works)
curl http://127.0.0.1:3005/health
```

---

## 🧪 TESTING THE SOLUTIONS

### Test Health Endpoints:
```bash
# Python proxy
curl http://127.0.0.1:8080/health

# Nginx proxy  
curl http://127.0.0.1:8081/health

# Direct access
curl http://127.0.0.1:3005/health
```

### Test GraphQL:
```bash
# Python proxy
curl -X POST http://127.0.0.1:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { sayHello }"}'

# Nginx proxy
curl -X POST http://127.0.0.1:8081/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { sayHello }"}'

# Direct access
curl -X POST http://127.0.0.1:3005/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { sayHello }"}'
```

---

## 🔧 TROUBLESHOOTING

### If Python proxy fails:
```bash
# Check if Python is available
python3 --version

# Check if port 8080 is available
netstat -tlnp | grep :8080

# Kill existing process on port 8080
sudo lsof -ti:8080 | xargs sudo kill -9
```

### If Nginx proxy fails:
```bash
# Check nginx installation
nginx -v

# Test nginx config
sudo nginx -t -c /tmp/rps-nginx.conf

# Check nginx processes
ps aux | grep nginx

# Stop nginx
sudo pkill -f nginx
```

### If all proxies fail:
```bash
# Check if main app is running
netstat -tlnp | grep :3005
curl http://127.0.0.1:3005/health

# Restart main application
cd /workspaces/rps-ai-js
npm run start:dev
```

---

## 🌐 BROWSER ACCESS

Once any proxy is running, you can access the application through your browser:

### For VS Code/Codespaces users:
1. Use the **PORTS** tab in VS Code
2. Forward port **8080** (Python proxy) or **8081** (Nginx proxy)
3. Click the forwarded port URL to access the app

### For external access:
- Replace `localhost` with your server's IP address
- Ensure firewall allows the proxy ports
- Use the forwarded URLs provided by your hosting service

---

## 📊 PERFORMANCE COMPARISON

| Solution | Startup Time | Memory Usage | Features |
|----------|--------------|--------------|----------|
| Python Proxy | < 1s | ~15MB | Basic proxy, CORS |
| Nginx Proxy | ~2s | ~5MB | Rate limiting, compression |
| Direct Access | 0s | 0MB | No proxy overhead |

---

## 🚀 PRODUCTION DEPLOYMENT

For production, use Nginx proxy with additional configurations:
- SSL/TLS termination
- Load balancing across multiple app instances
- Advanced rate limiting
- Security headers
- Static file serving

---

**💡 TIP:** Use Python proxy for development and Nginx proxy for production!
