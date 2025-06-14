/**
 * Error Boundary Component for GitHub Contribution Heatmap
 * Provides graceful error handling and fallback UI
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Props for HeatmapErrorBoundary component
 */
interface HeatmapErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode;
  /** Fallback component to render on error */
  fallback?: ReactNode;
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Whether to show detailed error information */
  showDetails?: boolean;
  /** Custom error message */
  customMessage?: string;
}

/**
 * State for error boundary
 */
interface HeatmapErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error that occurred */
  error: Error | null;
  /** Additional error information */
  errorInfo: ErrorInfo | null;
  /** Error ID for tracking */
  errorId: string;
}

/**
 * Error Boundary for GitHub Contribution Heatmap
 * Catches JavaScript errors anywhere in the child component tree
 */
export class HeatmapErrorBoundary extends Component<
  HeatmapErrorBoundaryProps,
  HeatmapErrorBoundaryState
> {
  constructor(props: HeatmapErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  /**
   * Static method to update state when an error occurs
   */
  static getDerivedStateFromError(error: Error): Partial<HeatmapErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `heatmap-error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  /**
   * Lifecycle method called when an error occurs
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      errorInfo,
    });

    // Log error for debugging
    console.error('Heatmap Error Boundary caught an error:', error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to error tracking service (if available)
    this.reportError(error, errorInfo);
  }

  /**
   * Reports error to tracking service
   */
  private reportError(error: Error, errorInfo: ErrorInfo) {
    // This would integrate with your error tracking service
    // e.g., Sentry, LogRocket, etc.
    try {
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // Example: Send to error tracking service
      // errorTrackingService.captureException(errorReport);
      
      console.warn('Error report generated:', errorReport);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  /**
   * Resets the error boundary state
   */
  private resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  /**
   * Reloads the page as a last resort
   */
  private reloadPage = () => {
    window.location.reload();
  };

  /**
   * Renders the error UI or children
   */
  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-github-dark p-6 rounded-xl border border-red-500/30"
        >
          {/* Error Header */}
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-red-400" size={24} />
            <div>
              <h3 className="text-xl font-bold text-white">
                Contribution Calendar Error
              </h3>
              <p className="text-red-400 text-sm">
                {this.props.customMessage || 'Something went wrong while rendering the contribution calendar'}
              </p>
            </div>
          </div>

          {/* Error Details */}
          {this.props.showDetails && this.state.error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-red-300 mb-2">Error Details:</h4>
              <div className="text-sm text-red-400 font-mono">
                <div className="mb-2">
                  <strong>Message:</strong> {this.state.error.message}
                </div>
                <div className="mb-2">
                  <strong>Error ID:</strong> {this.state.errorId}
                </div>
                {this.state.error.stack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-red-300 hover:text-red-200">
                      Stack Trace
                    </summary>
                    <pre className="mt-2 text-xs overflow-x-auto whitespace-pre-wrap">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={this.resetErrorBoundary}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
            
            <button
              onClick={this.reloadPage}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/20"
            >
              <Calendar size={16} />
              Reload Page
            </button>
          </div>

          {/* Fallback Content */}
          <div className="mt-6 p-4 bg-github-border/20 rounded-lg">
            <h4 className="font-semibold text-white mb-2">
              Alternative View
            </h4>
            <p className="text-github-text text-sm mb-3">
              While we fix this issue, you can still view your contribution summary:
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">
                  {new Date().getFullYear()}
                </div>
                <div className="text-sm text-github-text">Current Year</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-white">
                  ---
                </div>
                <div className="text-sm text-github-text">Contributions</div>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-4 text-xs text-github-text">
            <p>
              If this problem persists, please try refreshing the page or contact support.
              Error ID: <code className="bg-github-border/30 px-1 rounded">{this.state.errorId}</code>
            </p>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based error boundary for functional components
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
}

/**
 * Simple fallback component for heatmap errors
 */
export function HeatmapFallback({ 
  error, 
  resetError 
}: { 
  error?: Error; 
  resetError?: () => void; 
}) {
  return (
    <div className="bg-github-dark p-6 rounded-xl border border-github-border">
      <div className="flex items-center gap-3 mb-4">
        <AlertCircle className="text-yellow-400" size={24} />
        <div>
          <h3 className="text-xl font-bold text-white">
            Calendar Temporarily Unavailable
          </h3>
          <p className="text-github-text text-sm">
            The contribution calendar is experiencing issues. Please try again.
          </p>
        </div>
      </div>
      
      {resetError && (
        <button
          onClick={resetError}
          className="flex items-center gap-2 px-4 py-2 bg-neon-green hover:bg-neon-green/80 text-black rounded-lg transition-colors"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      )}
    </div>
  );
}
