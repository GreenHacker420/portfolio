export interface CLICommand {
  name: string;
  description: string;
  usage: string;
  aliases?: string[];
  category: 'navigation' | 'info' | 'system' | 'ai' | 'help';
  handler: (args: string[], context: CLIContext) => Promise<CLIResponse> | CLIResponse;
  autoComplete?: (partial: string, context: CLIContext) => string[];
  requiresArgs?: boolean;
  minArgs?: number;
  maxArgs?: number;
}

export interface CLIContext {
  currentPage: string;
  sessionId: string;
  userAgent?: string;
  ipAddress?: string;
  history: CLIHistoryEntry[];
  suggestions: string[];
}

export interface CLIResponse {
  success: boolean;
  output: string[];
  type: 'text' | 'error' | 'success' | 'warning' | 'info' | 'ai';
  suggestions?: string[];
  relatedFAQs?: FAQ[];
  metadata?: {
    executionTime?: number;
    timestamp?: string;
    command?: string;
    args?: string[];
    special?: 'mode_switch' | 'exit' | 'clear' | 'clear_history';
    mode?: 'command' | 'chat';
  };
}

export interface CLIHistoryEntry {
  id: string;
  command: string;
  args: string[];
  timestamp: string;
  response: CLIResponse;
  context: Partial<CLIContext>;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  viewCount: number;
  helpful: number;
  notHelpful: number;
}

export interface CommandCompletion {
  text: string;
  description?: string;
  type: 'command' | 'argument' | 'flag' | 'value';
  category?: string;
}

export interface CLIState {
  isOpen: boolean;
  isExpanded: boolean;
  currentInput: string;
  history: CLIHistoryEntry[];
  historyIndex: number;
  completions: CommandCompletion[];
  showCompletions: boolean;
  isProcessing: boolean;
  sessionId: string;
  mode: 'command' | 'chat';
}

export interface CLITheme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  border: string;
  prompt: string;
}

export interface CLIConfig {
  maxHistorySize: number;
  autoCompleteDelay: number;
  commandTimeout: number;
  theme: CLITheme;
  shortcuts: Record<string, string>;
  aliases: Record<string, string>;
}

// Command argument types
export interface CommandArg {
  name: string;
  description: string;
  required: boolean;
  type: 'string' | 'number' | 'boolean' | 'choice';
  choices?: string[];
  default?: any;
}

// Built-in command categories
export const CLI_CATEGORIES = {
  NAVIGATION: 'navigation',
  INFO: 'info', 
  SYSTEM: 'system',
  AI: 'ai',
  HELP: 'help'
} as const;

// Command execution result types
export type CommandResult = 
  | { type: 'success'; data: any }
  | { type: 'error'; message: string }
  | { type: 'redirect'; url: string }
  | { type: 'ai_response'; content: string; suggestions?: string[] };

// CLI event types for analytics
export interface CLIEvent {
  type: 'command_executed' | 'completion_used' | 'mode_switched' | 'help_accessed';
  command?: string;
  args?: string[];
  timestamp: string;
  sessionId: string;
  context: string;
}
