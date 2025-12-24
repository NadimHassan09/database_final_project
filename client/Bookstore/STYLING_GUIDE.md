# Modern Bookstore UI - Styling Guide

## Overview
The application has been upgraded with a modern, premium bookstore design using a deep red/crimson primary color scheme (#E6003D).

## Color Palette

### Primary Colors
- **Primary Red**: `#E6003D` / `#E1063C`
- **Primary Red Dark**: `#C50033` (hover states)
- **Primary Red Light**: `#FF1A5C` (optional accents)

### Background Colors
- **Main Background**: `#FFFFFF`
- **Light Sections**: `#F7F7F7` - `#FAFAFA`
- **Footer Background**: `#1A1A1A`

### Text Colors
- **Primary Text**: `#222222`
- **Secondary Text**: `#666666`
- **Muted Text**: `#999999`
- **Footer Text**: `#CCCCCC`

## Typography
- **Font Family**: System fonts (Inter/Poppins fallback)
- **Headings**: 600-700 weight
- **Body Text**: 400 weight
- **Uppercase**: Navbar items, buttons, badges

## Key Styling Features

### Buttons
- Primary buttons use red background (#E6003D)
- Uppercase text with letter spacing
- Smooth hover animations (translateY)
- Rounded corners (6-10px)

### Cards
- White background
- Rounded corners (12px)
- Soft shadows
- Hover lift effect
- Smooth transitions

### Product Cards
- Image zoom on hover
- Red price display
- Stock status badges
- Clean, minimal design

### Navigation
- Sticky header
- Red hover states
- Underline animation on hover
- Dropdown menus with shadows

### Forms
- Red focus states
- Rounded inputs
- Clear labels (uppercase)
- Smooth transitions

### Tables
- Striped rows
- Hover effects
- Clean borders
- Red accents

### Pagination
- Rounded buttons
- Red active state
- Hover animations
- Centered layout

### Footer
- Dark background (#1A1A1A)
- White headings
- Gray links
- Red hover states

## CSS Files Structure

1. **App.css** - Global styles, Bootstrap overrides, base styling
2. **Components.css** - Component-specific enhancements
3. **Footer.css** - Footer dark theme styling
4. **HeroHeader.css** - Hero section with red gradient

## Custom CSS Variables

All colors and design tokens are defined in CSS variables in `App.css`:
- `--primary-red`
- `--bg-main`, `--bg-light`
- `--text-primary`, `--text-secondary`
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- `--radius-sm`, `--radius-md`, `--radius-lg`
- `--transition`

## Usage Notes

- All styling is applied via CSS classes and Bootstrap overrides
- No JSX structure was modified
- All functionality remains unchanged
- Responsive design maintained
- Performance-optimized animations

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- CSS Variables support required

