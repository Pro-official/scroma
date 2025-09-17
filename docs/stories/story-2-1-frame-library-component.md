# Story 2.1: Frame Library Component

## Story Overview

**Epic:** Epic 2 - Frame System & Application
**Story ID:** 2.1
**Priority:** High
**Status:** Ready for Development
**Estimated Effort:** 8 Story Points
**Sprint Assignment:** Sprint 3
**Dependencies:** Epic 1 (Canvas Display System)

## User Story

**As a** user,
**I want to** browse and select from available frames,
**So that I can** choose the perfect frame for my screenshot.

## Business Value

- Provides immediate visual enhancement that demonstrates Scroma's core value proposition with Next.js SSG performance
- Enables frame discovery and selection workflow that differentiates from basic image editors using Next.js optimization
- Establishes foundation for frame customization and template features leveraging Next.js App Router
- Supports goal of professional mockup creation in under 2 minutes with Next.js static generation benefits

## Acceptance Criteria

### Frame Display Interface
1. **Frame Grid Layout**
   - Frame selector panel displays organized grid of frame thumbnails with clear labels using Next.js Image optimization
   - Grid layout responsive and adapts to panel width with consistent spacing optimized for Next.js
   - Frame thumbnails maintain consistent aspect ratio for visual alignment with Next.js Image component
   - Loading states shown while frame assets are being fetched with Next.js SSG benefits

2. **Frame Collection**
   - Minimum 10 high-quality frames available at launch using Next.js static asset optimization
   - Frame categories include: Chrome browser, Safari browser, generic browser, iPhone, Android phone, tablet, desktop window, custom borders
   - Each frame includes preview thumbnail, name, and category information optimized for Next.js
   - Frame assets optimized for fast loading and high-quality rendering with Next.js Image optimization

3. **Frame Preview System**
   - Hover over frame thumbnail shows larger preview with current screenshot example in Next.js client component
   - Preview shows how frame will look with user's uploaded image using Next.js patterns
   - Preview appears without layout shift using overlay or dedicated preview area optimized for Next.js
   - Preview includes frame name and brief description with Next.js optimization

### Frame Organization
4. **Category Filtering**
   - Frame categories clearly organized (Browser, Mobile, Desktop, Custom) using Next.js client components
   - Category filter buttons allow quick filtering of frame collection with Next.js state management
   - Visual indicators show active category with clear selection state in Next.js components
   - "All Frames" option shows complete collection with Next.js optimization

5. **Search Functionality**
   - Search input allows finding frames by name, category, or keywords in Next.js client component
   - Search results update in real-time as user types using Next.js patterns
   - Search supports partial matches and common synonyms (e.g., "phone" matches "iPhone") with Next.js optimization
   - Clear search button to reset to full frame collection in Next.js component

6. **Frame Selection**
   - Selected frame highlighted with clear visual indicator (border, background, checkmark) in Next.js component
   - Only one frame can be selected at a time with automatic deselection using Next.js state
   - Frame selection persists when switching between interface panels with Next.js client-side state
   - Keyboard navigation supports frame selection with arrow keys and Enter in Next.js components

### Panel Behavior
7. **Panel Animation**
   - Smooth slide-in animation when opening frame selector panel (300ms ease-out) using Next.js CSS-in-JS
   - Panel can be opened via button click or keyboard shortcut (F key) in Next.js client component
   - Panel closes with Escape key or click outside panel area with Next.js event handling
   - Panel state remembered across user sessions using Next.js client-side persistence

## Technical Implementation

### Component Architecture
```
components/frame-library/
├── frame-library-panel.tsx     # Main frame selection panel (Next.js client component)
├── frame-grid.tsx              # Grid layout for frame thumbnails (Next.js client component)
├── frame-thumbnail.tsx         # Individual frame preview component (Next.js client component)
├── frame-preview-overlay.tsx   # Hover preview display (Next.js client component)
├── frame-category-filter.tsx   # Category filtering controls (Next.js client component)
├── frame-search.tsx           # Search input and logic (Next.js client component)
└── frame-loading-skeleton.tsx  # Loading state components (Next.js client component)
```

### Frame Data Structure
```typescript
interface Frame {
  id: string
  name: string
  displayName: string
  category: FrameCategory
  type: 'browser' | 'mobile' | 'desktop' | 'custom'

  // Asset information optimized for Next.js
  thumbnailUrl: string
  assetUrl: string
  previewUrl: string

  // Frame properties for Next.js optimization
  dimensions: {
    width: number
    height: number
    contentArea: {
      x: number
      y: number
      width: number
      height: number
    }
  }

  // Metadata for Next.js
  tags: string[]
  description: string
  popularity: number
  isCustomizable: boolean
  defaultProperties: FrameProperties
}

interface FrameCategory {
  id: string
  name: string
  description: string
  icon: string
  sortOrder: number
}

interface FrameLibraryState {
  frames: Frame[]
  categories: FrameCategory[]
  selectedFrameId: string | null
  activeCategory: string | null
  searchQuery: string
  isLoading: boolean
  error: string | null
}
```

### Frame Grid Component
```typescript
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const FrameGrid = ({ frames, onFrameSelect }: {
  frames: Frame[]
  onFrameSelect: (frame: Frame) => void
}) => {
  const [hoveredFrameId, setHoveredFrameId] = useState<string | null>(null)
  const { selectedFrameId } = useFrameStore()

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {frames.map((frame) => (
        <FrameThumbnail
          key={frame.id}
          frame={frame}
          isSelected={selectedFrameId === frame.id}
          isHovered={hoveredFrameId === frame.id}
          onSelect={() => onFrameSelect(frame)}
          onHover={(isHovered) => setHoveredFrameId(isHovered ? frame.id : null)}
        />
      ))}
    </div>
  )
}

const FrameThumbnail = ({
  frame,
  isSelected,
  isHovered,
  onSelect,
  onHover
}: {
  frame: Frame
  isSelected: boolean
  isHovered: boolean
  onSelect: () => void
  onHover: (isHovered: boolean) => void
}) => {
  return (
    <div
      className={cn(
        "relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer",
        "border-2 transition-all duration-200",
        isSelected ? "border-primary shadow-lg" : "border-transparent hover:border-muted-foreground/50"
      )}
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Next.js Image optimization */}
      <Image
        src={frame.thumbnailUrl}
        alt={frame.displayName}
        fill
        className="object-cover"
        loading="lazy"
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      />

      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
          <CheckIcon className="w-3 h-3 text-primary-foreground" />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
        <p className="text-white text-sm font-medium truncate">{frame.displayName}</p>
        <p className="text-white/80 text-xs">{frame.category.name}</p>
      </div>

      {isHovered && (
        <FramePreviewOverlay frame={frame} />
      )}
    </div>
  )
}
```

### Search and Filter Implementation
```typescript
'use client'

import { useMemo } from 'react'
import { SearchIcon } from 'lucide-react'

const FrameLibraryPanel = () => {
  const {
    frames,
    categories,
    selectedFrameId,
    activeCategory,
    searchQuery,
    isLoading,
    setSearchQuery,
    setActiveCategory,
    selectFrame
  } = useFrameStore()

  // Filter frames based on search and category (Next.js client-side optimization)
  const filteredFrames = useMemo(() => {
    let result = frames

    // Apply category filter for Next.js
    if (activeCategory && activeCategory !== 'all') {
      result = result.filter(frame => frame.category.id === activeCategory)
    }

    // Apply search filter for Next.js
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(frame =>
        frame.name.toLowerCase().includes(query) ||
        frame.displayName.toLowerCase().includes(query) ||
        frame.category.name.toLowerCase().includes(query) ||
        frame.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Sort by popularity and alphabetically (Next.js optimization)
    return result.sort((a, b) => {
      if (a.popularity !== b.popularity) {
        return b.popularity - a.popularity
      }
      return a.displayName.localeCompare(b.displayName)
    })
  }, [frames, activeCategory, searchQuery])

  return (
    <div className="flex flex-col h-full">
      {/* Header with search and filters */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-3">Frame Library</h2>

        <FrameSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search frames..."
        />

        <FrameCategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {/* Frame grid with Next.js optimization */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <FrameLoadingSkeleton />
        ) : filteredFrames.length > 0 ? (
          <FrameGrid
            frames={filteredFrames}
            onFrameSelect={selectFrame}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <SearchIcon className="w-12 h-12 mb-2" />
            <p>No frames found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
```

## Definition of Done

### Functional Requirements
- [ ] Frame library displays minimum 10 high-quality frames in organized grid with Next.js Image optimization
- [ ] Category filtering works smoothly with visual feedback in Next.js client components
- [ ] Search functionality finds frames by name, category, and tags using Next.js patterns
- [ ] Frame selection updates UI state and persists across sessions with Next.js client-side state
- [ ] Hover previews show frames with current user image in Next.js components

### Performance Requirements
- [ ] Frame thumbnails load within 500ms on standard connection with Next.js Image optimization
- [ ] Grid layout renders smoothly with 60fps scroll performance using Next.js optimization
- [ ] Search results update within 100ms of user input with Next.js client-side filtering
- [ ] Panel animations maintain 60fps without jank using Next.js CSS-in-JS

### User Experience Requirements
- [ ] Frame discovery intuitive for first-time users with Next.js SSG benefits
- [ ] Visual hierarchy clear with proper contrast and spacing in Next.js components
- [ ] Loading states prevent layout shift during frame loading with Next.js optimization
- [ ] Panel behavior consistent with established interaction patterns in Next.js app

### Accessibility Requirements
- [ ] Keyboard navigation supports frame selection and filtering in Next.js components
- [ ] Screen readers announce frame names, categories, and selection states with Next.js accessibility
- [ ] Focus indicators visible for all interactive elements in Next.js components
- [ ] Color contrast meets WCAG AA standards for all text and icons in Next.js app

## Success Metrics

### User Engagement
- **Target:** 85% of users who upload images open the frame library
- **Measurement:** Analytics tracking frame panel opens with Next.js analytics integration

### Frame Discovery
- **Target:** Average user views 8+ frames before making selection
- **Measurement:** Frame thumbnail view tracking with Next.js event tracking

### Selection Efficiency
- **Target:** Users select their first frame within 30 seconds of panel open
- **Measurement:** Time from panel open to frame selection with Next.js performance monitoring

### Search Usage
- **Target:** 25% of users utilize search functionality
- **Measurement:** Search input interaction tracking with Next.js analytics

## Risk Assessment

### Primary Risk: Frame Loading Performance with Next.js
**Mitigation:**
- Implement lazy loading for frame thumbnails with Next.js Image component
- Optimize frame assets for web delivery using Next.js static optimization
- Use progressive image loading with placeholder in Next.js

### Secondary Risk: Frame Collection Quality in Next.js
**Mitigation:**
- Establish frame quality standards and review process for Next.js assets
- User feedback collection for frame preferences with Next.js forms
- A/B testing for frame popularity using Next.js optimization

### Rollback Plan
- Feature flags for frame library components in Next.js
- Fallback to basic frame selection if advanced features fail in Next.js
- Frame asset versioning for quick content rollback with Next.js

## Testing Strategy

### Unit Tests
- Frame filtering logic with various search terms and categories in Next.js
- Frame selection state management and persistence with Next.js testing
- Component rendering with different frame data sets in Next.js environment

### Integration Tests
- End-to-end frame selection workflow with Next.js
- Panel opening/closing behavior in Next.js components
- Frame preview functionality with Next.js Image optimization

### User Acceptance Tests
- First-time user can find and select appropriate frame within 60 seconds in Next.js app
- Power users can efficiently browse large frame collections with Next.js optimization
- Search functionality helps users find specific frame types in Next.js components