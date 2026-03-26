import { NextResponse } from "next/server";
import { AppError } from "./errors";

/**
 * Standard success response wrapper
 */
export function apiOk(data, status = 200) {
    return NextResponse.json({
        success: true,
        data
    }, { status });
}

/**
 * Standard error response wrapper
 */
export function apiError(err) {
    console.error("[API Error]", err);

    if (err instanceof AppError) {
        return NextResponse.json(err.toJSON(), { status: err.status });
    }

    return NextResponse.json({
        success: false,
        error: {
            message: err.message || "Internal Server Error",
            code: "INTERNAL_ERROR",
            status: 500
        }
    }, { status: 500 });
}

/**
 * Higher-order function to wrap API handlers with try/catch and standardized responses
 */
export function withApiHandler(handler) {
    return async (req, context) => {
        try {
            return await handler(req, context);
        } catch (error) {
            return apiError(error);
        }
    };
}
