# 🎨 UI Components Guide

**Created:** 2024-12-28  
**Last Modified:** 2024-12-28  
**Last Modified Summary:** Added Logo component documentation after integrating image logo

## Overview

This guide covers the reusable UI components in the Fitfoot application, focusing on design consistency and proper usage patterns.

## Color System

The Fitfoot brand uses a premium black, white, and gold color scheme designed to convey luxury, sophistication, and quality:

### Primary Colors
- **Black (`#000000`)**: Main text, premium backgrounds
- **White (`#FFFFFF`)**: Clean backgrounds, contrast text
- **Gold (`#D4AF37`)**: Premium accents, CTAs, highlights

### Color Psychology
- **Black**: Sophistication, premium quality, elegance
- **White**: Minimalism, cleanliness, Swiss precision
- **Gold**: Luxury, premium value, exclusivity

### CSS Custom Properties
```css
:root {
  --background: 0 0% 100%;           /* Pure White */
  --foreground: 0 0% 0%;             /* Pure Black */
  --primary: 42 76% 52%;             /* Rich Gold #D4AF37 */
  --primary-foreground: 0 0% 0%;     /* Black on Gold */
  --gold: 42 76% 52%;                /* #D4AF37 */
  --gold-light: 51 100% 50%;         /* #FFD700 */
  --gold-dark: 43 73% 35%;           /* #B8860B */
}
```

## Logo Component

The Logo component provides a flexible way to display the Fitfoot brand logo throughout the application.

### Basic Usage

```tsx
import { Logo, HeaderLogo, FooterLogo } from '@/components/ui/logo'

// Basic logo with default settings
<Logo />

// Logo with text shown alongside
<Logo showText={true} />

// Custom variant and size
<Logo variant="footer" size="lg" showText={true} />
```

### Specialized Components

#### HeaderLogo
Pre-configured for header usage with optimal sizing and priority loading.

```tsx
import { HeaderLogo } from '@/components/ui/logo'

<HeaderLogo 
  showText={false}  // Shows only image by default
  text="Fitfoot"
/>
```

#### FooterLogo
Pre-configured for footer usage with larger size and text enabled.

```tsx
import { FooterLogo } from '@/components/ui/logo'

<FooterLogo 
  showText={true}   // Shows text by default
  text="Fitfoot"
/>
```

### Props Reference

| Prop       | Type                                    | Default    | Description |
|------------|-----------------------------------------|------------|-------------|
| `variant`  | `'header' \| 'footer' \| 'standalone'` | `'header'` | Context-specific styling |
| `size`     | `'sm' \| 'md' \| 'lg'`                 | `'md'`     | Logo size |
| `showText` | `boolean`                              | `false`    | Whether to show text alongside logo |
| `text`     | `string`                               | `'Fitfoot'`| Text to display |
| `href`     | `string \| undefined`                  | `'/'`      | Link destination (undefined for no link) |
| `className`| `string`                               | -          | Additional CSS classes |
| `priority` | `boolean`                              | `false`    | Next.js Image priority loading |

### Implementation Details

#### Image Fallbacks
The Logo component implements a robust fallback system:

1. **Primary:** SVG logo (`/logo.svg`)
2. **Fallback:** PNG logo (`/logo1.png`)
3. **Final fallback:** Text-only logo

#### Responsive Behavior
- **Header variant:** Optimized for navigation bars
- **Footer variant:** Larger size suitable for footer sections
- **Standalone:** Flexible sizing for other contexts

#### Accessibility
- Proper alt text for screen readers
- ARIA labels for linked logos
- Semantic HTML structure

### File Requirements

Ensure these logo files exist in the `public/` directory:

- `/logo.svg` - Primary SVG logo
- `/logo1.png` - PNG fallback logo

### Integration Examples

#### In Header Component
```tsx
// apps/web/src/components/layout/header.tsx
<div onClick={closeMobileMenu}>
  <HeaderLogo 
    showText={!siteSettings?.logo?.image}
    text={siteSettings?.logo?.text || 'Fitfoot'}
  />
</div>
```

#### In Footer Component
```tsx
// apps/web/src/components/layout/footer.tsx
<FooterLogo 
  showText={true}
  text={siteSettings?.logo?.text || 'Fitfoot'}
/>
```

### Testing

The Logo component includes comprehensive tests covering:
- Image loading and fallbacks
- Text display logic
- Link functionality
- Accessibility attributes
- Responsive behavior

See `apps/web/src/components/layout/__tests__/header.test.tsx` for implementation examples.

---

## Design Tokens

### Logo Sizes
- **Small (`sm`):** `h-8` (32px height)
- **Medium (`md`):** `h-10` (40px height)  
- **Large (`lg`):** `h-16` (64px height)

### Colors
- **Primary text:** Uses theme `text-primary`
- **Footer text:** White (`text-white`) in footer variant

---

## Next Steps

When adding new UI components:

1. Follow the same pattern as the Logo component
2. Include proper TypeScript interfaces
3. Add comprehensive tests
4. Document in this file
5. Update the main documentation index

---

**Related Documentation:**
- [Design System](../architecture/design-system.md)
- [Component Architecture](../architecture/components.md)
- [Testing Strategy](./testing.md) 

# UI Components Documentation

**Created Date:** 2025-01-10  
**Last Modified Date:** 2025-01-10  
**Last Modified Summary:** Updated documentation to reflect the new black, white, and gold premium branding color scheme

## Overview

This document provides comprehensive documentation for all UI components used in the Fitfoot application, including the newly implemented premium color scheme using black, white, and gold branding.

## Button Component

Located at: `apps/web/src/components/ui/button.tsx`

### New Premium Variants

#### Gold Button (`variant="gold"`)
```tsx
<Button variant="gold" size="lg">
  Shop Collection
</Button>
```
- **Use case**: Primary CTAs, premium actions
- **Style**: Gold gradient background with black text
- **Hover**: Elevated with shadow and subtle animation

#### Outline Gold (`variant="outline-gold"`)
```tsx
<Button variant="outline-gold" size="lg">
  Learn More
</Button>
```
- **Use case**: Secondary actions, alternative CTAs
- **Style**: Gold border with gold text on transparent background
- **Hover**: Fills with gold gradient

#### Premium Variant
```tsx
<Button variant="premium" size="xl">
  Exclusive Collection
</Button>
```
- **Use case**: Special promotions, luxury products
- **Style**: Enhanced gold gradient with scale animation

### Available Sizes
- `sm`: Height 36px, compact padding
- `default`: Height 40px, standard padding
- `lg`: Height 44px, larger padding
- `xl`: Height 48px, premium sizing with enhanced typography

### Usage Guidelines
- Use `gold` variant for primary actions and CTAs
- Use `outline-gold` for secondary actions
- Use `premium` variant sparingly for special occasions
- Maintain 3:1 contrast ratio for accessibility

## Header Component

Located at: `apps/web/src/components/layout/header.tsx`

### Updated Features
- Premium gold CTA button (`variant="accent"`)
- Enhanced hover states with gold accents
- Improved navigation link styling
- Better mobile menu contrast

### Navigation Styling
```css
.nav-link {
  color: hsl(var(--foreground) / 0.7);
  transition: color 300ms;
}

.nav-link:hover {
  color: hsl(var(--foreground));
  color: hsl(var(--primary)); /* Gold accent */
}
```

## Footer Component

Located at: `apps/web/src/components/layout/footer.tsx`

### Design Updates
- **Background**: Pure black (`bg-foreground`)
- **Text**: White with opacity variations
- **Links**: Gold hover states for premium feel
- **Social icons**: Gold accent on hover

### Color Implementation
```css
.footer {
  background: hsl(var(--foreground)); /* Black */
  color: hsl(var(--background));     /* White */
}

.footer-link:hover {
  color: hsl(var(--primary));        /* Gold */
}
```

## CSS Utilities

### Premium Gradient Classes

#### `.gold-gradient`
```css
.gold-gradient {
  background: linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #B8860B 100%);
}
```

#### `.gold-text-gradient`
```css
.gold-text-gradient {
  background: linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #B8860B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

#### `.btn-gold`
```css
.btn-gold {
  background: linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #B8860B 100%);
  color: #000000;
  transition: all 0.3s ease;
}

.btn-gold:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}
```

## Homepage Implementation

The homepage has been redesigned to showcase the new premium branding:

### Hero Section
- **Background**: Subtle gradient from white to light gray
- **Typography**: Larger, bolder headings in black
- **CTAs**: Gold and outline-gold button variants
- **Spacing**: Increased for luxury feel

### Featured Products
- **Cards**: Enhanced with subtle borders and shadows
- **Hover effects**: Gentle lift animation with gold accents
- **Visual hierarchy**: Gold gradient section dividers

### About Section
- **Background**: Light muted background for section separation
- **Bullet points**: Gold circular indicators
- **Content**: Enhanced typography with better spacing

## Design Principles

### Visual Hierarchy
1. **Primary**: Gold for main CTAs and important accents
2. **Secondary**: Black for content and navigation
3. **Tertiary**: Gray for supporting text and subtle elements

### Accessibility Considerations
- Maintains WCAG AA contrast ratios (minimum 4.5:1)
- Gold color chosen for sufficient contrast on both light and dark backgrounds
- Focus states clearly visible with gold ring indicators

### Responsive Design
- Mobile-first approach maintained
- Gold accents scale appropriately across breakpoints
- Touch targets remain appropriately sized (minimum 44px)

## Testing

### Browser Compatibility
- Tested across modern browsers (Chrome, Firefox, Safari, Edge)
- CSS gradients work consistently
- Fallbacks provided for older browsers

### Performance
- CSS custom properties reduce bundle size
- Efficient hover transitions (GPU-accelerated)
- Optimized color calculations

## Future Enhancements

### Planned Additions
1. **Dark mode**: Inverted color scheme with gold accents
2. **Additional gold variants**: Light gold, dark gold variations
3. **Animation library**: Consistent micro-interactions
4. **Brand guidelines**: Comprehensive usage documentation

### Considerations
- Monitor user feedback on gold color accessibility
- Test with color-blind users for inclusive design
- Evaluate performance impact of complex gradients

---

## Change Log

- **2025-01-10**: Implemented black, white, and gold color scheme
- **2025-01-10**: Added premium button variants and CSS utilities
- **2025-01-10**: Updated all components to use new color system
- **2025-01-10**: Enhanced homepage with premium styling 