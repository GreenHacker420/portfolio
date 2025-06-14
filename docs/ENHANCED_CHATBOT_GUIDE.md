# Enhanced Chatbot System Guide

## Overview

The Enhanced Chatbot System provides comprehensive AI-powered assistance for your portfolio website with integrated FAQ functionality, real-time database context, and advanced user experience features.

## Features

### 🤖 AI-Powered Conversations
- **Gemini 2.0-flash Integration**: Latest Google AI model for intelligent responses
- **Real-time Context**: Dynamic website data integration from database
- **Contextual Awareness**: Responses adapt based on current page/section
- **Session Management**: Persistent conversations with unique session tracking

### 📚 Comprehensive FAQ System
- **Categorized Questions**: Technical, Projects, Contact, Experience, General
- **Smart Search**: Full-text search across questions, answers, and tags
- **Analytics Tracking**: View counts and helpfulness ratings
- **Admin Management**: Full CRUD operations through admin panel

### 🎨 Enhanced User Experience
- **Modern UI**: Sleek design with animations and responsive layout
- **Expandable Interface**: Minimize/maximize functionality
- **Quick Suggestions**: Context-aware suggested questions
- **FAQ Sidebar**: Easy access to popular questions
- **Typing Indicators**: Real-time conversation feedback

### 📊 Analytics & Insights
- **Chat Logging**: All interactions stored for analysis
- **Response Times**: Performance monitoring
- **User Feedback**: Helpfulness ratings for continuous improvement
- **Usage Statistics**: Popular questions and conversation patterns

## Technical Architecture

### Database Schema

```sql
-- FAQ System
model FAQ {
  id          String   @id @default(cuid())
  question    String
  answer      String   @db.Text
  category    String   // technical, projects, contact, general, etc.
  tags        String?  // JSON array of searchable tags
  isVisible   Boolean  @default(true)
  displayOrder Int     @default(0)
  viewCount   Int      @default(0)
  helpful     Int      @default(0)
  notHelpful  Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

-- Chat Analytics
model ChatInteraction {
  id          String   @id @default(cuid())
  sessionId   String   // Anonymous session identifier
  userMessage String   @db.Text
  botResponse String   @db.Text
  context     String?  // Page context
  isHelpful   Boolean? // User feedback
  responseTime Int?    // Response time in milliseconds
  createdAt   DateTime @default(now())
}
```

### API Endpoints

#### Public APIs
- `GET /api/faq` - Search and retrieve FAQs
- `POST /api/faq/[id]` - Track FAQ views and ratings
- `POST /api/ai/chat` - AI conversation endpoint

#### Admin APIs
- `GET /api/admin/faq` - List FAQs with pagination
- `POST /api/admin/faq` - Create new FAQ
- `GET /api/admin/faq/[id]` - Get specific FAQ
- `PATCH /api/admin/faq/[id]` - Update FAQ
- `DELETE /api/admin/faq/[id]` - Delete FAQ

### AI Context System

The chatbot has comprehensive knowledge about:

#### Personal Information
- Name: Harsh Hirawat (aka GreenHacker)
- Title: Full Stack Developer & AI Enthusiast
- Location: India (working with international clients)
- Contact: Through website contact form

#### Technical Expertise
- **Frontend**: React, Next.js, TypeScript, Tailwind CSS, Three.js
- **Backend**: Node.js, Python, Express.js, GraphQL
- **Databases**: PostgreSQL, MongoDB, Prisma ORM
- **AI/ML**: PyTorch, TensorFlow, Computer Vision, NLP
- **DevOps**: Docker, AWS, Git, CI/CD

#### Real-time Data Integration
- Current skills from database with proficiency levels
- Published projects with technologies and descriptions
- Social links and contact information
- Personal information and bio

## Usage Guide

### For Users

1. **Starting a Conversation**
   - Click the floating chatbot button (bottom-right)
   - Type your question or select from suggestions
   - Use natural language - the AI understands context

2. **Using FAQ Features**
   - Click the help icon to open FAQ sidebar
   - Browse popular questions by category
   - Click any FAQ to get instant answers

3. **Getting Better Responses**
   - Be specific about what you're looking for
   - Mention technologies, projects, or skills for detailed info
   - Ask follow-up questions for clarification

### For Administrators

1. **Managing FAQs**
   - Access admin panel at `/admin/faq`
   - Create, edit, and organize FAQ entries
   - Set categories and tags for better searchability
   - Monitor view counts and helpfulness ratings

2. **Monitoring Conversations**
   - View chat analytics in admin dashboard
   - Track popular questions and response times
   - Identify areas for FAQ improvements

## Configuration

### Environment Variables

```env
# Required for AI functionality
GEMINI_API_KEY=your_gemini_api_key_here

# Database (already configured)
DATABASE_URL=your_database_url_here
```

### Customization Options

#### FAQ Categories
Default categories include:
- `technical` - Technical skills and expertise
- `projects` - Project details and portfolio
- `contact` - Contact and collaboration inquiries
- `experience` - Professional background
- `general` - General questions

#### AI Personality
The AI assistant is configured to be:
- Professional yet friendly
- Technical when appropriate
- Helpful and informative
- Enthusiastic about technology

## Best Practices

### Content Management
1. **FAQ Organization**
   - Use clear, concise questions
   - Provide comprehensive answers
   - Tag content appropriately
   - Regular content updates

2. **Response Quality**
   - Monitor chat logs for common questions
   - Add frequently asked questions to FAQ
   - Update AI context with new information

### Performance Optimization
1. **Rate Limiting**
   - 5 requests per minute per IP for AI chat
   - Prevents abuse and manages costs

2. **Caching**
   - FAQ data cached for performance
   - Real-time data fetched as needed

### Security Considerations
1. **Data Privacy**
   - No personal data stored in chat logs
   - Anonymous session tracking
   - IP addresses for rate limiting only

2. **Content Moderation**
   - Input validation and sanitization
   - Response filtering for appropriate content

## Troubleshooting

### Common Issues

1. **AI Not Responding**
   - Check GEMINI_API_KEY configuration
   - Verify API quota and billing
   - Check network connectivity

2. **FAQ Not Loading**
   - Verify database connection
   - Check Prisma schema migration
   - Ensure FAQ data is seeded

3. **Slow Response Times**
   - Monitor API rate limits
   - Check database performance
   - Optimize context data size

### Debug Mode
Enable detailed logging by setting:
```env
NODE_ENV=development
```

## Future Enhancements

### Planned Features
- Voice input/output capabilities
- Multi-language support
- Advanced analytics dashboard
- Integration with external knowledge bases
- Automated FAQ generation from chat logs

### Customization Ideas
- Industry-specific knowledge bases
- Integration with project management tools
- Advanced conversation flows
- Personalized user experiences

## Support

For technical support or feature requests:
1. Check the troubleshooting section
2. Review chat logs for error patterns
3. Contact through the website's contact form
4. Submit issues through the admin panel

---

*This enhanced chatbot system represents a significant upgrade to user engagement and support capabilities, providing both automated assistance and comprehensive FAQ resources for visitors to your portfolio website.*
