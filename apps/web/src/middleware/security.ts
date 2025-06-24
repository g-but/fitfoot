import { NextRequest, NextResponse } from 'next/server';

// Rate limiting storage (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; reset: number }>();

interface SecurityConfig {
  rateLimitRequests: number;
  rateLimitWindow: number; // in seconds
  enableCSRF: boolean;
  enableAuditLog: boolean;
}

const defaultConfig: SecurityConfig = {
  rateLimitRequests: 100, // requests per window
  rateLimitWindow: 60, // 1 minute
  enableCSRF: true,
  enableAuditLog: true,
};

export class SecurityMiddleware {
  private config: SecurityConfig;

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  // Rate limiting
  async rateLimit(request: NextRequest): Promise<NextResponse | null> {
    const ip = this.getClientIP(request);
    const key = `rate_limit:${ip}`;
    const now = Date.now();
    const windowStart = now - (this.config.rateLimitWindow * 1000);

    // Clean up old entries
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.reset < now) {
        rateLimitStore.delete(k);
      }
    }

    const current = rateLimitStore.get(key);
    
    if (!current || current.reset < now) {
      // New window
      rateLimitStore.set(key, {
        count: 1,
        reset: now + (this.config.rateLimitWindow * 1000)
      });
      return null; // Allow request
    }

    if (current.count >= this.config.rateLimitRequests) {
      // Rate limit exceeded
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded', 
          retryAfter: Math.ceil((current.reset - now) / 1000) 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((current.reset - now) / 1000).toString(),
            'X-RateLimit-Limit': this.config.rateLimitRequests.toString(),
            'X-RateLimit-Remaining': Math.max(0, this.config.rateLimitRequests - current.count).toString(),
            'X-RateLimit-Reset': current.reset.toString(),
          }
        }
      );
    }

    // Increment counter
    current.count++;
    return null; // Allow request
  }

  // CSRF Protection
  async validateCSRF(request: NextRequest): Promise<NextResponse | null> {
    if (!this.config.enableCSRF) return null;

    // Skip CSRF for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return null;
    }

    const csrfToken = request.headers.get('X-CSRF-Token') || 
                     request.headers.get('x-csrf-token');
    const sessionToken = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!csrfToken || !sessionToken) {
      return NextResponse.json(
        { error: 'CSRF token required' },
        { status: 403 }
      );
    }

    // In production, validate the CSRF token properly
    // For now, just check if it exists and matches expected format
    if (!this.isValidCSRFToken(csrfToken, sessionToken)) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }

    return null; // Valid CSRF token
  }

  // Security headers
  addSecurityHeaders(response: NextResponse): NextResponse {
    const headers = {
      // Prevent XSS attacks
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      
      // HTTPS enforcement
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      
      // Content Security Policy
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Adjust for your needs
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self' http://localhost:9000 ws://localhost:*", // Allow dev connections
        "frame-ancestors 'none'"
      ].join('; '),
      
      // Permissions Policy
      'Permissions-Policy': [
        'camera=()',
        'microphone=()',
        'geolocation=()',
        'payment=()',
        'usb=()'
      ].join(', '),
      
      // Referrer Policy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    };

    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }

  // Audit logging
  async auditLog(request: NextRequest, response?: NextResponse): Promise<void> {
    if (!this.config.enableAuditLog) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      ip: this.getClientIP(request),
      userAgent: request.headers.get('User-Agent') || 'Unknown',
      referer: request.headers.get('Referer') || 'Direct',
      responseStatus: response?.status || 'N/A',
      userId: this.extractUserId(request),
      sessionId: this.extractSessionId(request),
    };

    // In production, send to proper logging service (e.g., Winston, Sentry)
    
    // Store critical actions (failed logins, admin actions, etc.)
    if (this.isCriticalAction(request, response)) {
      await this.storeCriticalAuditLog(logEntry);
    }
  }

  // Input validation and sanitization
  sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      // Remove potential XSS attempts
      return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    
    if (Array.isArray(input)) {
      return input.map(item => this.sanitizeInput(item));
    }
    
    if (input && typeof input === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[this.sanitizeInput(key)] = this.sanitizeInput(value);
      }
      return sanitized;
    }
    
    return input;
  }

  // Helper methods
  private getClientIP(request: NextRequest): string {
    return request.headers.get('X-Forwarded-For')?.split(',')[0] ||
           request.headers.get('X-Real-IP') ||
           request.ip ||
           'unknown';
  }

  private isValidCSRFToken(csrfToken: string, sessionToken: string): boolean {
    // Simple validation - in production, use proper CSRF token validation
    // The token should be derived from the session token and a secret
    return csrfToken.length > 10 && /^[a-zA-Z0-9+/=]+$/.test(csrfToken);
  }

  private extractUserId(request: NextRequest): string | null {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;

    try {
      const token = authHeader.substring(7);
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.userId || null;
    } catch {
      return null;
    }
  }

  private extractSessionId(request: NextRequest): string | null {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;

    try {
      const token = authHeader.substring(7);
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sessionId || payload.jti || null;
    } catch {
      return null;
    }
  }

  private isCriticalAction(request: NextRequest, response?: NextResponse): boolean {
    const criticalPaths = [
      '/api/auth/',
      '/api/admin/',
      '/api/products/',
      '/api/orders/',
      '/api/user/',
    ];

    const isCriticalPath = criticalPaths.some(path => 
      request.url.includes(path)
    );

    const isFailedAuth = response?.status === 401 || response?.status === 403;
    const isServerError = response?.status && response.status >= 500;

    return isCriticalPath || isFailedAuth || isServerError;
  }

  private async storeCriticalAuditLog(logEntry: any): Promise<void> {
    // In production, store in database or send to monitoring service
    
    // Example: Store failed login attempts for brute force detection
    if (logEntry.url.includes('/api/auth/') && logEntry.responseStatus === 401) {
      const key = `failed_logins:${logEntry.ip}`;
      // Implement failed login tracking and temporary IP blocking
    }
  }
}

// Factory function for easy use
export function createSecurityMiddleware(config?: Partial<SecurityConfig>) {
  return new SecurityMiddleware(config);
}

// Higher-order function for API routes
export function withSecurity(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config?: Partial<SecurityConfig>
) {
  const security = createSecurityMiddleware(config);

  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Apply security checks
      const rateLimitResult = await security.rateLimit(request);
      if (rateLimitResult) return rateLimitResult;

      const csrfResult = await security.validateCSRF(request);
      if (csrfResult) return csrfResult;

      // Sanitize request body if present
      if (request.body) {
        const body = await request.json();
        const sanitizedBody = security.sanitizeInput(body);
        // Note: You'll need to reconstruct the request with sanitized body
      }

      // Call the actual handler
      const response = await handler(request);

      // Add security headers
      const secureResponse = security.addSecurityHeaders(response);

      // Audit log
      await security.auditLog(request, secureResponse);

      return secureResponse;
    } catch (error) {
      
      // Log the error
      await security.auditLog(request);
      
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
} 