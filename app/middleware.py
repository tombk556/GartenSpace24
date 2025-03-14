import time
import asyncio
from typing import Dict, List
from fastapi import Response, Request
from collections import defaultdict
from starlette.middleware.base import BaseHTTPMiddleware

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests: int = 10, time_window: int = 60):
        super().__init__(app)
        self.rate_limit_records: Dict[str, List[float]] = defaultdict(list)
        self.max_requests = max_requests
        self.time_window = time_window

    async def dispatch(self, request, call_next):
        client_ip = request.client.host
        current_time = time.time()
        
        timestamps = self.rate_limit_records[client_ip]
        self.rate_limit_records[client_ip] = [
            timestamp for timestamp in timestamps if current_time - timestamp < self.time_window
        ]
        
        if len(self.rate_limit_records[client_ip]) >= self.max_requests:
            wait_time = self.time_window - (current_time - self.rate_limit_records[client_ip][0])
            return Response(
                status_code=429,
                content=f"Rate limit exceeded. Try again in {int(wait_time)} seconds."
            )
        
        self.rate_limit_records[client_ip].append(current_time)
        
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        
        custom_header = {"X-Process-Time": str(process_time)}
        for header, value in custom_header.items():
            response.headers.append(header, value)
        
        return response

class SlowMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        await asyncio.sleep(1)
        return await call_next(request)