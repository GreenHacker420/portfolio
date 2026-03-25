
import { AppError } from "./errors";

export async function withErrorHandler(fn) {
    try {
        const data = await fn();
        return ok(data);
    } catch (err) {
        console.error("Action Error:", err);
        return fail(err);
    }
}

export function ok(data) {
    return {
        success: true,
        data
    };
}

export function fail(err) {
    if (err instanceof AppError) {
        return err.toJSON();
    }
    
    // Generic error fallback
    return {
        success: false,
        error: {
            message: err.message || "An unexpected error occurred",
            code: "INTERNAL_ERROR",
            status: 500
        }
    };
}
