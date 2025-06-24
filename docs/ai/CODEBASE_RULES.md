# FitFoot Codebase Rules for AI Agents

**Created Date:** 2025-01-23  
**Last Modified Date:** 2025-01-23  
**Last Modified Summary:** Initial creation of AI-specific development standards

## 🎯 Purpose

This document provides AI agents with essential context and patterns for working within the FitFoot codebase.

## 🏗️ Project Context

**FitFoot** is a Swiss-focused sustainable footwear e-commerce platform with:
- Next.js frontend (TypeScript)
- MedusaJS backend
- Supabase database
- Sanity CMS

## 📋 Development Standards

### Code Quality Rules
- Use descriptive variable and function names
- Always include TypeScript types
- Implement proper error handling with Sentry
- Follow DRY principles
- Add meaningful comments for complex logic

### Component Structure
```typescript
interface ComponentProps {
  // Define all props with types
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Component implementation
}
```

### Error Handling Pattern
```typescript
try {
  // risky operation
} catch (error) {
  Sentry.captureException(error, {
    tags: { section: 'component-name' },
    user: { id: userId },
    extra: { context: 'operation-context' }
  });
  // fallback behavior
}
```

## 🎨 Frontend Rules

### File Organization
```
src/components/
├── ui/           # Reusable UI components
├── layout/       # Layout components
├── auth/         # Authentication components
└── admin/        # Admin interface
```

### Styling Guidelines
- Use Tailwind CSS
- Mobile-first responsive design
- Consistent spacing (4, 8, 12, 16, 24px)
- Follow design system patterns

## ⚙️ Backend Rules

### API Development
- Always validate input data
- Use proper error handling
- Include authentication checks
- Return consistent response formats

### Database Operations
- Use TypeScript for all operations
- Implement proper error handling
- Use transactions for multi-step operations

## 🧪 Testing Standards

- Write tests for all components
- Test user interactions
- Include error scenarios
- Use meaningful test descriptions

## 🤖 AI-Specific Guidelines

### When Creating Components
1. Check for existing similar components
2. Use established patterns
3. Include proper TypeScript types
4. Add error handling
5. Consider responsive design

### When Modifying Code
1. Understand existing patterns
2. Maintain consistency
3. Update documentation
4. Consider breaking changes

## ⚠️ Common Pitfalls to Avoid

- No `console.log` in production
- Avoid `any` type in TypeScript
- Don't forget loading states
- Always handle errors gracefully

## 📝 Documentation Requirements

- Update modification dates
- Include change summaries
- Document component props
- Update related documentation

## 🎯 **Quick Reference**

### **Before Making Changes**
1. Understand the existing codebase
2. Check for similar implementations
3. Follow established patterns
4. Consider impact on other components

### **After Making Changes**
1. Update documentation dates
2. Test your changes thoroughly
3. Check for any breaking changes
4. Update related tests

### **Emergency Situations**
- Check Sentry for error details
- Look at recent commits for context
- Follow error handling patterns
- Communicate with team if needed

---

**🎯 Success Metric**: Code that feels like it was written by the same person, following FitFoot's high standards for quality, maintainability, and user experience. 