import { useState, useCallback, useEffect } from 'react';
import { CLIHistoryEntry, CLIResponse } from '@/types/cli';

interface UseCLIHistoryReturn {
  history: CLIHistoryEntry[];
  historyIndex: number;
  addToHistory: (command: string, args: string[], response: CLIResponse) => void;
  navigateHistory: (direction: 'up' | 'down') => string | null;
  clearHistory: () => void;
  getHistoryCommand: (index: number) => string | null;
  searchHistory: (query: string) => CLIHistoryEntry[];
}

const MAX_HISTORY_SIZE = 100;
const STORAGE_KEY = 'greenhacker-cli-history';

export const useCLIHistory = (): UseCLIHistoryReturn => {
  const [history, setHistory] = useState<CLIHistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setHistory(parsed.slice(-MAX_HISTORY_SIZE)); // Keep only recent entries
        }
      }
    } catch (error) {
      console.warn('Failed to load CLI history from localStorage:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.warn('Failed to save CLI history to localStorage:', error);
    }
  }, [history]);

  const addToHistory = useCallback((command: string, args: string[], response: CLIResponse) => {
    const entry: CLIHistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      command,
      args,
      timestamp: new Date().toISOString(),
      response,
      context: {
        currentPage: window.location.pathname,
        sessionId: `session-${Date.now()}`
      }
    };

    setHistory(prev => {
      // Don't add duplicate consecutive commands
      if (prev.length > 0) {
        const lastEntry = prev[prev.length - 1];
        if (lastEntry.command === command && JSON.stringify(lastEntry.args) === JSON.stringify(args)) {
          return prev;
        }
      }

      const newHistory = [...prev, entry];
      
      // Keep only the most recent entries
      if (newHistory.length > MAX_HISTORY_SIZE) {
        return newHistory.slice(-MAX_HISTORY_SIZE);
      }
      
      return newHistory;
    });

    // Reset history index when new command is added
    setHistoryIndex(-1);
  }, []);

  const navigateHistory = useCallback((direction: 'up' | 'down'): string | null => {
    if (history.length === 0) return null;

    let newIndex: number;

    if (direction === 'up') {
      if (historyIndex === -1) {
        newIndex = history.length - 1;
      } else if (historyIndex > 0) {
        newIndex = historyIndex - 1;
      } else {
        return null; // Already at the oldest command
      }
    } else { // down
      if (historyIndex === -1) {
        return null; // No navigation down from current input
      } else if (historyIndex < history.length - 1) {
        newIndex = historyIndex + 1;
      } else {
        setHistoryIndex(-1);
        return ''; // Return to current input
      }
    }

    setHistoryIndex(newIndex);
    const entry = history[newIndex];
    return entry.args.length > 0 ? `${entry.command} ${entry.args.join(' ')}` : entry.command;
  }, [history, historyIndex]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setHistoryIndex(-1);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear CLI history from localStorage:', error);
    }
  }, []);

  const getHistoryCommand = useCallback((index: number): string | null => {
    if (index < 0 || index >= history.length) return null;
    
    const entry = history[index];
    return entry.args.length > 0 ? `${entry.command} ${entry.args.join(' ')}` : entry.command;
  }, [history]);

  const searchHistory = useCallback((query: string): CLIHistoryEntry[] => {
    if (!query.trim()) return [];

    const lowercaseQuery = query.toLowerCase();
    return history.filter(entry => 
      entry.command.toLowerCase().includes(lowercaseQuery) ||
      entry.args.some(arg => arg.toLowerCase().includes(lowercaseQuery))
    ).reverse(); // Most recent first
  }, [history]);

  return {
    history,
    historyIndex,
    addToHistory,
    navigateHistory,
    clearHistory,
    getHistoryCommand,
    searchHistory
  };
};

// Hook for getting command statistics
export const useCLIStats = () => {
  const { history } = useCLIHistory();

  const getCommandStats = useCallback(() => {
    const commandCounts = new Map<string, number>();
    const totalCommands = history.length;
    
    history.forEach(entry => {
      const count = commandCounts.get(entry.command) || 0;
      commandCounts.set(entry.command, count + 1);
    });

    const sortedCommands = Array.from(commandCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10); // Top 10 commands

    return {
      totalCommands,
      uniqueCommands: commandCounts.size,
      topCommands: sortedCommands,
      averageResponseTime: history.reduce((sum, entry) => {
        return sum + (entry.response.metadata?.executionTime || 0);
      }, 0) / totalCommands || 0
    };
  }, [history]);

  const getSessionStats = useCallback(() => {
    const now = new Date();
    const sessionStart = new Date(now.getTime() - 30 * 60 * 1000); // Last 30 minutes
    
    const sessionCommands = history.filter(entry => 
      new Date(entry.timestamp) >= sessionStart
    );

    return {
      sessionCommands: sessionCommands.length,
      sessionDuration: sessionCommands.length > 0 
        ? now.getTime() - new Date(sessionCommands[0].timestamp).getTime()
        : 0,
      errorRate: sessionCommands.filter(entry => !entry.response.success).length / sessionCommands.length || 0
    };
  }, [history]);

  return {
    getCommandStats,
    getSessionStats
  };
};
