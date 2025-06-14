# CLI Chatbot Demo Script

This document provides a comprehensive demo script to showcase all the features of the GREENHACKER CLI system.

## Demo Flow

### 1. Opening the CLI
1. Click the terminal icon in the bottom-right corner
2. Notice the welcome message and initial setup
3. Observe the terminal-like interface with proper styling

### 2. Basic Help and Navigation
```bash
# Start with help to show available commands
$ help

# Show system information
$ version

# Check current user context
$ whoami

# List available sections
$ ls
```

### 3. Information Commands Demo
```bash
# Learn about the developer
$ about

# Show technical skills
$ skills

# Show frontend-specific skills
$ skills frontend

# Show backend-specific skills  
$ skills backend

# Display recent projects
$ projects

# Show professional experience
$ experience

# Show recent experience
$ experience recent
```

### 4. GitHub Integration Demo
```bash
# Show GitHub profile overview
$ github

# Show GitHub repositories
$ github repos

# Show GitHub statistics
$ github stats
```

### 5. Contact and Status Demo
```bash
# Get contact information
$ contact

# Check current availability
$ status

# Check project status
$ status projects

# Check availability details
$ status availability
```

### 6. Auto-completion Demo
```bash
# Type partial commands and press Tab
$ sk<Tab>           # Should complete to "skills"
$ skills fro<Tab>   # Should complete to "skills frontend"
$ git<Tab>          # Should show "github" completion
$ exp<Tab>          # Should complete to "experience"
```

### 7. Command History Demo
```bash
# Run several commands first
$ about
$ skills
$ projects
$ contact

# Then demonstrate history
$ history           # Show command history
$ ↑                # Navigate up through history
$ ↓                # Navigate down through history
```

### 8. System Commands Demo
```bash
# Show current date and time
$ date

# Show date in different formats
$ date iso
$ date utc
$ date local

# Echo command
$ echo "Hello from GREENHACKER CLI!"

# Clear the screen
$ clear
```

### 9. FAQ System Demo
```bash
# Show FAQ categories
$ faq

# Search for specific topics
$ faq technical
$ faq general
```

### 10. AI Integration Demo
```bash
# Ask the AI assistant questions
$ ask "What technologies do you specialize in?"

$ ask "How can I hire you for a project?"

$ ask "What's your experience with React?"

$ ask "Tell me about your latest projects"

# Switch to chat mode
$ chat

# In chat mode, type natural language
"What makes you different from other developers?"

# Switch back to command mode
$ cmd
```

### 11. Error Handling Demo
```bash
# Try invalid commands to show error handling
$ invalidcommand

# Try commands with missing arguments
$ echo

# Try commands with too many arguments
$ whoami extra arguments
```

### 12. Advanced Features Demo
```bash
# Search command history
$ history search skills

# Clear command history
$ history clear

# Show help for specific commands
$ help skills
$ help github
$ help ask
```

### 13. Mobile Responsiveness Demo
1. Resize browser window to mobile size
2. Notice how CLI adapts to smaller screens
3. Test touch interactions
4. Verify virtual keyboard compatibility

### 14. Keyboard Shortcuts Demo
```bash
# Demonstrate keyboard shortcuts
Ctrl+L              # Clear screen
Ctrl+C              # Cancel input
Escape              # Hide completions
Tab                 # Auto-complete
↑/↓                # History navigation
```

### 15. Context Awareness Demo
1. Navigate to different pages (if available)
2. Open CLI on different pages
3. Notice how suggestions change based on context
4. Show how AI responses adapt to current page

## Demo Script for Presentations

### Quick Demo (5 minutes)
```bash
$ help              # Show capabilities
$ about             # Personal introduction
$ skills            # Technical expertise
$ projects          # Portfolio showcase
$ ask "What's your strongest skill?"
$ contact           # How to get in touch
```

### Comprehensive Demo (15 minutes)
```bash
# Introduction
$ version           # System information
$ help              # Available commands

# Personal Information
$ about             # Background
$ skills frontend   # Frontend skills
$ skills backend    # Backend skills
$ experience recent # Recent work

# Portfolio Showcase
$ projects          # Project overview
$ github repos      # GitHub repositories
$ github stats      # Development statistics

# AI Integration
$ ask "What makes you a good developer?"
$ chat              # Switch to chat mode
"Tell me about your problem-solving approach"
$ cmd               # Back to command mode

# Practical Information
$ status            # Current availability
$ contact           # How to reach out
$ faq               # Common questions

# Advanced Features
$ history           # Command history
$ ls                # Section navigation
$ date              # System information
```

## Demo Tips

### For Developers
- Emphasize the technical implementation
- Show auto-completion and command history
- Demonstrate error handling and validation
- Highlight AI integration and context awareness

### For Clients/Employers
- Focus on portfolio content and skills
- Show professional experience and projects
- Demonstrate communication through AI assistant
- Highlight availability and contact information

### For General Audience
- Start with simple commands like `help` and `about`
- Show the interactive nature with auto-completion
- Demonstrate the AI assistant capabilities
- Keep it engaging with varied command types

## Common Demo Scenarios

### Job Interview Demo
```bash
$ about             # Personal introduction
$ experience        # Professional background
$ skills            # Technical capabilities
$ projects          # Portfolio showcase
$ github stats      # Development activity
$ ask "What's your approach to problem-solving?"
$ status            # Availability for opportunities
```

### Client Consultation Demo
```bash
$ skills            # Technical expertise
$ experience recent # Recent project experience
$ projects          # Portfolio examples
$ ask "How do you ensure project quality?"
$ status projects   # Current project capacity
$ contact           # How to start a project
```

### Technical Showcase Demo
```bash
$ version           # Technical details
$ help              # Command structure
$ ls                # Navigation capabilities
$ skills backend    # Technical depth
$ github repos      # Code examples
$ ask "Explain your development process"
$ history           # Advanced features
```

## Troubleshooting During Demo

### If Commands Don't Work
1. Check browser console for errors
2. Verify API endpoints are accessible
3. Try refreshing the page
4. Use fallback commands like `help` and `about`

### If AI Assistant Fails
1. Mention it's a live AI integration
2. Show fallback responses
3. Continue with structured commands
4. Highlight the robust error handling

### If Auto-completion Doesn't Work
1. Demonstrate manual command entry
2. Show command help with `help <command>`
3. Use arrow keys for history navigation
4. Focus on command variety and responses

## Post-Demo Follow-up

### Questions to Ask
- "What impressed you most about the CLI interface?"
- "Which commands would be most useful for your needs?"
- "How do you see this fitting into your workflow?"
- "What other features would you like to see?"

### Next Steps
- Provide contact information via `contact` command
- Show how to access the full portfolio
- Demonstrate the traditional web interface
- Discuss project requirements and timeline

---

*This demo script is designed to showcase the full capabilities of the GREENHACKER CLI system in various contexts and audiences.*
