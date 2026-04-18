from collections import defaultdict, deque
from threading import Lock
from time import time

from fastapi import HTTPException, Request, status

_BUCKETS = defaultdict(deque)
_BUCKETS_LOCK = Lock()


def rate_limit(bucket_name: str, max_requests: int, window_seconds: int):
    def dependency(request: Request):
        forwarded_for = request.headers.get("x-forwarded-for", "").strip()
        if forwarded_for:
            client_ip = forwarded_for.split(",")[0].strip()
        else:
            client_ip = request.client.host if request.client else "unknown"

        key = f"{bucket_name}:{client_ip}"
        now = time()

        with _BUCKETS_LOCK:
            bucket = _BUCKETS[key]

            while bucket and now - bucket[0] > window_seconds:
                bucket.popleft()

            if len(bucket) >= max_requests:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many requests. Please try again later.",
                )

            bucket.append(now)

    return dependency