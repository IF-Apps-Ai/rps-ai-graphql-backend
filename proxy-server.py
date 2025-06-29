#!/usr/bin/env python3
"""
Simple proxy server to forward requests to the NestJS application
This helps resolve VS Code port forwarding issues
"""

import http.server
import socketserver
import urllib.request
import urllib.error
import json
from urllib.parse import urlparse, parse_qs

class ProxyHandler(http.server.BaseHTTPRequestHandler):
    
    TARGET_HOST = 'http://127.0.0.1:3005'
    
    def do_GET(self):
        self.proxy_request()
    
    def do_POST(self):
        self.proxy_request()
    
    def do_PUT(self):
        self.proxy_request()
    
    def do_DELETE(self):
        self.proxy_request()
    
    def do_OPTIONS(self):
        self.proxy_request()
    
    def proxy_request(self):
        try:
            # Build target URL
            target_url = f"{self.TARGET_HOST}{self.path}"
            
            # Get request body for POST/PUT requests
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length) if content_length > 0 else None
            
            # Create request
            req = urllib.request.Request(target_url, data=body, method=self.command)
            
            # Copy headers (except host)
            for header, value in self.headers.items():
                if header.lower() not in ['host', 'connection']:
                    req.add_header(header, value)
            
            # Make request to target server
            with urllib.request.urlopen(req, timeout=30) as response:
                # Copy response status
                self.send_response(response.getcode())
                
                # Copy response headers
                for header, value in response.headers.items():
                    if header.lower() not in ['connection', 'transfer-encoding']:
                        self.send_header(header, value)
                
                # Add CORS headers for browser compatibility
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
                
                self.end_headers()
                
                # Copy response body
                response_data = response.read()
                self.wfile.write(response_data)
                
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_response = {
                'error': f'Proxy error: {e.reason}',
                'status': e.code
            }
            self.wfile.write(json.dumps(error_response).encode())
            
        except Exception as e:
            self.send_response(502)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_response = {
                'error': f'Proxy error: {str(e)}',
                'status': 502,
                'message': 'Unable to connect to NestJS application'
            }
            self.wfile.write(json.dumps(error_response).encode())
    
    def log_message(self, format, *args):
        print(f"[PROXY] {self.address_string()} - {format % args}")

if __name__ == "__main__":
    PORT = 8080
    
    print(f"🚀 Starting proxy server on port {PORT}")
    print(f"📡 Forwarding requests to NestJS app at http://127.0.0.1:3005")
    print(f"🌐 Access your app at: http://localhost:{PORT}")
    print(f"📊 Health check: http://localhost:{PORT}/health")
    print(f"🔗 GraphQL: http://localhost:{PORT}/graphql")
    print("="*60)
    
    with socketserver.TCPServer(("", PORT), ProxyHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Proxy server stopped")
