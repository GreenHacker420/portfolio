# CLI Chatbot System Guide

## Overview

The CLI (Command Line Interface) Chatbot System provides a powerful terminal-like interface for interacting with the GREENHACKER portfolio website. It combines structured commands with AI-powered natural language processing to create an intuitive and engaging user experience.

## Features

### 🚀 Core Features
- **Interactive Command Interface**: Terminal-like experience with structured commands
- **Auto-completion**: Tab completion for commands and arguments
- **Command History**: Navigate through previous commands with arrow keys
- **AI Integration**: Seamless integration with Gemini 2.0-flash for natural language queries
- **Context Awareness**: Commands adapt based on the current page
- **Responsive Design**: Works on both desktop and mobile devices
- **Real-time Responses**: Fast command execution with loading indicators

### 💻 Command Categories

#### Navigation Commands
- `ls [section]` - List available sections and pages
- `cd <section>` - Navigate to different sections (coming soon)

#### Information Commands
- `about` - Learn about Harsh Hirawat (GreenHacker)
- `skills [category]` - Display technical skills and expertise
- `projects [filter]` - Show recent projects and portfolio work
- `experience [filter]` - Show professional experience and work history
- `github [section]` - Show GitHub profile and repository information
- `contact` - Get contact information and ways to reach out
- `status [section]` - Show current availability and project status

#### AI Assistant Commands
- `ask <question>` - Ask the AI assistant a question
- `chat [message]` - Switch to AI chat mode for natural language conversation
- `cmd` - Switch back to command mode from chat mode

#### System Commands
- `help [command]` - Display help information for commands
- `clear` - Clear the terminal screen
- `history [action]` - Show, clear, or search command history
- `whoami` - Display current user information
- `date [format]` - Display current date and time
- `echo <text>` - Display a line of text
- `version` - Show CLI version and system information
- `exit` - Close the CLI interface

#### FAQ Commands
- `faq [category|search]` - Browse frequently asked questions

## Usage Examples

### Basic Commands
```bash
$ help                    # Show all available commands
$ about                   # Learn about the developer
$ skills frontend         # Show frontend development skills
$ projects               # List recent projects
$ contact                # Get contact information
```

### Advanced Usage
```bash
$ ask "What technologies do you use for backend development?"
$ skills backend         # Show backend-specific skills
$ github repos           # Show GitHub repositories
$ experience recent      # Show recent work experience
$ history search react   # Search command history for "react"
```

### AI Integration
```bash
$ ask "How can I hire you for a project?"
$ chat                   # Switch to interactive chat mode
$ cmd                    # Switch back to command mode
```

## Keyboard Shortcuts

- **Tab**: Auto-complete commands and arguments
- **↑/↓ Arrow Keys**: Navigate command history
- **Ctrl+L**: Clear terminal screen
- **Ctrl+C**: Cancel current input
- **Escape**: Hide auto-completion suggestions
- **Enter**: Execute command or apply completion

## Auto-completion

The CLI provides intelligent auto-completion for:
- Command names and aliases
- Command arguments and options
- Context-aware suggestions based on current page
- Fuzzy matching for partial commands

### Auto-completion Examples
```bash
$ sk<Tab>           # Completes to "skills"
$ skills fro<Tab>   # Completes to "skills frontend"
$ git<Tab>          # Shows "github" completion
```

## Command History

The CLI maintains a persistent command history with the following features:
- **Persistent Storage**: History is saved in localStorage
- **Navigation**: Use ↑/↓ arrows to navigate through previous commands
- **Search**: Use `history search <term>` to find specific commands
- **Management**: Use `history clear` to clear all history

### History Commands
```bash
$ history              # Show last 10 commands
$ history search git   # Search for commands containing "git"
$ history clear        # Clear all command history
```

## Error Handling

The CLI provides comprehensive error handling:
- **Invalid Commands**: Suggests similar commands for typos
- **Missing Arguments**: Clear error messages for required arguments
- **API Failures**: Graceful fallbacks when AI services are unavailable
- **Rate Limiting**: Prevents abuse with built-in rate limiting

## Mobile Support

The CLI is fully responsive and optimized for mobile devices:
- **Touch-friendly Interface**: Large touch targets and optimized spacing
- **Virtual Keyboard Support**: Proper input handling for mobile keyboards
- **Responsive Layout**: Adapts to different screen sizes
- **Gesture Support**: Swipe gestures for navigation (coming soon)

## AI Integration

The CLI seamlessly integrates with the Gemini 2.0-flash AI model:
- **Natural Language Processing**: Ask questions in plain English
- **Context Awareness**: AI responses consider the current page context
- **Fallback Responses**: Local responses when AI is unavailable
- **Rate Limiting**: Prevents API abuse with intelligent rate limiting

### AI Features
- **Smart Responses**: Contextual answers based on portfolio content
- **Suggestions**: Follow-up questions and related topics
- **FAQ Integration**: Related FAQ suggestions with AI responses
- **Mode Switching**: Seamless transition between command and chat modes

## Performance

The CLI is optimized for performance:
- **Lazy Loading**: Components load only when needed
- **Efficient Rendering**: Optimized React components with minimal re-renders
- **Caching**: Command completions and history are cached
- **Debounced Input**: Auto-completion is debounced to prevent excessive API calls

## Accessibility

The CLI follows accessibility best practices:
- **Keyboard Navigation**: Full keyboard support for all features
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **High Contrast**: Supports high contrast themes
- **Focus Management**: Clear focus indicators and logical tab order

## Security

Security measures implemented in the CLI:
- **Input Sanitization**: All user input is sanitized before processing
- **Rate Limiting**: Prevents abuse and DoS attacks
- **Command Validation**: Dangerous commands are blocked
- **XSS Protection**: Output is properly escaped to prevent XSS attacks

## Browser Support

The CLI supports all modern browsers:
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+

## Development

### Architecture
- **Component-based**: Modular React components for maintainability
- **Hook-based State**: Custom hooks for command history and completion
- **Service Layer**: Separate service layer for command processing
- **Type Safety**: Full TypeScript support with comprehensive types

### Adding New Commands
To add a new command, follow these steps:

1. Define the command in `src/services/cliCommandService.ts`:
```typescript
const newCommand: CLICommand = {
  name: 'newcommand',
  description: 'Description of the new command',
  usage: 'newcommand [options]',
  category: CLI_CATEGORIES.INFO,
  handler: async (args: string[], context: CLIContext) => {
    // Command implementation
    return formatOutput(['Command output'], 'success');
  }
};
```

2. Register the command in the `registerCommands` function
3. Add auto-completion if needed
4. Update documentation

### Testing
The CLI includes comprehensive testing:
- **Unit Tests**: Individual command testing
- **Integration Tests**: Full CLI workflow testing
- **E2E Tests**: Browser-based testing with Playwright
- **Performance Tests**: Load testing for command execution

## Troubleshooting

### Common Issues

**CLI not opening**: Check browser console for JavaScript errors
**Commands not working**: Verify API endpoints are accessible
**Auto-completion not working**: Check if Tab key is being intercepted
**History not persisting**: Verify localStorage is enabled

### Debug Mode
Enable debug mode by adding `?debug=true` to the URL for additional logging.

## Future Enhancements

Planned features for future releases:
- **Navigation Commands**: `cd` command for section navigation
- **File System Simulation**: Virtual file system for portfolio content
- **Themes**: Multiple CLI themes and customization options
- **Plugins**: Extensible plugin system for custom commands
- **Voice Commands**: Voice input support for accessibility
- **Collaborative Features**: Multi-user CLI sessions
- **Advanced Scripting**: Command chaining and scripting support

## Support

For support and questions:
- **Documentation**: Check this guide and inline help
- **GitHub Issues**: Report bugs and feature requests
- **Contact**: Use the contact form or email harsh@greenhacker.tech

---

*Last updated: 2024-12-14*
*Version: 1.0.0*
