import { ExternalAPIError } from "../errors";

/**
 * Wraps a promise with a timeout using AbortController.
 * @param {Promise} promise The promise to wrap
 * @param {number} timeoutMs Timeout in milliseconds
 * @param {string} serviceName Name of the service for error reporting
 * @returns {Promise}
 */
export async function withTimeout(promise, timeoutMs = 10000, serviceName = "External API") {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const result = await promise;
        clearTimeout(timeoutId);
        return result;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new ExternalAPIError(serviceName);
        }
        throw error;
    }
}

/**
 * Standard fetch with a default timeout.
 */
export async function fetchWithTimeout(url, options = {}, timeoutMs = 10000, serviceName = "External API") {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new ExternalAPIError(serviceName);
        }
        throw error;
    }
}
