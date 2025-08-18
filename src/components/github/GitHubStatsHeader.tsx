'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

type Props = {
  error?: string | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  isLoading?: boolean;
};

export default function GitHubStatsHeader({ error, onRefresh, isRefreshing, isLoading }: Props) {
  const lastUpdated = typeof window !== 'undefined' ? new Date().toLocaleTimeString() : undefined;
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Real-time GitHub Statistics</h3>
        <div className="flex items-center gap-3">
          {error && (
            <p className="text-yellow-400 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </p>
          )}
          {lastUpdated && (
            <p className="text-xs text-github-text/80">Last updated: {lastUpdated}</p>
          )}
        </div>
      </div>
      <button
        onClick={onRefresh}
        disabled={!onRefresh || !!isRefreshing || !!isLoading}
        className="flex items-center gap-2 px-3 py-2 bg-github-light/50 hover:bg-github-light text-white rounded-lg transition-colors disabled:opacity-50"
        title="Refresh GitHub data"
      >
        <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : 'group-hover:animate-spin'} />
        <span className="hidden sm:inline">
          {isRefreshing ? 'Updating...' : 'Refresh'}
        </span>
      </button>
    </div>
  );
}

