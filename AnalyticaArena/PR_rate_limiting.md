# feat: Add per-user rate limiting to `/api/chat/query` endpoint

## Summary

Closes #[issue-number] — Adds `slowapi`-based rate limiting to the `POST /api/chat/query` endpoint to prevent a single user from exhausting the project's Gemini API quota. This was also listed as a planned feature under **Future Enhancements** in the README.

## Problem

The chat query endpoint called the Google Gemini AI API on every request with no throttling. A single user could spam the endpoint and drain the entire project's API quota within minutes, degrading the experience for all other users.

## Changes Made

### `backend/utils/limiter.py` *(new file)*
- Extracted the `slowapi` `Limiter` instance into a dedicated module to avoid a circular import between `main.py` and `routes/chat.py`.

### `backend/main.py`
- Imports `limiter` from `utils/limiter.py`
- Attaches it to `app.state.limiter`
- Registers `RateLimitExceeded` exception handler → returns **HTTP 429** with a human-readable error message and `Retry-After` header

### `backend/routes/chat.py`
- Added `@limiter.limit(CHAT_RATE_LIMIT)` decorator to `chat_query`
- Added `request: Request` parameter (required by `slowapi`)
- `CHAT_RATE_LIMIT` is read from the environment variable, defaulting to `"10/minute"`

### `backend/requirements.txt`
- Added `slowapi>=0.1.9`

### `backend/.env.example`
- Documented `CHAT_RATE_LIMIT` with format examples (`10/minute`, `100/hour`)

### `README.md`
- Added rate limiting to the **Security Features** section with behaviour description
- Marked `[x] API rate limiting` as done in the **Future Enhancements** checklist

## Behaviour

| Scenario | Response |
|----------|----------|
| Within limit (default: 10 req/min) | `200 OK` |
| Exceeds limit | `429 Too Many Requests` + `Retry-After` header |

The limit is fully **configurable** via the `CHAT_RATE_LIMIT` environment variable — no code changes required to adjust it.

```env
# backend/.env
CHAT_RATE_LIMIT=10/minute   # default — change freely
```

## How to Test

```bash
# Obtain a Bearer token via /api/auth/login, then run:
for i in $(seq 1 11); do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST http://localhost:8000/api/chat/query \
    -H "Authorization: Bearer <your_token>" \
    -H "Content-Type: application/json" \
    -d '{"dataset_id": "<id>", "message": "What is the average value?"}'
done
# Expected: first 10 → 200, 11th → 429
```

## Checklist

- [x] `slowapi` added to `requirements.txt`
- [x] Limiter configured in `main.py` with `RateLimitExceeded` handler
- [x] `POST /api/chat/query` decorated with `@limiter.limit(CHAT_RATE_LIMIT)`
- [x] Rate limit configurable via `CHAT_RATE_LIMIT` env var
- [x] Exceeding limit returns HTTP 429 with human-readable error and `Retry-After` header
- [x] `CHAT_RATE_LIMIT` documented in `README.md` and `.env.example`
- [x] `[x] API rate limiting` marked as done in README Future Enhancements
