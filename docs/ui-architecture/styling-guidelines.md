# Styling Guidelines

### Modern Tailwind CSS 4 Approach

**Primary Methodology:** Tailwind CSS 4 utility-first approach with CSS-first configuration, cascade layers, and modern CSS features like `color-mix()` and `@property` for canvas-specific interactions.

### CSS-First Configuration (No More JavaScript Config)

```css
/* src/styles/globals.css */
@import "tailwindcss";

/* CSS-first theme configuration with modern features */
@theme {
  /* Modern OKLCH color space for better color mixing */
  --color-primary: oklch(0.7 0.15 200);
  --color-secondary: oklch(0.8 0.1 250);
  --color-accent: oklch(0.6 0.2 150);
  --color-destructive: oklch(0.6 0.2 15);

  /* Canvas-specific design tokens */
  --color-canvas-bg: oklch(0.98 0.02 200);
  --color-canvas-grid: oklch(0.94 0.05 200);
  --color-canvas-selection: oklch(0.7 0.15 200);
  --color-canvas-handle: oklch(1 0 0);
  --color-canvas-guide: oklch(0.7 0.2 60);

  /* Modern CSS custom properties with @property */
  @property --animate-duration-fast {
    syntax: "<time>";
    initial-value: 150ms;
    inherits: false;
  }

  @property --animate-duration-normal {
    syntax: "<time>";
    initial-value: 200ms;
    inherits: false;
  }

  @property --animate-duration-slow {
    syntax: "<time>";
    initial-value: 300ms;
    inherits: false;
  }

  /* Canvas-specific measurements */
  --toolbar-height: 60px;
  --panel-width: 320px;
  --canvas-padding: 40px;
  --canvas-min-zoom: 0.1;
  --canvas-max-zoom: 5.0;
}

/* Modern cascade layers for better CSS organization */
@layer base {
  * {
    @apply border-border;
  }

  html {
    /* Modern font features */
    font-feature-settings: "rlig" 1, "calt" 1, "kern" 1;
    font-variant-numeric: tabular-nums;
  }

  body {
    @apply bg-background text-foreground;
    /* CSS Grid for app layout */
    display: grid;
    grid-template-rows: auto 1fr;
    min-height: 100vh;
  }

  /* Container queries for responsive components */
  .canvas-container {
    container-type: size;
    container-name: canvas;
  }
}

@layer components {
  /* Canvas-specific components with modern CSS */
  .canvas-viewport {
    @apply relative overflow-hidden bg-canvas-bg flex-1 min-h-0;
    container-type: size;
    /* Modern CSS Grid for layout */
    display: grid;
    place-items: center;
  }

  .floating-toolbar {
    @apply fixed z-50 border rounded-lg shadow-lg px-2 py-1 flex items-center gap-1;
    /* Modern backdrop filter with fallback */
    background: color-mix(in srgb, var(--color-background) 95%, transparent);
    backdrop-filter: blur(8px);
    /* Modern box shadow with color-mix */
    box-shadow:
      0 4px 6px -1px color-mix(in srgb, var(--color-foreground) 10%, transparent),
      0 2px 4px -2px color-mix(in srgb, var(--color-foreground) 5%, transparent);
  }

  /* Data-slot based styling for shadcn/ui compatibility */
  [data-slot="canvas-element"] {
    @apply absolute border-2 border-transparent cursor-pointer transition-all;
    /* Modern CSS transforms with hardware acceleration */
    transform-style: preserve-3d;
    will-change: transform;
  }

  [data-slot="canvas-element"][data-selected="true"] {
    @apply border-primary;
    /* Modern CSS with color-mix for selection glow */
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 20%, transparent);
  }

  .frame-thumbnail {
    @apply relative aspect-video border-2 border-transparent rounded-lg overflow-hidden cursor-pointer;
    /* Modern transition with CSS custom properties */
    transition:
      border-color var(--animate-duration-normal) ease-in-out,
      transform var(--animate-duration-normal) ease-in-out;
  }

  .frame-thumbnail:hover {
    /* Modern color mixing for hover states */
    border-color: color-mix(in srgb, var(--color-primary) 50%, transparent);
    transform: scale(1.02);
  }

  .frame-thumbnail[data-selected="true"] {
    @apply border-primary;
    /* Modern box shadow with OKLCH colors */
    box-shadow: 0 0 0 1px var(--color-primary);
  }
}

@layer utilities {
  /* Modern canvas utilities */
  .canvas-checkerboard {
    background-image:
      linear-gradient(45deg, color-mix(in srgb, var(--color-muted) 25%, transparent) 25%, transparent 25%),
      linear-gradient(-45deg, color-mix(in srgb, var(--color-muted) 25%, transparent) 25%, transparent 25%);
    background-size: 20px 20px;
    background-position: 0 0, 10px 10px;
  }

  .canvas-selection-outline {
    outline: 2px solid var(--color-canvas-selection);
    outline-offset: 2px;
    /* Modern CSS with animation */
    animation: selection-pulse 2s ease-in-out infinite;
  }

  @keyframes selection-pulse {
    0%, 100% { outline-opacity: 1; }
    50% { outline-opacity: 0.5; }
  }

  .smooth-transform {
    transition: transform var(--animate-duration-normal) cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
    /* Hardware acceleration */
    transform: translateZ(0);
  }

  /* Container query utilities */
  @container canvas (min-width: 800px) {
    .canvas-controls-large {
      @apply flex-row;
    }
  }

  @container canvas (max-width: 799px) {
    .canvas-controls-small {
      @apply flex-col;
    }
  }

  /* Modern focus styles */
  .focus-modern {
    @apply focus-visible:outline-none focus-visible:ring-2;
    focus-visible:ring-color: color-mix(in srgb, var(--color-primary) 80%, transparent);
    focus-visible:ring-offset: 2px;
  }

  /* Performance-optimized animations */
  .animate-canvas-fade-in {
    animation: canvas-fade-in var(--animate-duration-normal) ease-out;
  }

  @keyframes canvas-fade-in {
    from {
      opacity: 0;
      transform: translateY(4px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
}

/* Modern CSS nesting for component variants */
.button {
  @apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring;
  @apply disabled:pointer-events-none disabled:opacity-50;

  /* Modern variant system with color-mix */
  &[data-variant="default"] {
    background: var(--color-primary);
    color: var(--color-primary-foreground);

    &:hover {
      background: color-mix(in srgb, var(--color-primary) 90%, black);
    }
  }

  &[data-variant="secondary"] {
    background: var(--color-secondary);
    color: var(--color-secondary-foreground);

    &:hover {
      background: color-mix(in srgb, var(--color-secondary) 90%, black);
    }
  }

  &[data-variant="outline"] {
    @apply border border-input bg-background;

    &:hover {
      background: var(--color-accent);
    }
  }

  /* Size variants with CSS custom properties */
  &[data-size="sm"] {
    @apply h-8 px-3 text-xs;
  }

  &[data-size="md"] {
    @apply h-10 px-4 py-2;
  }

  &[data-size="lg"] {
    @apply h-11 px-8;
  }
}
```

### Modern Component Styling Patterns

```typescript
// Leverage data-slot attributes and modern CSS
const ModernButton = ({ variant = 'default', size = 'md', className, ...props }) => {
  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn('button', className)}
      {...props}
    />
  )
}

// Canvas component with modern styling
const CanvasElement = ({ element, isSelected, className }) => {
  return (
    <div
      data-slot="canvas-element"
      data-selected={isSelected}
      className={cn(
        // Base canvas element styles handled by CSS
        className
      )}
      style={{
        // CSS custom properties for dynamic values
        '--element-x': `${element.x}px`,
        '--element-y': `${element.y}px`,
        '--element-width': `${element.width}px`,
        '--element-height': `${element.height}px`,
        // Use CSS custom properties in transform
        transform: 'translate(var(--element-x), var(--element-y))',
        width: 'var(--element-width)',
        height: 'var(--element-height)'
      }}
    >
      {element.content}
    </div>
  )
}

// Responsive canvas toolbar with container queries
const CanvasToolbar = () => {
  return (
    <div className="canvas-container">
      <div className="floating-toolbar canvas-controls-large canvas-controls-small">
        {/* Toolbar content adapts based on container size */}
      </div>
    </div>
  )
}
```

### Performance-Optimized CSS

```css
/* Critical CSS loading optimization */
@layer critical {
  /* Load only essential styles first */
  .canvas-viewport,
  .floating-toolbar,
  [data-slot="canvas-element"] {
    /* Essential styles for immediate rendering */
  }
}

/* GPU acceleration for canvas operations */
.gpu-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

/* Modern CSS containment for performance */
.canvas-element-container {
  contain: layout style paint;
}

/* Efficient animation with CSS containment */
@keyframes efficient-slide {
  from { transform: translate3d(-100%, 0, 0); }
  to { transform: translate3d(0, 0, 0); }
}

.slide-animation {
  animation: efficient-slide var(--animate-duration-normal) ease-out;
  contain: layout;
}
```

### Dark Mode with Modern CSS

```css
/* Automatic dark mode with color-scheme */
:root {
  color-scheme: light dark;
}

/* Modern dark mode using color-mix */
@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: oklch(0.1 0.02 200);
    --color-foreground: oklch(0.9 0.02 200);
    --color-primary: oklch(0.7 0.15 200);

    /* Canvas dark mode colors */
    --color-canvas-bg: oklch(0.12 0.02 200);
    --color-canvas-grid: oklch(0.16 0.05 200);
  }
}

/* Manual dark mode toggle support */
[data-theme="dark"] {
  @theme {
    --color-background: oklch(0.1 0.02 200);
    --color-foreground: oklch(0.9 0.02 200);
    /* ... other dark colors */
  }
}
```

### Accessibility-First Styling

```css
/* Modern focus management */
@layer a11y {
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .button {
      border: 2px solid currentColor;
    }

    .canvas-selection-outline {
      outline-width: 3px;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Focus-visible for keyboard navigation */
  .focus-ring {
    @apply focus-visible:outline-none;

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  }
}
```

### Best Practices Summary

1. **Use CSS-first configuration** - No more `tailwind.config.js`, everything in CSS
2. **Leverage cascade layers** - Organize styles with `@layer` for better specificity control
3. **Modern CSS features** - Use `color-mix()`, `@property`, container queries
4. **Data-slot attributes** - Better component styling with shadcn/ui patterns
5. **Performance optimization** - CSS containment, GPU acceleration, efficient animations
6. **Accessibility-first** - Support for high contrast, reduced motion, keyboard navigation
7. **Modern color spaces** - OKLCH for better color mixing and consistency