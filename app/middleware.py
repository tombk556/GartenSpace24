import time
from typing import Dict
from fastapi import Response
from collections import defaultdict
from starlette.middleware.base import BaseHTTPMiddleware


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app) -> None:
        super().__init__(app)
        self.rate_limit_records: Dict[str, float] = defaultdict(float)
        
    async def log_message(self, message):
        print(message)
        
    async def dispatch(self, request, call_next):
        client_ip = request.client.host
        current_time = time()
        if current_time - self.rate_limit_records[client_ip] < 0.0001:
            return Response("Rate limit exceeded", status_code=429)
        
        self.rate_limit_records[client_ip] = current_time
        path = request.url.path
        
        start_time = time()
        response = await call_next(request)
        process_time = time() - start_time
        
        custom_header = {"X-Process-Time": str(process_time)}
        for header, value in custom_header.items():
            response.headers.append(header, value)
        
        return response