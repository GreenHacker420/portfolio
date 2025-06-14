import { useState, useCallback, useEffect, useMemo } from 'react';
import { CommandCompletion, CLIContext } from '@/types/cli';
import { getCommandCompletions, getCommand, getAllCommands } from '@/services/cliCommandService';

interface UseCommandCompletionReturn {
  completions: CommandCompletion[];
  selectedIndex: number;
  showCompletions: boolean;
  getCompletions: (input: string, context: CLIContext) => void;
  selectCompletion: (index: number) => string | null;
  navigateCompletions: (direction: 'up' | 'down') => void;
  hideCompletions: () => void;
  applyCompletion: () => string | null;
}

const MAX_COMPLETIONS = 10;
const COMPLETION_DELAY = 150; // ms

export const useCommandCompletion = (): UseCommandCompletionReturn => {
  const [completions, setCompletions] = useState<CommandCompletion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showCompletions, setShowCompletions] = useState(false);
  const [completionTimeout, setCompletionTimeout] = useState<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (completionTimeout) {
        clearTimeout(completionTimeout);
      }
    };
  }, [completionTimeout]);

  // Get all available commands for reference
  const allCommands = useMemo(() => getAllCommands(), []);

  const getCompletions = useCallback((input: string, context: CLIContext) => {
    // Clear existing timeout
    if (completionTimeout) {
      clearTimeout(completionTimeout);
    }

    // Don't show completions for empty input
    if (!input.trim()) {
      setShowCompletions(false);
      return;
    }

    // Debounce completion generation
    const timeout = setTimeout(() => {
      const trimmedInput = input.trim();
      const parts = trimmedInput.split(/\s+/);
      const commandPart = parts[0];
      const args = parts.slice(1);

      let newCompletions: CommandCompletion[] = [];

      if (parts.length === 1) {
        // Completing command name
        const commandMatches = getCommandCompletions(commandPart);
        newCompletions = commandMatches.map(cmd => {
          const command = getCommand(cmd);
          return {
            text: cmd,
            description: command?.description || '',
            type: 'command' as const,
            category: command?.category || 'unknown'
          };
        });

        // Add fuzzy matching for partial commands
        if (commandMatches.length === 0 && commandPart.length > 1) {
          const fuzzyMatches = allCommands.filter(cmd => 
            cmd.name.includes(commandPart.toLowerCase()) ||
            cmd.aliases?.some(alias => alias.includes(commandPart.toLowerCase()))
          );

          newCompletions = fuzzyMatches.map(cmd => ({
            text: cmd.name,
            description: cmd.description,
            type: 'command' as const,
            category: cmd.category
          }));
        }
      } else {
        // Completing command arguments
        const command = getCommand(commandPart);
        if (command && command.autoComplete) {
          const argCompletions = command.autoComplete(args.join(' '), context);
          newCompletions = argCompletions.map(completion => ({
            text: `${commandPart} ${completion}`,
            description: `${command.name} argument`,
            type: 'argument' as const,
            category: command.category
          }));
        }

        // Add contextual suggestions based on current page
        if (newCompletions.length === 0) {
          const contextualSuggestions = getContextualCompletions(commandPart, context);
          newCompletions = contextualSuggestions;
        }
      }

      // Limit number of completions
      newCompletions = newCompletions.slice(0, MAX_COMPLETIONS);

      setCompletions(newCompletions);
      setSelectedIndex(0);
      setShowCompletions(newCompletions.length > 0);
    }, COMPLETION_DELAY);

    setCompletionTimeout(timeout);
  }, [completionTimeout, allCommands]);

  const selectCompletion = useCallback((index: number): string | null => {
    if (index < 0 || index >= completions.length) return null;
    
    const completion = completions[index];
    setSelectedIndex(index);
    return completion.text;
  }, [completions]);

  const navigateCompletions = useCallback((direction: 'up' | 'down') => {
    if (completions.length === 0) return;

    let newIndex: number;
    if (direction === 'up') {
      newIndex = selectedIndex > 0 ? selectedIndex - 1 : completions.length - 1;
    } else {
      newIndex = selectedIndex < completions.length - 1 ? selectedIndex + 1 : 0;
    }

    setSelectedIndex(newIndex);
  }, [completions.length, selectedIndex]);

  const hideCompletions = useCallback(() => {
    setShowCompletions(false);
    setCompletions([]);
    setSelectedIndex(0);
  }, []);

  const applyCompletion = useCallback((): string | null => {
    if (completions.length === 0 || selectedIndex < 0) return null;
    
    const completion = completions[selectedIndex];
    hideCompletions();
    return completion.text;
  }, [completions, selectedIndex, hideCompletions]);

  return {
    completions,
    selectedIndex,
    showCompletions,
    getCompletions,
    selectCompletion,
    navigateCompletions,
    hideCompletions,
    applyCompletion
  };
};

// Helper function to get contextual completions
const getContextualCompletions = (command: string, context: CLIContext): CommandCompletion[] => {
  const { currentPage } = context;
  const completions: CommandCompletion[] = [];

  // Page-specific suggestions
  switch (currentPage) {
    case '/':
    case '/home':
      completions.push(
        { text: 'about', description: 'Learn about the developer', type: 'command', category: 'info' },
        { text: 'skills', description: 'View technical skills', type: 'command', category: 'info' },
        { text: 'projects', description: 'Browse recent projects', type: 'command', category: 'info' }
      );
      break;
    
    case '/projects':
      completions.push(
        { text: 'projects', description: 'Show project details', type: 'command', category: 'info' },
        { text: 'skills', description: 'Related technical skills', type: 'command', category: 'info' }
      );
      break;
    
    case '/contact':
      completions.push(
        { text: 'contact', description: 'Get contact information', type: 'command', category: 'info' },
        { text: 'chat', description: 'Start AI conversation', type: 'command', category: 'ai' }
      );
      break;
    
    default:
      completions.push(
        { text: 'help', description: 'Show available commands', type: 'command', category: 'help' },
        { text: 'about', description: 'Learn about the developer', type: 'command', category: 'info' }
      );
  }

  // Filter based on partial command input
  return completions.filter(comp => 
    comp.text.toLowerCase().startsWith(command.toLowerCase())
  );
};

// Hook for managing completion preferences
export const useCompletionPreferences = () => {
  const [preferences, setPreferences] = useState({
    enableAutoComplete: true,
    completionDelay: COMPLETION_DELAY,
    maxCompletions: MAX_COMPLETIONS,
    showDescriptions: true,
    enableFuzzyMatching: true
  });

  const updatePreference = useCallback((key: keyof typeof preferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cli-completion-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save completion preferences:', error);
    }
  }, [preferences]);

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cli-completion-preferences');
      if (saved) {
        const parsed = JSON.parse(saved);
        setPreferences(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.warn('Failed to load completion preferences:', error);
    }
  }, []);

  return {
    preferences,
    updatePreference
  };
};
