# FitFoot Component Library

**Created Date:** 2025-01-23  
**Last Modified Date:** 2025-01-23  
**Last Modified Summary:** Created centralized component library documentation

## 📚 Overview

This is the complete documentation for all FitFoot UI components, organized by category for easy navigation.

## 🎨 Design System

### Colors
- **Primary**: Amber (Swiss gold) - `bg-amber-600`, `text-amber-600`
- **Secondary**: Gray - `bg-gray-200`, `text-gray-700`
- **Success**: Green - `bg-green-600`, `text-green-600`
- **Error**: Red - `bg-red-600`, `text-red-600`

### Typography
- **Headers**: `font-semibold` with varying sizes
- **Body**: `text-base` regular weight
- **Small**: `text-sm` for secondary information

### Spacing
- **Consistent scale**: 4, 8, 12, 16, 24, 32, 48px
- **Component padding**: Usually `p-4` or `p-6`
- **Section margins**: Usually `mb-6` or `mb-8`

## 🧩 Component Categories

### 🎛️ Layout Components
| Component | Purpose | Location | Status |
|-----------|---------|----------|---------|
| [Header](./header.md) | Main navigation header | `layout/header.tsx` | ✅ Complete |
| [Footer](./footer.md) | Site footer with links | `layout/footer.tsx` | 📝 Planned |
| [Layout](./layout.md) | Page layout wrapper | `layout/RootLayoutContent.tsx` | 📝 Planned |

### 🎨 UI Components
| Component | Purpose | Location | Status |
|-----------|---------|----------|---------|
| [Button](./ui/button.md) | Interactive buttons | `ui/button.tsx` | ✅ Complete |
| [Input](./ui/input.md) | Form inputs | `ui/input.tsx` | 📝 Planned |
| [Badge](./ui/badge.md) | Status indicators | `ui/badge.tsx` | ✅ Complete |
| [Logo](./ui/logo.md) | Brand logo component | `ui/logo.tsx` | ✅ Complete |

### 🔐 Authentication Components
| Component | Purpose | Location | Status |
|-----------|---------|----------|---------|
| [UserDropdown](./auth/user-dropdown.md) | User menu dropdown | `auth/user-dropdown.tsx` | ✅ Complete |
| [SessionGuard](./auth/session-guard.md) | Route protection | `auth/session-guard.tsx` | ✅ Complete |

### 🛒 E-commerce Components
| Component | Purpose | Location | Status |
|-----------|---------|----------|---------|
| [ProductCard](./ecommerce/product-card.md) | Product display card | `products/ProductCard.tsx` | 📝 Planned |
| [CartItem](./ecommerce/cart-item.md) | Shopping cart item | `cart/CartItem.tsx` | 📝 Planned |
| [MiniCart](./ecommerce/mini-cart.md) | Header cart dropdown | `cart/mini-cart.tsx` | ✅ Complete |

### ⚙️ Admin Components
| Component | Purpose | Location | Status |
|-----------|---------|----------|---------|
| [AdminLayout](./admin/admin-layout.md) | Admin page layout | `admin/AdminLayout.tsx` | ✅ Complete |
| [ProductEditor](./admin/product-editor.md) | Product editing form | `admin/ProductEditor.tsx` | ✅ Complete |
| [AnalyticsDashboard](./admin/analytics.md) | Admin analytics | `admin/AnalyticsDashboard.tsx` | ✅ Complete |

## 🎯 Usage Guidelines

### Importing Components
```typescript
// UI Components
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Layout Components  
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

// Auth Components
import { UserDropdown } from '@/components/auth/user-dropdown'
```

### Component Props Pattern
```typescript
interface ComponentProps {
  children?: React.ReactNode
  className?: string
  // Component-specific props
}

export function Component({ children, className, ...props }: ComponentProps) {
  return (
    <div className={cn('base-styles', className)}>
      {children}
    </div>
  )
}
```

### Styling Guidelines
- Use Tailwind CSS for all styling
- Apply responsive design with mobile-first approach
- Use `cn()` utility for conditional classes
- Follow consistent spacing and color patterns

## 🔍 Component Status Legend

- ✅ **Complete**: Fully documented with examples
- 🔄 **In Progress**: Being documented
- 📝 **Planned**: Not yet documented
- ⚠️ **Needs Update**: Documentation outdated

## 🛠️ Development Workflow

### Adding New Components
1. Create component in appropriate directory
2. Add TypeScript interfaces
3. Implement responsive design
4. Add error handling
5. Create documentation file
6. Update this index

### Updating Components
1. Modify component code
2. Update documentation
3. Test across breakpoints
4. Update modification date

## 📋 Component Checklist

### Before Creating
- [ ] Check if similar component exists
- [ ] Define clear purpose and scope
- [ ] Plan responsive behavior
- [ ] Consider accessibility

### During Development
- [ ] Use TypeScript interfaces
- [ ] Follow naming conventions
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Test responsive design

### After Creation
- [ ] Write documentation
- [ ] Add usage examples
- [ ] Update this index
- [ ] Create tests if needed

## 🎨 Figma Design System

Our design system in Figma includes:
- Color palette and typography
- Component specifications
- Responsive breakpoints
- Interaction states

## 📱 Responsive Breakpoints

```css
/* Mobile First */
default: 0px-639px
sm: 640px+
md: 768px+
lg: 1024px+
xl: 1280px+
2xl: 1536px+
```

## 🔗 Related Documentation

- [Component Patterns for AI](../ai/COMPONENT_PATTERNS.md) - Reusable patterns
- [UI Guidelines](../frontend/UI_GUIDELINES.md) - Design system details
- [Architecture Guide](../ARCHITECTURE.md) - System overview

---

**💡 Pro Tip**: Use the search function in your editor to quickly find component documentation by name! 