from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from services.auth_service import decode_access_token


class JWTContextMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request.state.current_username = None

        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1]
            try:
                payload = decode_access_token(token)
                request.state.current_username = payload.get("sub")
            except ValueError:
                request.state.current_username = None

        return await call_next(request)
