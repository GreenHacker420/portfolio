import { CLIResponse, CLITheme, CLIEvent } from '@/types/cli';

// Default CLI theme
export const defaultCLITheme: CLITheme = {
  primary: '#00ff88',      // neon-green
  secondary: '#00d4ff',    // neon-blue  
  background: '#0d1117',   // github-dark
  text: '#f0f6fc',         // github-text
  accent: '#a855f7',       // neon-purple
  error: '#ff4444',        // red
  success: '#00ff88',      // neon-green
  warning: '#ffaa00',      // orange
  info: '#00d4ff',         // neon-blue
  border: '#30363d',       // github-border
  prompt: '#00ff88'        // neon-green
};

// Format command output with colors and styling
export const formatCLIOutput = (response: CLIResponse, theme: CLITheme = defaultCLITheme): string[] => {
  const { output, type } = response;
  
  // Add type-specific prefixes and styling
  const prefix = getTypePrefix(type);
  
  return output.map((line, index) => {
    if (index === 0 && prefix) {
      return `${prefix} ${line}`;
    }
    return line;
  });
};

// Get prefix for different response types
const getTypePrefix = (type: CLIResponse['type']): string => {
  switch (type) {
    case 'error':
      return '❌';
    case 'success':
      return '✅';
    case 'warning':
      return '⚠️';
    case 'info':
      return 'ℹ️';
    case 'ai':
      return '🤖';
    default:
      return '';
  }
};

// Parse command line input
export const parseCommandLine = (input: string): { command: string; args: string[] } => {
  const trimmed = input.trim();
  if (!trimmed) {
    return { command: '', args: [] };
  }

  // Handle quoted arguments
  const parts: string[] = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    
    if ((char === '"' || char === "'") && !inQuotes) {
      inQuotes = true;
      quoteChar = char;
    } else if (char === quoteChar && inQuotes) {
      inQuotes = false;
      quoteChar = '';
    } else if (char === ' ' && !inQuotes) {
      if (current) {
        parts.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current) {
    parts.push(current);
  }

  return {
    command: parts[0] || '',
    args: parts.slice(1)
  };
};

// Validate command arguments
export const validateCommandArgs = (
  args: string[],
  minArgs: number = 0,
  maxArgs: number = Infinity,
  requiredArgs: string[] = []
): { valid: boolean; error?: string } => {
  if (args.length < minArgs) {
    return {
      valid: false,
      error: `Too few arguments. Expected at least ${minArgs}, got ${args.length}.`
    };
  }

  if (args.length > maxArgs) {
    return {
      valid: false,
      error: `Too many arguments. Expected at most ${maxArgs}, got ${args.length}.`
    };
  }

  // Check for required arguments (by position)
  for (let i = 0; i < requiredArgs.length; i++) {
    if (!args[i] || args[i].trim() === '') {
      return {
        valid: false,
        error: `Missing required argument: ${requiredArgs[i]}`
      };
    }
  }

  return { valid: true };
};

// Generate session ID
export const generateSessionId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  return `cli-session-${timestamp}-${random}`;
};

// Format execution time
export const formatExecutionTime = (ms: number): string => {
  if (ms < 1000) {
    return `${ms}ms`;
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  } else {
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  }
};

// Escape HTML in output
export const escapeHTML = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// Sanitize command input
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[&]/g, '&amp;') // Escape ampersands
    .trim();
};

// Check if command is dangerous
export const isDangerousCommand = (command: string): boolean => {
  const dangerousCommands = [
    'rm', 'del', 'delete', 'format', 'fdisk',
    'sudo', 'su', 'chmod', 'chown',
    'eval', 'exec', 'system'
  ];
  
  return dangerousCommands.includes(command.toLowerCase());
};

// Get command suggestions based on typos
export const getCommandSuggestions = (input: string, availableCommands: string[]): string[] => {
  const suggestions: Array<{ command: string; distance: number }> = [];
  
  availableCommands.forEach(cmd => {
    const distance = levenshteinDistance(input.toLowerCase(), cmd.toLowerCase());
    if (distance <= 2 && distance > 0) { // Allow up to 2 character differences
      suggestions.push({ command: cmd, distance });
    }
  });

  return suggestions
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map(s => s.command);
};

// Calculate Levenshtein distance for typo detection
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // deletion
        matrix[j - 1][i] + 1,     // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
};

// Track CLI events for analytics
export const trackCLIEvent = (event: CLIEvent): void => {
  try {
    // Send to analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'cli_interaction', {
        event_category: 'CLI',
        event_label: event.type,
        custom_parameter_1: event.command,
        custom_parameter_2: event.context
      });
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('CLI Event:', event);
    }
  } catch (error) {
    console.warn('Failed to track CLI event:', error);
  }
};

// Format file sizes
export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

// Generate ASCII art for CLI
export const generateASCIIArt = (text: string): string[] => {
  // Simple ASCII art generator for headers
  const art = [
    '╔══════════════════════════════════════╗',
    `║  ${text.padEnd(34)}  ║`,
    '╚══════════════════════════════════════╝'
  ];
  
  return art;
};

// Color text for terminal output
export const colorText = (text: string, color: keyof CLITheme, theme: CLITheme = defaultCLITheme): string => {
  // This would be used with a terminal library that supports colors
  // For now, return the text as-is since we're using CSS for styling
  return text;
};

// Check if running in mobile environment
export const isMobileEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth < 768;
};

// Get optimal CLI dimensions for current screen
export const getOptimalCLIDimensions = (): { width: string; height: string } => {
  if (typeof window === 'undefined') {
    return { width: '400px', height: '600px' };
  }

  const isMobile = isMobileEnvironment();
  
  if (isMobile) {
    return {
      width: '95vw',
      height: '70vh'
    };
  } else {
    return {
      width: Math.min(800, window.innerWidth * 0.8) + 'px',
      height: Math.min(600, window.innerHeight * 0.8) + 'px'
    };
  }
};
