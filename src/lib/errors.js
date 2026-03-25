
export class AppError extends Error {
    constructor(message, code = "INTERNAL_ERROR", status = 500) {
        super(message);
        this.code = code;
        this.status = status;
        this.name = this.constructor.name;
    }

    toJSON() {
        return {
            success: false,
            error: {
                message: this.message,
                code: this.code,
                status: this.status
            }
        };
    }
}

export class ValidationError extends AppError {
    constructor(message, fields = {}) {
        super(message, "VALIDATION_ERROR", 400);
        this.fields = fields;
    }

    toJSON() {
        const base = super.toJSON();
        base.error.fields = this.fields;
        return base;
    }
}

export class AuthError extends AppError {
    constructor(message = "Unauthorized access") {
        super(message, "AUTH_ERROR", 401);
    }
}

export class NotFoundError extends AppError {
    constructor(resource = "Resource") {
        super(`${resource} not found`, "NOT_FOUND", 404);
    }
}

export class RateLimitError extends AppError {
    constructor(resetAt) {
        super("Too many requests", "RATE_LIMIT_ERROR", 429);
        this.resetAt = resetAt;
    }

    toJSON() {
        const base = super.toJSON();
        base.error.resetAt = this.resetAt;
        return base;
    }
}

export class DatabaseError extends AppError {
    constructor(originalError) {
        super("Database operation failed", "DATABASE_ERROR", 500);
        this.originalError = originalError;
    }
}

export class ExternalAPIError extends AppError {
    constructor(service, message) {
        super(`External service error: ${message}`, "EXTERNAL_API_ERROR", 502);
        this.service = service;
    }
}
