# Epic 4: Text Overlays & Annotations

## Epic Goal
Enable users to add informative and stylistic text elements to their mockups using Next.js 15 SSG optimization. This includes titles, descriptions, annotations, and watermarks with full typography control and positioning flexibility, all optimized for sub-1s loading performance.

## Epic Description

### Purpose
This epic completes the core mockup creation toolkit by adding comprehensive text capabilities optimized for Next.js 15 architecture. Users can annotate their screenshots, add titles and descriptions, create watermarks, and provide context that transforms basic images into professional presentations and documentation, all with SSG performance benefits.

### Business Value
- Enables complete mockup creation workflow without external tools
- Supports documentation and presentation use cases for developer and marketing personas
- Provides foundation for branding and watermarking features
- Increases user engagement through creative text styling capabilities
- Leverages Next.js 15 SSG for instant font loading and smooth text operations

### Technical Implementation
- Multi-layer text system with independent positioning and styling using Next.js client optimization
- Comprehensive typography controls matching professional design tools
- Intelligent text positioning with guides and snapping via Next.js client-side processing
- Template system for reusable text styles and layouts served via SSG
- Font loading optimized through Next.js font optimization system

## User Stories

### Story 4.1: Text Tool Foundation
**Goal:** Provide basic text addition and editing capabilities with Next.js client optimization
**Effort:** 8 story points
**Dependencies:** Epic 3 (Background system for visual context)

**Acceptance Criteria:**
1. Add text button creates new text layer with default content
2. Click on canvas places text at that location using Next.js client-side processing
3. Text editing mode activates on double-click or selection
4. Support for multiple independent text layers
5. Text bounding box shows during selection with resize handles
6. Escape key or clicking outside exits text editing mode
7. Delete key removes selected text layer with confirmation
8. Text operations optimized for Next.js client performance patterns

### Story 4.2: Typography Controls
**Goal:** Provide comprehensive text styling capabilities with Next.js font optimization
**Effort:** 13 story points
**Dependencies:** Story 4.1

**Acceptance Criteria:**
1. Font selection from minimum 10 web fonts using Next.js font optimization (sans-serif and serif options)
2. Size adjustment via slider (8px-200px) or direct input
3. Color picker with opacity control for text
4. Bold, italic, underline formatting toggles
5. Text alignment options (left, center, right, justify)
6. Line height and letter spacing adjustments
7. Text shadow option with offset and blur controls
8. Fonts pre-loaded via Next.js SSG for instant availability

### Story 4.3: Text Positioning & Layering
**Goal:** Enable precise text placement and organization with Next.js client optimization
**Effort:** 8 story points
**Dependencies:** Story 4.2

**Acceptance Criteria:**
1. Drag to move text anywhere on canvas using Next.js client-side processing
2. Smart guides show alignment with other elements
3. Keyboard arrow keys allow pixel-precise positioning
4. Layer order controls (bring forward, send back, etc.)
5. Rotation handle allows text angle adjustment
6. Snap-to-grid option for consistent alignment
7. Position coordinates display with manual input option
8. Positioning operations optimized for 60fps performance with Next.js

### Story 4.4: Text Presets & Templates
**Goal:** Streamline text styling with reusable presets via Next.js SSG
**Effort:** 8 story points
**Dependencies:** Story 4.3

**Acceptance Criteria:**
1. Save current text style as reusable preset with localStorage persistence
2. Pre-built presets for common uses (title, subtitle, watermark, caption) served via SSG
3. Apply preset to existing or new text layers
4. Text templates include positioned multi-layer text groups
5. Custom preset management with naming and deletion
6. Import/export presets for team sharing (JSON format)
7. Preview shows preset style before application
8. Presets and templates cached via Next.js static optimization for instant access

## Technical Architecture

### Next.js 15 Component Structure
```
components/text-tools/
├── text-editor.tsx             # Main text editing interface with Next.js optimization
├── text-layer.tsx              # Individual text layer component
├── typography-controls.tsx     # Font, size, style controls with Next.js font system
├── text-positioning.tsx        # Position and alignment tools
├── text-color-picker.tsx       # Color and opacity controls
├── text-effects-panel.tsx      # Shadow, outline, effects
├── text-presets.tsx           # Preset management interface with SSG data
└── text-templates.tsx         # Multi-layer text templates via SSG

lib/text/
├── text-renderer.ts           # Canvas text rendering optimized for Next.js
├── font-loader.ts             # Web font management using Next.js font system
├── text-metrics.ts            # Text measurement utilities
└── text-positioning.ts       # Positioning and alignment logic
```

### State Management Extensions (Zustand + Next.js)
```typescript
interface TextState {
  // Text layers
  textLayers: TextLayer[]
  selectedLayerId: string | null
  isEditing: boolean
  editingLayerId: string | null

  // Text tools
  currentTool: 'select' | 'text' | 'edit'
  textCursor: { x: number; y: number } | null

  // Typography settings
  activeFont: string
  activeFontSize: number
  activeColor: string
  activeStyle: TextStyle

  // Positioning
  snapToGrid: boolean
  showGuides: boolean
  gridSize: number

  // Presets and templates (Next.js SSG optimized)
  textPresets: TextPreset[]
  textTemplates: TextTemplate[]
  nextjsFontCache: Map<string, any>
  presetCache: Map<string, TextPreset>
}

interface TextLayer {
  id: string
  content: string
  position: { x: number; y: number }
  rotation: number
  zIndex: number

  // Typography (Next.js font optimized)
  fontFamily: string
  fontSize: number
  fontWeight: number
  fontStyle: 'normal' | 'italic'
  textDecoration: 'none' | 'underline' | 'line-through'
  textAlign: 'left' | 'center' | 'right' | 'justify'
  lineHeight: number
  letterSpacing: number

  // Styling
  color: string
  opacity: number
  shadow: TextShadow | null
  outline: TextOutline | null

  // Layout
  width: number | 'auto'
  height: number | 'auto'
  padding: number
}

interface TextStyle {
  fontFamily: string
  fontSize: number
  fontWeight: number
  fontStyle: 'normal' | 'italic'
  color: string
  textAlign: 'left' | 'center' | 'right' | 'justify'
  lineHeight: number
  letterSpacing: number
  shadow: TextShadow | null
}

interface TextPreset {
  id: string
  name: string
  style: TextStyle
  category: 'title' | 'subtitle' | 'body' | 'caption' | 'watermark' | 'custom'
  thumbnail: string
  nextjsThumbnail: string // Optimized for Next.js Image
}
```

### Next.js 15 Font Management System
```typescript
// Font loading with Next.js font optimization
import { Inter, Roboto, Playfair_Display } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weights: ['400', '500', '600', '700'],
  variable: '--font-inter'
})

const roboto = Roboto({
  subsets: ['latin'],
  weights: ['300', '400', '500', '700'],
  variable: '--font-roboto'
})

interface FontConfig {
  family: string
  weights: number[]
  styles: ('normal' | 'italic')[]
  source: 'google' | 'system' | 'custom'
  displayName: string
  category: 'sans-serif' | 'serif' | 'monospace' | 'display'
  nextjsFont: any // Next.js font object
}

const DEFAULT_FONTS: FontConfig[] = [
  {
    family: 'Inter',
    weights: [400, 500, 600, 700],
    styles: ['normal', 'italic'],
    source: 'google',
    displayName: 'Inter',
    category: 'sans-serif',
    nextjsFont: inter
  },
  {
    family: 'Roboto',
    weights: [300, 400, 500, 700],
    styles: ['normal', 'italic'],
    source: 'google',
    displayName: 'Roboto',
    category: 'sans-serif',
    nextjsFont: roboto
  },
  // ... additional fonts
]

// SSG data loading for text presets
export async function getStaticProps() {
  const textPresets = await loadTextPresets()
  const textTemplates = await loadTextTemplates()

  return {
    props: {
      textPresets,
      textTemplates
    },
    revalidate: false // Static presets don't change
  }
}
```

## Definition of Done

### Functional Requirements
- [ ] All user stories completed with acceptance criteria met
- [ ] Multi-layer text system supports unlimited text elements with Next.js optimization
- [ ] Typography controls provide professional-level customization
- [ ] Text positioning system enables pixel-perfect placement
- [ ] Preset system streamlines common text styling workflows
- [ ] Next.js SSG delivers instant font and preset loading

### Performance Requirements
- [ ] Text rendering maintains 60fps during editing and manipulation with Next.js optimization
- [ ] Font loading completes within 2 seconds via Next.js font optimization
- [ ] Text layer operations (add, edit, delete) complete within 100ms
- [ ] Complex text layouts with 10+ layers perform smoothly
- [ ] SSG pre-loading eliminates font loading delays

### Quality Requirements
- [ ] Text rendering quality matches professional design tools
- [ ] Font rendering consistent across all supported browsers via Next.js font system
- [ ] Text selection and editing UX intuitive for non-designers
- [ ] Accessibility support for screen readers and keyboard navigation
- [ ] Next.js font optimization handles web font loading automatically

### Typography Standards
- [ ] Minimum 10 high-quality web fonts available via Next.js font optimization
- [ ] Text contrast ratios meet WCAG AA standards by default
- [ ] Font loading gracefully handles network failures via Next.js fallbacks
- [ ] Text export maintains typography fidelity
- [ ] SSG optimization ensures instant font availability

## Success Metrics

### Feature Adoption
- **Target:** 60% of users who create mockups add text elements
- **Measurement:** Analytics tracking text tool usage and layer creation

### User Engagement
- **Target:** Users with text layers show 30% higher session duration
- **Measurement:** Session analytics comparing text vs. non-text usage

### Creative Usage
- **Target:** 25% of users create custom text presets
- **Measurement:** Tracking preset creation and usage patterns

### Quality Metrics (Next.js 15 Optimized)
- **Target:** <3% of text operations result in rendering errors
- **Measurement:** Error tracking and user feedback on text quality
- **Next.js Target:** Fonts load instantly via SSG optimization

## Risk Assessment

### Primary Risk: Font Loading and Performance
**Mitigation:**
- Progressive font loading with system font fallbacks via Next.js font system
- Font caching and local storage optimization using Next.js optimization
- Performance monitoring for font-related slowdowns
- SSG pre-loading eliminates runtime font loading issues

### Secondary Risk: Text Rendering Consistency
**Mitigation:**
- Standardized text rendering pipeline across browsers using Next.js patterns
- Comprehensive testing on different operating systems
- Fallback fonts for unsupported characters via Next.js font system
- Next.js font optimization ensures consistent rendering

### Tertiary Risk: Complex Typography Overwhelming Users
**Mitigation:**
- Progressive disclosure of advanced typography options
- Smart defaults that produce good results without adjustment
- Clear preset categories for common use cases via SSG organization

### Rollback Plan
- Feature flags for individual text components
- Fallback to basic text input if advanced features fail
- Preset library versioning for quick rollback
- Next.js static regeneration for font and preset updates

## Integration Points

### Upstream Dependencies
- Epic 1: Canvas system for text rendering and positioning with Next.js optimization
- Epic 2: Frame system for text layering above frames
- Epic 3: Background system for text contrast considerations

### Downstream Dependencies
- Epic 5: Export system will include text data in output
- Epic 6: AI Integration will provide smart text suggestions via API routes

### Next.js 15 Integration Points
- **Font Optimization:** Automatic web font loading and optimization
- **SSG Optimization:** Text presets and templates pre-loaded for instant access
- **Bundle Optimization:** Text tool code split for optimal loading
- **Static Generation:** Font and preset libraries generate at build time
- **Client Optimization:** Real-time text rendering optimized for Next.js patterns

### External Integrations
- Next.js font system for Google Fonts optimization
- Canvas API for text rendering and measurement
- File system API for preset import/export
- Next.js Analytics for text tool usage tracking

## Text Preset Categories

### Default Presets (Next.js SSG Optimized)
```typescript
const DEFAULT_TEXT_PRESETS: TextPreset[] = [
  {
    id: 'heading-large',
    name: 'Large Heading',
    category: 'title',
    nextjsThumbnail: '/presets/heading-large.webp',
    style: {
      fontFamily: 'Inter',
      fontSize: 48,
      fontWeight: 700,
      color: '#1F2937',
      textAlign: 'center',
      lineHeight: 1.2,
      letterSpacing: -0.02
    }
  },
  {
    id: 'subtitle-modern',
    name: 'Modern Subtitle',
    category: 'subtitle',
    nextjsThumbnail: '/presets/subtitle-modern.webp',
    style: {
      fontFamily: 'Inter',
      fontSize: 24,
      fontWeight: 500,
      color: '#6B7280',
      textAlign: 'center',
      lineHeight: 1.4,
      letterSpacing: 0
    }
  },
  {
    id: 'watermark-subtle',
    name: 'Subtle Watermark',
    category: 'watermark',
    nextjsThumbnail: '/presets/watermark-subtle.webp',
    style: {
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: 400,
      color: '#9CA3AF',
      textAlign: 'right',
      opacity: 0.6,
      letterSpacing: 0.02
    }
  }
  // ... additional presets
]
```

### Template System (Next.js SSG)
```typescript
interface TextTemplate {
  id: string
  name: string
  description: string
  category: string
  layers: TextTemplateLayer[]
  canvasSize: { width: number; height: number }
  thumbnail: string
  nextjsThumbnail: string // Optimized for Next.js Image
}

interface TextTemplateLayer {
  content: string
  position: { x: number; y: number }
  style: TextStyle
  role: 'title' | 'subtitle' | 'body' | 'caption' | 'decoration'
}
```

## Accessibility Considerations

### Screen Reader Support
- Text layers announced with content and styling information
- Layer order communicated clearly for navigation
- Keyboard shortcuts for common text operations

### Visual Accessibility
- High contrast mode support for text editing interface
- Color picker includes accessibility indicators
- Text contrast warnings for poor readability combinations

### Motor Accessibility
- Large click targets for text manipulation handles
- Keyboard alternatives for all mouse-based operations
- Customizable keyboard shortcuts for frequent actions

## Future Enhancements (Out of Scope)

### Advanced Typography
- Custom font upload capabilities
- Advanced text effects (gradients, patterns)
- Variable font support for dynamic styling
- Text along path/curve functionality

### AI-Powered Features (Next.js API Routes)
- Smart text suggestions based on image content via API routes
- Automatic font pairing recommendations using AI
- Content-aware text positioning via AI services
- Style transfer from reference images using AI integration

### Collaboration Features
- Real-time collaborative text editing
- Comment system for text feedback
- Version history for text changes
- Team text style libraries

---

**Epic Owner:** Winston (Architect)
**Technical Lead:** Development Team
**Business Stakeholder:** Product Manager
**Timeline:** Sprint 7-8 (4 weeks)
**Priority:** P2 - Enhancement feature
**Next.js 15 Migration:** Complete architecture update for SSG optimization