# Epic 2: Frame System & Application

## Epic Goal

Deliver the core frame functionality that transforms plain screenshots into professional mockups using Next.js 15 SSG optimization. Users will be able to select from various device and browser frames, apply them to their images, and customize frame properties for their specific needs.

## Epic Description

### Purpose

This epic implements the primary value-add feature of Scroma - the ability to apply professional frames to screenshots. It provides a comprehensive frame library, intelligent application logic, and customization options that enable users to create polished mockups without design expertise, all optimized for Next.js 15 SSG performance.

### Business Value

- Delivers core differentiating feature that justifies user adoption over basic image editors
- Provides immediate visual enhancement that demonstrates tool value within first use
- Establishes foundation for template system and brand customization features
- Supports goal of creating professional mockups in under 2 minutes
- Leverages Next.js 15 SSG for instant frame loading and smooth interactions

### Technical Implementation

- Frame library with SVG and PNG assets optimized for Next.js image optimization
- Intelligent frame application with automatic image scaling and positioning
- Real-time preview system with 60fps performance using Next.js client-side optimization
- Customization interface integrated with Zustand state management
- Next.js static asset optimization for instant frame loading via SSG

## User Stories

### Story 2.1: Frame Library Component

**Goal:** Provide intuitive interface for browsing and selecting frames with Next.js SSG performance
**Effort:** 8 story points
**Dependencies:** Epic 1 (Canvas Display System)

**Acceptance Criteria:**

1. Frame selector panel displays grid of frame thumbnails with labels using Next.js optimized images
2. Minimum 10 frames available (Chrome, Safari, generic browser, iPhone, Android, tablet, window, custom borders)
3. Frame preview on hover shows larger view with example using Next.js Image component
4. Search/filter functionality allows finding frames by type or name with client-side filtering
5. Selected frame highlighted with clear visual indicator
6. Frame categories (Browser, Mobile, Desktop, Custom) for organization
7. Smooth animation when opening/closing frame selector panel using Next.js client optimization
8. Frame assets pre-loaded via Next.js SSG for instant display

### Story 2.2: Frame Application Logic

**Goal:** Apply frames to screenshots with proper scaling and positioning using Next.js performance optimization
**Effort:** 13 story points
**Dependencies:** Story 2.1

**Acceptance Criteria:**

1. Selected frame applies immediately to canvas with real-time preview
2. Image automatically scales to fit within frame boundaries using Next.js client-side processing
3. Aspect ratio preserved with letterboxing/pillarboxing if needed
4. Frame renders at correct resolution relative to image
5. Multi-layer rendering keeps frame above image but below text overlays
6. Frame change maintains image position and zoom level
7. Remove frame option returns to plain image view
8. Frame operations optimized for Next.js client-side performance

### Story 2.3: Frame Customization Controls

**Goal:** Enable frame property customization for brand matching with Next.js state management
**Effort:** 8 story points
**Dependencies:** Story 2.2

**Acceptance Criteria:**

1. Color customization available for applicable frames (borders, browser chrome)
2. Frame opacity adjustment with slider (50-100% range)
3. Shadow toggle adds/removes drop shadow from frame
4. Padding adjustment controls space between image and frame (0-100px)
5. Corner radius adjustment for custom border frames (0-50px)
6. Settings persist when switching between similar frame types using Zustand with localStorage
7. Reset button returns frame to default settings
8. Customization state managed with Next.js client-side optimization patterns

### Story 2.4: Frame Rendering Optimization

**Goal:** Ensure optimal performance for frame operations with Next.js 15 architecture
**Effort:** 5 story points
**Dependencies:** Story 2.3

**Acceptance Criteria:**

1. Frames load asynchronously without blocking UI interaction using Next.js lazy loading
2. Frame assets cached after first load for instant switching via Next.js caching
3. SVG frames scale without quality loss at any zoom level
4. Rendering uses requestAnimationFrame for smooth updates with Next.js optimization
5. Memory-efficient frame swapping without leaks
6. Performance maintains 60fps during frame changes
7. Fallback to simple frames if performance degrades
8. Next.js bundle optimization ensures minimal frame code splitting

## Technical Architecture

### Frame Asset Structure

```
public/frames/
├── browser/
│   ├── chrome-light.svg
│   ├── chrome-dark.svg
│   ├── safari-light.svg
│   ├── safari-dark.svg
│   └── generic-browser.svg
├── mobile/
│   ├── iphone-15-pro.svg
│   ├── android-pixel.svg
│   ├── ipad-pro.svg
│   └── tablet-generic.svg
├── desktop/
│   ├── macbook-pro.svg
│   ├── windows-laptop.svg
│   └── monitor-generic.svg
└── custom/
    ├── rounded-border.svg
    ├── shadow-card.svg
    └── minimal-outline.svg
```

### Next.js 15 Component Architecture

```
components/frame-library/
├── frame-grid.tsx              # Main frame selection grid with Next.js Image optimization
├── frame-preview.tsx           # Individual frame thumbnails using next/image
├── frame-properties.tsx        # Customization controls with Next.js client state
├── frame-category-filter.tsx   # Category filtering with Next.js client optimization
└── frame-search.tsx           # Frame search functionality

lib/canvas/
├── frame-applier.ts           # Frame application logic optimized for Next.js
├── frame-renderer.ts          # Canvas rendering for frames with Next.js performance
└── frame-utils.ts            # Frame manipulation utilities
```

### State Management Extensions (Zustand + Next.js)

```typescript
interface FrameState {
  // Frame library
  availableFrames: Frame[];
  frameCategories: FrameCategory[];
  selectedCategory: string | null;
  searchQuery: string;

  // Active frame
  activeFrame: FrameConfig | null;
  frameProperties: FrameProperties;
  isApplyingFrame: boolean;

  // Performance (Next.js optimized)
  frameCache: Map<string, HTMLImageElement>;
  renderQueue: FrameRenderTask[];
  nextjsImageRefs: Map<string, any>;
}

interface FrameConfig {
  id: string;
  name: string;
  type: "browser" | "mobile" | "desktop" | "custom";
  assetPath: string;
  nextjsImageSrc: string; // Next.js Image component source
  defaultProperties: FrameProperties;
  customizableProperties: string[];
}

interface FrameProperties {
  color: string;
  opacity: number;
  shadow: boolean;
  padding: number;
  cornerRadius: number;
}
```

### Next.js 15 Performance Optimizations

```typescript
// Frame loading with Next.js SSG
export async function getStaticProps() {
  const frames = await loadFrameManifest();
  return {
    props: { frames },
    revalidate: false, // Static frames don't change
  };
}

// Frame component with Next.js Image optimization
import Image from "next/image";

export function FramePreview({ frame }: { frame: FrameConfig }) {
  return (
    <Image
      src={frame.nextjsImageSrc}
      alt={frame.name}
      width={200}
      height={150}
      priority={frame.type === "browser"} // Prioritize common frames
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/..."
    />
  );
}
```

## Definition of Done

### Functional Requirements

- [ ] All user stories completed with acceptance criteria met
- [ ] Frame library contains minimum 10 high-quality frames optimized for Next.js
- [ ] Frame application works across all supported image formats
- [ ] Customization options function without performance degradation
- [ ] Frame switching maintains canvas state and user interactions
- [ ] Next.js SSG optimization delivers instant frame loading

### Performance Requirements

- [ ] Frame selection and application completes within 500ms
- [ ] Canvas maintains 60fps during frame operations with Next.js optimization
- [ ] Memory usage remains under 100MB for frame operations
- [ ] Frame assets load and cache efficiently via Next.js static optimization
- [ ] SSG pre-loading eliminates frame loading delays

### Quality Requirements

- [ ] Frames render consistently across all supported browsers
- [ ] High-resolution frames maintain quality at all zoom levels
- [ ] Frame customizations preview in real-time without lag
- [ ] Error handling for missing or corrupted frame assets
- [ ] Next.js Image component handles frame asset optimization automatically

### User Experience Requirements

- [ ] Frame discovery and selection intuitive for new users
- [ ] Frame application provides immediate visual feedback via Next.js client optimization
- [ ] Customization controls are discoverable and easy to use
- [ ] Frame removal restores original image state perfectly
- [ ] SSG optimization ensures sub-1s frame panel loading

## Success Metrics

### Feature Adoption

- **Target:** 85% of users who upload images try frame application
- **Measurement:** Analytics tracking frame panel opens and frame applications

### User Satisfaction

- **Target:** 90% of users successfully apply their first frame within 30 seconds
- **Measurement:** User testing and interaction timing analysis

### Technical Performance (Next.js 15 Optimized)

- **Target:** Frame operations maintain 60fps canvas performance
- **Measurement:** Performance monitoring and frame timing metrics
- **Next.js Target:** Frame assets load instantly via SSG pre-loading

### Quality Metrics

- **Target:** <2% of frame applications result in visual artifacts or errors
- **Measurement:** Error tracking and user feedback on frame quality

## Risk Assessment

### Primary Risk: Frame Quality and Consistency

**Mitigation:**

- Standardized frame creation process with quality guidelines
- Automated testing for frame rendering across browsers
- Fallback frames for loading failures
- Next.js Image optimization handles format compatibility automatically

### Secondary Risk: Performance Impact on Canvas

**Mitigation:**

- Efficient frame caching and memory management with Next.js optimization
- Progressive loading of frame assets via Next.js static optimization
- Performance monitoring with automatic degradation
- SSG pre-loading eliminates runtime performance impact

### Rollback Plan

- Feature flags for quick disable of frame functionality
- Graceful fallback to image-only display
- Frame library versioning for quick asset rollback
- Next.js static regeneration for frame asset updates

## Integration Points

### Upstream Dependencies

- Epic 1: Canvas display system for frame rendering with Next.js optimization
- Epic 1: State management foundation for frame state using Zustand
- Epic 1: File upload system for image processing

### Downstream Dependencies

- Epic 3: Background system will complement frame styling
- Epic 4: Text overlays will layer above frames
- Epic 5: Export system will include frame data in output
- Epic 6: AI Integration will provide smart frame suggestions via API routes

### Next.js 15 Integration Points

- **SSG Optimization:** Frame assets pre-loaded for instant access
- **Image Optimization:** Automatic frame format conversion and sizing
- **Bundle Optimization:** Frame code split for optimal loading
- **API Routes:** Future frame analytics and usage tracking
- **Static Generation:** Frame library generates at build time for maximum performance

### External Integrations

- Frame asset pipeline for adding new frames
- Design system integration for consistent frame styling
- Performance monitoring for frame operation metrics
- Next.js Analytics for frame usage tracking

---

**Epic Owner:** Winston (Architect)
**Technical Lead:** Development Team
**Business Stakeholder:** Product Manager
**Timeline:** Sprint 3-4 (4 weeks)
**Priority:** P1 - Core user value delivery
**Next.js 15 Migration:** Complete architecture update for SSG optimization
