# Development Standards

This document defines the error handling, logging, and response contracts for Metric-Flow.

## Error Response Format

All API errors follow a consistent structure:

```typescript
{
  "error": string,           // Human-readable error message
  "code"?: string,           // Optional machine-readable error code
  "details"?: any            // Optional additional error context
}
```

### HTTP Status Codes

- **200 OK**: Successful request
- **201 Created**: Resource successfully created
- **400 Bad Request**: Invalid input or validation error
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Authenticated but not authorized
- **404 Not Found**: Resource does not exist
- **409 Conflict**: Resource conflict (e.g., duplicate)
- **500 Internal Server Error**: Unexpected server error

### Example Error Responses

```json
// Validation error
{
  "error": "Invalid metric data",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "value",
    "message": "Must be a positive number"
  }
}

// Authentication error
{
  "error": "Authentication required",
  "code": "UNAUTHORIZED"
}

// Server error
{
  "error": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

## Error Classification

### User Errors (400-level)

Errors caused by invalid client input or state. These should:
- Return specific, actionable error messages
- Include validation details when applicable
- Be logged at `warn` level
- Not trigger alerts

Examples:
- Invalid request body
- Missing required fields
- Unauthorized access attempts
- Resource not found

### System Errors (500-level)

Errors caused by server or infrastructure issues. These should:
- Return generic error messages to client
- Log full stack traces and context
- Be logged at `error` level
- Trigger monitoring alerts

Examples:
- Database connection failures
- Unhandled exceptions
- Third-party service failures
- Out of memory errors

## Logging Standards

### Log Levels

- **error**: System failures, unhandled exceptions (requires action)
- **warn**: User errors, recoverable issues (may require attention)
- **info**: Important state changes, API requests (audit trail)
- **debug**: Detailed diagnostic information (development only)

### Log Format

All logs include:
- Timestamp (ISO 8601)
- Level
- Source (module/file)
- Message
- Context (request ID, user ID, etc.)

Example log output:
```
2024-12-20T02:30:45.123Z [server] POST /api/metrics 201 in 45ms
2024-12-20T02:30:46.456Z [error] Database connection failed: ECONNREFUSED
```

### What to Log

**DO log:**
- All API requests (method, path, status, duration)
- Authentication events (login, logout, failures)
- Database errors and slow queries
- Alert triggers
- WebSocket connections/disconnections
- Configuration changes

**DON'T log:**
- Sensitive data (passwords, tokens, PII)
- Full request/response bodies in production
- High-frequency events (e.g., metrics updates)

## API Response Contracts

### Success Response

```typescript
// Single resource
{
  "id": number,
  "type": string,
  "value": string,
  // ... resource fields
}

// Collection
{
  "data": [...],
  "total"?: number,
  "page"?: number,
  "pageSize"?: number
}
```

### WebSocket Message Format

```typescript
{
  "event": "metric-update" | "alert-triggered",
  "data": {
    // Event-specific payload
  },
  "timestamp": string  // ISO 8601
}
```

## Validation

- Use Zod schemas for all API input validation
- Share validation schemas between client and server via `shared/`
- Validate at API boundaries, not internal functions
- Return specific validation errors with field-level details

## Error Handling Best Practices

1. **Fail fast**: Validate input early, before processing
2. **Be specific**: Return actionable error messages
3. **Be consistent**: Use standard error format across all endpoints
4. **Preserve context**: Log errors with full context for debugging
5. **Recover gracefully**: Handle expected errors without crashing
6. **Monitor**: Track error rates and patterns
7. **Document**: Keep this document updated with new error codes

## Production Monitoring

Production systems should monitor:
- Error rates by endpoint and status code
- Response time percentiles (p50, p95, p99)
- Database query performance
- WebSocket connection stability
- Alert trigger frequency

Alerts should fire when:
- 5xx error rate exceeds 1% over 5 minutes
- p99 response time exceeds 1000ms
- Database connections exhausted
- WebSocket disconnect rate spikes
