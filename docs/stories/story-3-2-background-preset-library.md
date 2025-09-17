# Story 3.2: Background Preset Library

## Story Overview

**Epic:** Epic 3 - Background & Canvas Styling
**Story ID:** 3.2
**Priority:** High
**Status:** Ready for Development
**Estimated Effort:** 8 Story Points
**Sprint Assignment:** Sprint 5
**Dependencies:** Story 3.1 (Gradient Builder Interface)

## User Story

**As a** user,
**I want to** choose from preset backgrounds,
**So that I can** quickly apply professional-looking styles.

## Business Value

- Accelerates user workflow with instant professional results
- Reduces barrier to entry for users without design skills
- Provides curated quality that ensures consistent brand appearance
- Establishes foundation for premium preset marketplace and team libraries
- Leverages Next.js SSG for instant preset loading and optimal performance
- Benefits from Next.js Image optimization for preset thumbnails and previews
- Utilizes Next.js App Router for efficient preset library routing and caching

## Acceptance Criteria

### Preset Collection
1. **Curated Preset Library**
   - Minimum 20 preset gradients covering diverse professional styles
   - High-quality presets created by design professionals with proven visual appeal
   - Presets optimized for screenshot mockup backgrounds (not overpowering)
   - Regular preset updates with seasonal and trending design styles
   - Preset data served via Next.js SSG for instant loading

2. **Preset Categories**
   - Clear categorization: Subtle, Vibrant, Dark, Light, Brand Colors
   - Category filtering with visual icons and descriptive names
   - "All Presets" view showing complete collection
   - Category descriptions help users understand appropriate use cases

3. **Preset Quality Standards**
   - All presets tested for readability with typical screenshot content
   - Color accessibility considered for text overlay compatibility
   - Presets work well across different frame types (browser, mobile, desktop)
   - Consistent quality and professional appearance across entire library

### Preset Application
4. **One-Click Application**
   - Single click applies preset instantly to canvas with real-time preview
   - Preset application maintains current frame and image positioning
   - Smooth transition animation when switching between presets (200ms)
   - Application respects undo/redo system for easy experimentation

5. **Preset Preview System**
   - Accurate preset thumbnails show true gradient appearance using Next.js Image optimization
   - Hover preview shows preset applied to current mockup composition
   - Preview respects current frame and image for realistic context
   - Preset names clearly visible with optional descriptions

6. **User Feedback Integration**
   - Recently applied presets automatically tracked for quick reaccess
   - Preset popularity indicated through usage metrics and ratings
   - User can mark presets as favorites for personalized quick access
   - Recently used section shows last 5 applied backgrounds

### Search and Discovery
7. **Preset Search Functionality**
   - Text search finds presets by name, color description, or tags
   - Search supports natural language (e.g., "blue gradient", "sunset colors")
   - Search results ranked by relevance and popularity
   - Clear search button to reset to full library view

## Technical Implementation

### Preset Data Structure
```typescript
interface BackgroundPreset {
  id: string
  name: string
  displayName: string
  description: string
  category: PresetCategory

  // Gradient configuration
  gradientConfig: GradientConfig

  // Visual assets optimized for Next.js
  thumbnailUrl: string
  previewUrl: string

  // Metadata
  tags: string[]
  popularity: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  createdBy: string
  createdAt: Date

  // Usage tracking
  usageCount: number
  averageRating: number
  lastUsed?: Date
}

interface PresetCategory {
  id: string
  name: string
  description: string
  icon: string
  sortOrder: number
  color: string  // Category accent color
}

interface PresetLibraryState {
  presets: BackgroundPreset[]
  categories: PresetCategory[]
  filteredPresets: BackgroundPreset[]
  activeCategory: string | null
  searchQuery: string
  recentlyUsed: string[]
  favorites: string[]
  isLoading: boolean
}
```

### Preset Categories Definition
```typescript
const PRESET_CATEGORIES: PresetCategory[] = [
  {
    id: 'subtle',
    name: 'Subtle',
    description: 'Gentle gradients that enhance without overwhelming',
    icon: 'Feather',
    sortOrder: 1,
    color: '#E5E7EB'
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Bold colors that make your mockups stand out',
    icon: 'Zap',
    sortOrder: 2,
    color: '#F59E0B'
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Professional dark themes and night modes',
    icon: 'Moon',
    sortOrder: 3,
    color: '#374151'
  },
  {
    id: 'light',
    name: 'Light',
    description: 'Clean, bright backgrounds for minimal aesthetics',
    icon: 'Sun',
    sortOrder: 4,
    color: '#FEF3C7'
  },
  {
    id: 'brand',
    name: 'Brand Colors',
    description: 'Popular brand color schemes and corporate styles',
    icon: 'Building',
    sortOrder: 5,
    color: '#3B82F6'
  }
]
```

### Preset Library Component
```typescript
'use client'

import { useMemo, useState } from 'react'
import { useBackgroundStore } from '@/stores/background'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SearchIcon, XIcon, HeartIcon, StarIcon, LoaderIcon } from 'lucide-react'
import { PresetCategoryFilter } from '@/components/preset-category-filter'
import { PresetLoadingSkeleton } from '@/components/preset-loading-skeleton'
import { PresetThumbnail } from '@/components/preset-thumbnail'
import { PresetGrid } from '@/components/preset-grid'

export default function BackgroundPresetLibrary() {
  const {
    presets,
    categories,
    filteredPresets,
    activeCategory,
    searchQuery,
    recentlyUsed,
    favorites,
    isLoading,
    setSearchQuery,
    setActiveCategory,
    applyPreset,
    toggleFavorite,
    getPresetById
  } = useBackgroundStore()

  const recentPresets = useMemo(() =>
    recentlyUsed.map(id => getPresetById(id)).filter(Boolean).slice(0, 5)
  , [recentlyUsed, getPresetById])

  const favoritePresets = useMemo(() =>
    favorites.map(id => getPresetById(id)).filter(Boolean)
  , [favorites, getPresetById])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold mb-3">Background Presets</h3>

        {/* Search */}
        <div className="relative mb-3">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search backgrounds..."
            className="pl-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setSearchQuery('')}
            >
              <XIcon className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Category Filter */}
        <PresetCategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <PresetLoadingSkeleton />
        ) : (
          <>
            {/* Recently Used */}
            {recentPresets.length > 0 && !searchQuery && (
              <div className="p-4 border-b">
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Recently Used</h4>
                <div className="grid grid-cols-3 gap-2">
                  {recentPresets.map(preset => (
                    <PresetThumbnail
                      key={preset.id}
                      preset={preset}
                      size="small"
                      onApply={() => applyPreset(preset)}
                      onToggleFavorite={() => toggleFavorite(preset.id)}
                      isFavorite={favorites.includes(preset.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Favorites */}
            {favoritePresets.length > 0 && !searchQuery && (
              <div className="p-4 border-b">
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Favorites</h4>
                <div className="grid grid-cols-2 gap-3">
                  {favoritePresets.map(preset => (
                    <PresetThumbnail
                      key={preset.id}
                      preset={preset}
                      size="medium"
                      onApply={() => applyPreset(preset)}
                      onToggleFavorite={() => toggleFavorite(preset.id)}
                      isFavorite={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Main Preset Grid */}
            <div className="p-4">
              {filteredPresets.length > 0 ? (
                <PresetGrid
                  presets={filteredPresets}
                  favorites={favorites}
                  onApplyPreset={applyPreset}
                  onToggleFavorite={toggleFavorite}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <SearchIcon className="w-8 h-8 mb-2" />
                  <p className="text-sm">No presets found</p>
                  <p className="text-xs">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
```

### Preset Thumbnail Component
```typescript
'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { HeartIcon, LoaderIcon, StarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { generateGradientCSS } from '@/lib/gradient-utils'

interface PresetThumbnailProps {
  preset: BackgroundPreset
  size: 'small' | 'medium' | 'large'
  onApply: () => void
  onToggleFavorite: () => void
  isFavorite: boolean
}

export function PresetThumbnail({ preset, size, onApply, onToggleFavorite, isFavorite }: PresetThumbnailProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isApplying, setIsApplying] = useState(false)

  const sizeClasses = {
    small: 'aspect-video',
    medium: 'aspect-video',
    large: 'aspect-[4/3]'
  }

  const handleApply = useCallback(async () => {
    setIsApplying(true)
    try {
      await onApply()
    } finally {
      setIsApplying(false)
    }
  }, [onApply])

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden cursor-pointer transition-all",
        "border-2 border-transparent hover:border-primary/50",
        "hover:shadow-md transform hover:-translate-y-0.5",
        sizeClasses[size]
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleApply}
    >
      {/* Gradient Background with Next.js Image optimization for thumbnails */}
      {preset.thumbnailUrl ? (
        <Image
          src={preset.thumbnailUrl}
          alt={preset.displayName}
          fill
          className="object-cover"
          sizes={size === 'small' ? '120px' : size === 'medium' ? '200px' : '300px'}
          priority={size === 'large'}
        />
      ) : (
        <div
          className="w-full h-full"
          style={{ background: generateGradientCSS(preset.gradientConfig) }}
        />
      )}

      {/* Overlay Controls */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-black"
              disabled={isApplying}
              onClick={(e) => {
                e.stopPropagation()
                handleApply()
              }}
            >
              {isApplying ? (
                <LoaderIcon className="w-3 h-3 animate-spin" />
              ) : (
                'Apply'
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="bg-white/90 hover:bg-white text-black p-1"
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite()
              }}
            >
              <HeartIcon
                className={cn(
                  "w-3 h-3",
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                )}
              />
            </Button>
          </div>
        </div>
      )}

      {/* Preset Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
        <p className="text-white text-xs font-medium truncate">{preset.displayName}</p>
        {size !== 'small' && (
          <div className="flex items-center justify-between mt-1">
            <span className="text-white/80 text-xs">{preset.category.name}</span>
            {preset.popularity > 80 && (
              <div className="flex items-center gap-1">
                <StarIcon className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-white/80 text-xs">Popular</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Favorite Indicator */}
      {isFavorite && (
        <div className="absolute top-2 right-2">
          <HeartIcon className="w-4 h-4 text-red-500 fill-current" />
        </div>
      )}
    </div>
  )
}
```

### Preset Grid Component
```typescript
'use client'

import { useState, useMemo } from 'react'
import { PresetThumbnail } from '@/components/preset-thumbnail'

interface PresetGridProps {
  presets: BackgroundPreset[]
  favorites: string[]
  onApplyPreset: (preset: BackgroundPreset) => void
  onToggleFavorite: (presetId: string) => void
}

export function PresetGrid({ presets, favorites, onApplyPreset, onToggleFavorite }: PresetGridProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

  // Group presets by category for better organization
  const groupedPresets = useMemo(() => {
    const groups = new Map<string, BackgroundPreset[]>()

    presets.forEach(preset => {
      const categoryId = preset.category.id
      if (!groups.has(categoryId)) {
        groups.set(categoryId, [])
      }
      groups.get(categoryId)!.push(preset)
    })

    return groups
  }, [presets])

  return (
    <div className="space-y-6">
      {Array.from(groupedPresets.entries()).map(([categoryId, categoryPresets]) => {
        const category = categoryPresets[0].category

        return (
          <div key={categoryId}>
            <div className="flex items-center mb-3">
              <div
                className="w-3 h-3 rounded mr-2"
                style={{ backgroundColor: category.color }}
              />
              <h4 className="text-sm font-medium">{category.name}</h4>
              <span className="ml-2 text-xs text-muted-foreground">
                ({categoryPresets.length})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {categoryPresets.map(preset => (
                <PresetThumbnail
                  key={preset.id}
                  preset={preset}
                  size="medium"
                  onApply={() => onApplyPreset(preset)}
                  onToggleFavorite={() => onToggleFavorite(preset.id)}
                  isFavorite={favorites.includes(preset.id)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

### Next.js API Route for Preset Data (SSG)
```typescript
// app/api/background-presets/route.ts
import { NextResponse } from 'next/server'
import { BackgroundPreset } from '@/types/presets'

// Static preset data served via Next.js API route for SSG optimization
const presets: BackgroundPreset[] = [
  {
    id: 'gradient-blue-subtle',
    name: 'Subtle Blue',
    displayName: 'Subtle Blue',
    description: 'A gentle blue gradient perfect for professional mockups',
    category: {
      id: 'subtle',
      name: 'Subtle',
      description: 'Gentle gradients that enhance without overwhelming',
      icon: 'Feather',
      sortOrder: 1,
      color: '#E5E7EB'
    },
    gradientConfig: {
      id: 'gradient-blue-subtle',
      name: 'Subtle Blue',
      type: 'linear',
      angle: 135,
      centerX: 50,
      centerY: 50,
      radius: 50,
      stops: [
        { id: 'stop1', color: '#e0f2fe', position: 0, opacity: 1 },
        { id: 'stop2', color: '#bae6fd', position: 100, opacity: 1 }
      ],
      createdAt: new Date(),
      lastModified: new Date(),
      tags: ['blue', 'subtle', 'professional']
    },
    thumbnailUrl: '/presets/thumbnails/subtle-blue.webp',
    previewUrl: '/presets/previews/subtle-blue.webp',
    tags: ['blue', 'subtle', 'professional'],
    popularity: 85,
    difficulty: 'beginner',
    createdBy: 'Scroma',
    createdAt: new Date(),
    usageCount: 0,
    averageRating: 4.5
  }
  // ... additional presets
]

// Next.js API route with caching for optimal performance
export async function GET() {
  return NextResponse.json(presets, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  })
}
```

### Preset Management Service with Next.js Integration
```typescript
'use client'

import { BackgroundPreset } from '@/types/presets'
import { useBackgroundStore } from '@/stores/background'

class PresetService {
  private static presets: BackgroundPreset[] = []
  private static initialized = false

  static async loadPresets(): Promise<BackgroundPreset[]> {
    if (this.initialized) {
      return this.presets
    }

    try {
      // Load presets from Next.js API route optimized for SSG
      const response = await fetch('/api/background-presets', {
        next: { revalidate: 3600 } // Next.js caching
      })
      const presetsData = await response.json()

      this.presets = presetsData.map(this.validatePreset).filter(Boolean)
      this.initialized = true

      return this.presets
    } catch (error) {
      console.error('Failed to load presets:', error)
      return this.getFallbackPresets()
    }
  }

  private static validatePreset(data: any): BackgroundPreset | null {
    try {
      // Validate required fields
      if (!data.id || !data.name || !data.gradientConfig) {
        return null
      }

      // Validate gradient configuration
      if (!this.isValidGradientConfig(data.gradientConfig)) {
        return null
      }

      return {
        id: data.id,
        name: data.name,
        displayName: data.displayName || data.name,
        description: data.description || '',
        category: data.category,
        gradientConfig: data.gradientConfig,
        thumbnailUrl: data.thumbnailUrl || this.generateThumbnail(data.gradientConfig),
        previewUrl: data.previewUrl || '',
        tags: data.tags || [],
        popularity: data.popularity || 0,
        difficulty: data.difficulty || 'beginner',
        createdBy: data.createdBy || 'Scroma',
        createdAt: new Date(data.createdAt || Date.now()),
        usageCount: 0,
        averageRating: data.averageRating || 0
      }
    } catch (error) {
      console.warn('Invalid preset data:', error)
      return null
    }
  }

  private static isValidGradientConfig(config: any): boolean {
    return (
      config &&
      typeof config.type === 'string' &&
      ['linear', 'radial'].includes(config.type) &&
      Array.isArray(config.stops) &&
      config.stops.length >= 2 &&
      config.stops.every(stop =>
        typeof stop.color === 'string' &&
        typeof stop.position === 'number' &&
        stop.position >= 0 &&
        stop.position <= 100
      )
    )
  }

  private static getFallbackPresets(): BackgroundPreset[] {
    // Fallback presets in case loading fails
    return [
      {
        id: 'gradient-blue-subtle',
        name: 'Subtle Blue',
        displayName: 'Subtle Blue',
        description: 'A gentle blue gradient perfect for professional mockups',
        category: {
          id: 'subtle',
          name: 'Subtle',
          description: 'Gentle gradients that enhance without overwhelming',
          icon: 'Feather',
          sortOrder: 1,
          color: '#E5E7EB'
        },
        gradientConfig: {
          id: 'gradient-blue-subtle',
          name: 'Subtle Blue',
          type: 'linear',
          angle: 135,
          centerX: 50,
          centerY: 50,
          radius: 50,
          stops: [
            { id: 'stop1', color: '#e0f2fe', position: 0, opacity: 1 },
            { id: 'stop2', color: '#bae6fd', position: 100, opacity: 1 }
          ],
          createdAt: new Date(),
          lastModified: new Date(),
          tags: ['blue', 'subtle', 'professional']
        },
        thumbnailUrl: '',
        previewUrl: '',
        tags: ['blue', 'subtle', 'professional'],
        popularity: 85,
        difficulty: 'beginner',
        createdBy: 'Scroma',
        createdAt: new Date(),
        usageCount: 0,
        averageRating: 4.5
      }
      // ... additional fallback presets
    ]
  }

  static async applyPreset(preset: BackgroundPreset): Promise<void> {
    // Track usage
    preset.usageCount++
    preset.lastUsed = new Date()

    // Apply to canvas
    const { applyGradientToCanvas } = useBackgroundStore.getState()
    await applyGradientToCanvas(preset.gradientConfig)

    // Update recent usage
    this.updateRecentUsage(preset.id)
  }

  private static updateRecentUsage(presetId: string): void {
    const { recentlyUsed, setRecentlyUsed } = useBackgroundStore.getState()

    const updated = [presetId, ...recentlyUsed.filter(id => id !== presetId)].slice(0, 10)
    setRecentlyUsed(updated)
  }
}

export { PresetService }
```

## Definition of Done

### Functional Requirements
- [ ] Preset library contains minimum 20 high-quality background gradients served via Next.js SSG
- [ ] Category filtering works smoothly with clear visual organization
- [ ] Search functionality finds presets by name, color, and tags
- [ ] One-click preset application works with real-time preview
- [ ] Favorites and recently used sections provide quick access to preferred presets

### Performance Requirements
- [ ] Preset thumbnails load within 500ms using Next.js Image optimization
- [ ] Preset application completes within 200ms with smooth transition
- [ ] Library browsing maintains 60fps scroll performance with Next.js optimizations
- [ ] Search results update within 100ms of user input
- [ ] SSG preset data loads instantly on first visit

### User Experience Requirements
- [ ] Preset discovery intuitive with clear visual hierarchy
- [ ] Category organization helps users find appropriate styles
- [ ] Preview system shows realistic context with current mockup
- [ ] Favorites system enables personalized workflow optimization

### Quality Requirements
- [ ] All presets meet professional quality standards
- [ ] Preset colors work well with typical screenshot content
- [ ] Thumbnail accuracy represents actual gradient appearance
- [ ] Preset metadata (names, descriptions, tags) helpful and accurate

## Success Metrics

### Feature Adoption
- **Target:** 80% of users who access background features use preset library
- **Measurement:** Analytics tracking preset panel opens and applications

### Preset Usage
- **Target:** Average user tries 5+ presets before settling on choice
- **Measurement:** Preset application tracking and user behavior analysis

### User Efficiency
- **Target:** Users find suitable preset within 60 seconds of opening library
- **Measurement:** Time tracking from panel open to successful application

### Preset Quality
- **Target:** 90% of applied presets remain in final exported mockups
- **Measurement:** Tracking preset usage through to export completion

### Performance Metrics
- **Target:** Preset library loads within 300ms with Next.js SSG optimizations
- **Measurement:** Core Web Vitals monitoring and performance tracking

## Risk Assessment

### Primary Risk: Preset Quality and User Satisfaction
**Mitigation:**
- Professional design review for all presets
- User feedback collection and rating system
- A/B testing for preset popularity and effectiveness

### Secondary Risk: Preset Loading Performance
**Mitigation:**
- Next.js Image optimization for preset thumbnails
- SSG delivery for instant preset data loading
- Progressive loading with fallback presets
- CDN delivery for preset assets

### Rollback Plan
- Feature flags for preset library components
- Fallback preset collection embedded in application
- Graceful degradation to gradient builder if library fails

## Testing Strategy

### Unit Tests
- Preset data validation and loading logic
- Search and filtering functionality
- Favorites and recent usage management

### Integration Tests
- End-to-end preset discovery and application workflow
- Cross-browser compatibility for preset rendering
- Performance testing with large preset collections
- Next.js SSG preset loading performance

### User Acceptance Tests
- First-time users can find and apply suitable preset within 2 minutes
- Preset quality meets professional standards across different use cases
- Library organization helps users discover appropriate styles efficiently