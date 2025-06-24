/**
 * Structured logging utility for FitFoot
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isServer = typeof window === 'undefined';

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log warnings and errors
    if (!this.isDevelopment) {
      return level === 'warn' || level === 'error';
    }
    return true;
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      // eslint-disable-next-line no-console
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      // eslint-disable-next-line no-console
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
    }
  }

  error(message: string, error?: Error, context?: LogContext): void {
    if (this.shouldLog('error')) {
      const errorContext = error ? { ...context, error: error.message, stack: error.stack } : context;
      
      // Send to Sentry in production
      if (!this.isDevelopment && typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(error || new Error(message), {
          tags: { component: context?.component },
          extra: context
        });
      }
    }
  }

  // Specialized logging methods
  apiCall(method: string, url: string, status?: number, context?: LogContext): void {
    this.info(`API ${method} ${url}${status ? ` - ${status}` : ''}`, {
      ...context,
      component: 'api',
      method,
      url,
      status
    });
  }

  userAction(action: string, userId?: string, context?: LogContext): void {
    this.info(`User action: ${action}`, {
      ...context,
      component: 'user-action',
      action,
      userId
    });
  }

  performance(operation: string, duration: number, context?: LogContext): void {
    this.info(`Performance: ${operation} took ${duration}ms`, {
      ...context,
      component: 'performance',
      operation,
      duration
    });
  }
}

export const logger = new Logger();

// Development helper - can be removed in production
export const devLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
  }
};