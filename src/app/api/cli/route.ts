import { NextRequest, NextResponse } from 'next/server';
import { executeCommand } from '@/services/cliCommandService';
import { CLIContext, CLIResponse } from '@/types/cli';
import { parseCommandLine, validateCommandArgs, sanitizeInput, trackCLIEvent } from '@/utils/cliHelpers';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // 30 requests per minute for CLI

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(identifier);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now();
    
    // Get client information
    const ip = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Rate limit exceeded. Please wait before sending more commands.',
          type: 'error'
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { 
      command: rawCommand, 
      context: requestContext,
      sessionId 
    } = body;

    // Validate required fields
    if (!rawCommand || typeof rawCommand !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Command is required and must be a string',
          type: 'error'
        },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedCommand = sanitizeInput(rawCommand);
    
    if (!sanitizedCommand.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Command cannot be empty',
          type: 'error'
        },
        { status: 400 }
      );
    }

    // Parse command line
    const { command, args } = parseCommandLine(sanitizedCommand);

    // Build CLI context
    const context: CLIContext = {
      currentPage: requestContext?.currentPage || '/',
      sessionId: sessionId || `session-${Date.now()}`,
      userAgent,
      ipAddress: ip,
      history: requestContext?.history || [],
      suggestions: requestContext?.suggestions || []
    };

    // Execute command
    const response: CLIResponse = await executeCommand(sanitizedCommand, context);

    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Track CLI event for analytics
    trackCLIEvent({
      type: 'command_executed',
      command,
      args,
      timestamp: new Date().toISOString(),
      sessionId: context.sessionId,
      context: context.currentPage
    });

    // Add response metadata
    const finalResponse = {
      ...response,
      metadata: {
        ...response.metadata,
        responseTime,
        timestamp: new Date().toISOString(),
        sessionId: context.sessionId
      }
    };

    return NextResponse.json(finalResponse);

  } catch (error) {
    console.error('CLI API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error while processing command',
        type: 'error',
        metadata: {
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'commands':
        // Return available commands
        const { getAllCommands } = await import('@/services/cliCommandService');
        const commands = getAllCommands();
        
        return NextResponse.json({
          success: true,
          commands: commands.map(cmd => ({
            name: cmd.name,
            description: cmd.description,
            usage: cmd.usage,
            category: cmd.category,
            aliases: cmd.aliases
          }))
        });

      case 'health':
        // Health check endpoint
        return NextResponse.json({
          success: true,
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        });

      case 'stats':
        // Return CLI usage statistics
        const stats = {
          totalRequests: Array.from(rateLimitStore.values()).reduce((sum, limit) => sum + limit.count, 0),
          activeUsers: rateLimitStore.size,
          uptime: process.uptime(),
          timestamp: new Date().toISOString()
        };

        return NextResponse.json({
          success: true,
          stats
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action. Available actions: commands, health, stats'
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('CLI API GET error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
