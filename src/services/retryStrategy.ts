/**
 * Retry Strategy Service with Exponential Backoff
 * Handles API rate limiting and network failures gracefully
 */

/**
 * Retry configuration options
 */
export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitterFactor: number;
}

/**
 * Retry attempt information
 */
export interface RetryAttempt {
  attempt: number;
  delay: number;
  timestamp: number;
  error?: Error;
}

/**
 * Retry result with metadata
 */
export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  attempts: RetryAttempt[];
  totalTime: number;
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
  jitterFactor: 0.1, // 10% jitter
};

/**
 * Rate limit specific retry configuration
 */
export const RATE_LIMIT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 5,
  baseDelay: 5000, // 5 seconds
  maxDelay: 300000, // 5 minutes
  backoffMultiplier: 2.5,
  jitterFactor: 0.2, // 20% jitter
};

/**
 * Retry Strategy Service
 */
export class RetryStrategy {
  private retryHistory = new Map<string, RetryAttempt[]>();

  /**
   * Execute a function with retry logic
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    config: RetryConfig = DEFAULT_RETRY_CONFIG,
    operationId?: string
  ): Promise<RetryResult<T>> {
    const startTime = Date.now();
    const attempts: RetryAttempt[] = [];
    
    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      const attemptStart = Date.now();
      
      try {
        const result = await operation();
        
        // Success - record attempt and return
        attempts.push({
          attempt,
          delay: 0,
          timestamp: attemptStart,
        });

        if (operationId) {
          this.retryHistory.set(operationId, attempts);
        }

        return {
          success: true,
          data: result,
          attempts,
          totalTime: Date.now() - startTime,
        };
      } catch (error) {
        const retryAttempt: RetryAttempt = {
          attempt,
          delay: 0,
          timestamp: attemptStart,
          error: error as Error,
        };

        attempts.push(retryAttempt);

        // If this was the last attempt, return failure
        if (attempt === config.maxRetries) {
          if (operationId) {
            this.retryHistory.set(operationId, attempts);
          }

          return {
            success: false,
            error: error as Error,
            attempts,
            totalTime: Date.now() - startTime,
          };
        }

        // Calculate delay for next attempt
        const delay = this.calculateDelay(attempt, config);
        retryAttempt.delay = delay;

        // Wait before next attempt
        await this.sleep(delay);
      }
    }

    // This should never be reached, but TypeScript requires it
    return {
      success: false,
      error: new Error('Unexpected retry loop exit'),
      attempts,
      totalTime: Date.now() - startTime,
    };
  }

  /**
   * Calculate delay with exponential backoff and jitter
   */
  private calculateDelay(attempt: number, config: RetryConfig): number {
    // Exponential backoff: baseDelay * (backoffMultiplier ^ attempt)
    const exponentialDelay = config.baseDelay * Math.pow(config.backoffMultiplier, attempt);
    
    // Apply maximum delay cap
    const cappedDelay = Math.min(exponentialDelay, config.maxDelay);
    
    // Add jitter to prevent thundering herd
    const jitter = cappedDelay * config.jitterFactor * (Math.random() - 0.5);
    
    return Math.max(0, cappedDelay + jitter);
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if an error is retryable
   */
  isRetryableError(error: any): boolean {
    // Network errors
    if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') {
      return true;
    }

    // HTTP status codes that are retryable
    if (error.status) {
      const retryableStatuses = [408, 429, 500, 502, 503, 504];
      return retryableStatuses.includes(error.status);
    }

    // Rate limiting errors
    if (error.message?.includes('rate limit') || error.message?.includes('429')) {
      return true;
    }

    return false;
  }

  /**
   * Get retry configuration based on error type
   */
  getRetryConfigForError(error: any): RetryConfig {
    // Use rate limit config for 429 errors
    if (error.status === 429 || error.message?.includes('rate limit')) {
      return RATE_LIMIT_RETRY_CONFIG;
    }

    // Use default config for other retryable errors
    return DEFAULT_RETRY_CONFIG;
  }

  /**
   * Get retry history for an operation
   */
  getRetryHistory(operationId: string): RetryAttempt[] | undefined {
    return this.retryHistory.get(operationId);
  }

  /**
   * Clear retry history for an operation
   */
  clearRetryHistory(operationId: string): void {
    this.retryHistory.delete(operationId);
  }

  /**
   * Clear all retry history
   */
  clearAllRetryHistory(): void {
    this.retryHistory.clear();
  }

  /**
   * Check if we should retry based on recent attempts
   */
  shouldRetry(operationId: string, maxRecentAttempts: number = 5): boolean {
    const history = this.retryHistory.get(operationId);
    if (!history) return true;

    // Check recent attempts in the last 5 minutes
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const recentAttempts = history.filter(attempt => attempt.timestamp > fiveMinutesAgo);

    return recentAttempts.length < maxRecentAttempts;
  }

  /**
   * Get next retry time for rate limited operations
   */
  getNextRetryTime(error: any): number | null {
    // Check for Retry-After header in rate limit responses
    if (error.headers && error.headers['retry-after']) {
      const retryAfter = parseInt(error.headers['retry-after'], 10);
      return Date.now() + (retryAfter * 1000);
    }

    // Check for X-RateLimit-Reset header
    if (error.headers && error.headers['x-ratelimit-reset']) {
      const resetTime = parseInt(error.headers['x-ratelimit-reset'], 10);
      return resetTime * 1000; // Convert to milliseconds
    }

    return null;
  }

  /**
   * Create a user-friendly retry message
   */
  createRetryMessage(attempts: RetryAttempt[], nextRetryTime?: number): string {
    const lastAttempt = attempts[attempts.length - 1];
    
    if (lastAttempt?.error?.message?.includes('rate limit') || 
        (lastAttempt?.error as any)?.status === 429) {
      
      if (nextRetryTime) {
        const waitMinutes = Math.ceil((nextRetryTime - Date.now()) / 60000);
        return `GitHub API rate limit reached. Retrying in ${waitMinutes} minute${waitMinutes > 1 ? 's' : ''}.`;
      }
      
      return 'GitHub API rate limit reached. Using cached data and will retry automatically.';
    }

    if (attempts.length === 1) {
      return 'Connection issue detected. Retrying automatically...';
    }

    return `Connection issues persist after ${attempts.length} attempts. Using cached data.`;
  }
}

// Singleton instance
export const retryStrategy = new RetryStrategy();

/**
 * Utility function for simple retry operations
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  config?: Partial<RetryConfig>
): Promise<T> {
  const fullConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  const result = await retryStrategy.executeWithRetry(operation, fullConfig);
  
  if (result.success && result.data !== undefined) {
    return result.data;
  }
  
  throw result.error || new Error('Operation failed after retries');
}

/**
 * Utility function for rate-limited operations
 */
export async function withRateLimitRetry<T>(
  operation: () => Promise<T>,
  operationId?: string
): Promise<T> {
  const result = await retryStrategy.executeWithRetry(
    operation, 
    RATE_LIMIT_RETRY_CONFIG,
    operationId
  );
  
  if (result.success && result.data !== undefined) {
    return result.data;
  }
  
  throw result.error || new Error('Operation failed after retries');
}
