'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

type Props = {
  error?: string | null;
  onRefresh: () => void;
  isRefreshing?: boolean;
  isLoading?: boolean;
};

export default function GitHubStatsHeader({ error, onRefresh, isRefreshing, isLoading }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Real-time GitHub Statistics</h3>
        {error && (
          <p className="text-yellow-400 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </p>
        )}
      </div>
      <button
        onClick={onRefresh}
        disabled={!!isRefreshing || !!isLoading}
        className="flex items-center gap-2 px-3 py-2 bg-github-light/50 hover:bg-github-light text-white rounded-lg transition-colors disabled:opacity-50"
        title="Refresh GitHub data"
      >
        <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
        <span className="hidden sm:inline">
          {isRefreshing ? 'Updating...' : 'Refresh'}
        </span>
      </button>
    </div>
  );
}

