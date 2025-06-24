# Header Component Documentation

**Created Date:** 2025-01-23  
**Last Modified Date:** 2025-01-23  
**Last Modified Summary:** Updated social media integration and fixed async/await error in client component

## Overview

The Header component provides the main navigation interface for the FitFoot application, featuring a responsive design with desktop and mobile layouts, authentication integration, and social media links.

## Features

### Desktop Navigation
- **Logo**: Large-sized brand logo with text
- **Navigation Menu**: Home, About (with dropdown), Shop
- **Social Media Icons**: Facebook, Instagram, LinkedIn, TikTok, X (formerly Twitter), YouTube
- **User Actions**: Shopping cart, authentication buttons, CTA button

### Mobile Navigation
- **Hamburger Menu**: Collapsible side panel
- **Search Bar**: Product search functionality
- **Full Navigation**: All desktop links with icons
- **Social Media Section**: Social media icons at bottom of menu
- **User Profile**: Authentication state with profile display

## Recent Updates

### Logo Enhancement
- Changed logo size from `md` to `lg` for better visibility
- Maintains responsive design across all screen sizes

### Social Media Integration
- **Desktop**: Added social media icons next to navigation links
- **Mobile**: Added "Follow Us" section at bottom of mobile menu
- **Platforms**: Facebook, Instagram, LinkedIn, TikTok, X (formerly Twitter), YouTube
- **Styling**: Hover effects with platform-specific colors
- **Links**: Point to FitFoot social media accounts

### Technical Fixes
- Fixed async/await error by properly separating client and server components
- Moved `getSiteSettings` import to server component only
- Maintained clean separation between interactive UI and data fetching

## Component Architecture

### Client Component (`HeaderClient`)
```typescript
export function HeaderClient({ siteSettings }: HeaderProps) {
  // All interactive functionality:
  // - Mobile menu state
  // - Authentication UI
  // - Cart display
  // - User interactions
}
```

### Server Component (`Header`)
```typescript
export async function Header() {
  // Data fetching only:
  const { getSiteSettings } = await import('@/lib/sanity.queries')
  const siteSettings = await getSiteSettings()
  return <HeaderClient siteSettings={siteSettings} />
}
```

## Social Media Configuration

### Platform Links
- **Facebook**: `https://facebook.com/fitfoot`
- **Instagram**: `https://instagram.com/fitfoot`
- **LinkedIn**: `https://linkedin.com/company/fitfoot`
- **TikTok**: `https://tiktok.com/@fitfoot`
- **X (Twitter)**: `https://x.com/fitfoot`
- **YouTube**: `https://youtube.com/fitfoot`

### Icon Styling
```typescript
// Desktop icons
className="h-4 w-4"

// Mobile icons  
className="h-5 w-5"

// Platform-specific hover colors
Facebook: hover:text-blue-600
Instagram: hover:text-pink-600
LinkedIn: hover:text-blue-700
TikTok: hover:text-black
X: hover:text-black
YouTube: hover:text-red-600
```

## Usage

### Basic Implementation
```typescript
import { Header } from '@/components/layout/header'

export default function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
```

### With Custom Site Settings
The Header automatically fetches site settings from Sanity and passes them to the client component for logo text, navigation links, and CTA configuration.

## Responsive Design

### Desktop (md+)
- Full horizontal navigation with social media icons
- Logo with text display
- Inline authentication buttons
- Dropdown menus for complex navigation

### Mobile (<md)
- Hamburger menu with slide-out panel
- Social media icons at bottom of menu
- Touch-friendly interaction targets
- Optimized for one-handed use

## Authentication Integration

### Guest Users
```typescript
<div className="flex items-center space-x-2">
  <Link href="/auth/login">
    <Button variant="ghost" size="sm">Login</Button>
  </Link>
  <Link href="/auth/register">
    <Button variant="ghost" size="sm">Sign Up</Button>
  </Link>
</div>
```

### Authenticated Users
```typescript
{isLoggedIn && user ? (
  <UserDropdown />
) : (
  // Guest buttons
)}
```

## Accessibility Features

- **ARIA Labels**: All interactive elements properly labeled
- **Keyboard Navigation**: Full keyboard support for menu navigation
- **Screen Reader**: Semantic HTML structure with proper heading hierarchy
- **Focus Management**: Visible focus indicators and logical tab order
- **Mobile Touch**: Proper touch targets (minimum 48px)

## Performance Considerations

- **Logo Loading**: Uses Next.js Image optimization with priority loading
- **Mobile Menu**: Prevents body scroll when open to improve UX
- **Social Icons**: Inline SVG for fast loading without additional requests
- **State Management**: Efficient re-rendering with proper React patterns

## Error Handling

### Client/Server Separation
The component properly separates concerns:
- **Server**: Data fetching with proper async/await
- **Client**: Interactive functionality without async operations
- **Error Boundaries**: Graceful fallbacks for missing data

### Hydration Safety
```typescript
const renderAuthSection = () => {
  if (!hydrated) {
    return <LoadingSkeleton />
  }
  // Render actual auth UI
}
```

## Customization

### Logo Configuration
```typescript
<Logo 
  variant="header" 
  size="lg"        // sm, md, lg
  showText={true}
  text={siteSettings?.logo?.text || 'Fitfoot'}
/>
```

### Social Media Links
To update social media URLs, modify the component directly or consider moving to a configuration file:

```typescript
const socialLinks = {
  facebook: "https://facebook.com/fitfoot",
  instagram: "https://instagram.com/fitfoot",
  linkedin: "https://linkedin.com/company/fitfoot",
  tiktok: "https://tiktok.com/@fitfoot",
  x: "https://x.com/fitfoot",
  youtube: "https://youtube.com/fitfoot"
}
```

## Related Components

- **[Logo](./ui/logo.md)**: Brand logo component with multiple variants
- **[Button](./ui/button.md)**: Interactive button components
- **[UserDropdown](./auth/user-dropdown.md)**: User authentication dropdown
- **[NavigationLinks](./navigation-links.md)**: Navigation configuration

## Testing Considerations

### Manual Testing Checklist
- [ ] Logo displays correctly at all screen sizes
- [ ] Mobile menu opens and closes properly
- [ ] Social media links open in new tabs
- [ ] Authentication flows work correctly
- [ ] Responsive design works across breakpoints
- [ ] Keyboard navigation functions properly

### Automated Testing
```typescript
describe('Header Component', () => {
  it('renders logo with correct size', () => {
    // Test logo rendering
  })

  it('opens mobile menu on button click', () => {
    // Test mobile menu functionality
  })

  it('displays social media links', () => {
    // Test social media integration
  })
})
```

## Future Enhancements

### Planned Features
- **Search Integration**: Global search functionality
- **Cart Preview**: Hover preview of cart contents
- **Notification Center**: User notifications and alerts
- **Multi-language**: Language switcher for international users

### Analytics Integration
Consider adding tracking for:
- Social media click-through rates
- Navigation pattern analysis
- Mobile vs desktop usage patterns
- Authentication conversion rates

---

## Document History

| Date | Change | Summary |
|------|---------|---------|
| 2025-01-23 | Initial creation | Complete header documentation |
| 2025-01-23 | Logo size update | Changed from md to lg |
| 2025-01-23 | Social media integration | Added 6 social platforms |
| 2025-01-23 | Technical fix | Resolved async/await error |

---

**💡 The Header component is a critical piece of the user experience. Any changes should be tested thoroughly across all devices and screen sizes.** 