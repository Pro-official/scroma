# Story 3.4: Canvas Enhancement Options

## Story Overview

**Epic:** Epic 3 - Background & Canvas Styling
**Story ID:** 3.4
**Priority:** Medium
**Status:** Ready for Development
**Estimated Effort:** 8 Story Points
**Sprint Assignment:** Sprint 6
**Dependencies:** Story 3.3 (Solid Colors & Patterns)

## User Story

**As a** user,
**I want to** apply professional finishing touches to my canvas,
**So that my** mockups have polished presentation quality.

## Business Value

- Provides professional-grade finishing options that elevate mockup quality beyond basic tools
- Enables social media optimization with preset canvas dimensions for platforms
- Establishes foundation for advanced design features and premium styling options
- Supports brand differentiation with sophisticated visual effects and presentation options
- Leverages Next.js client-side optimizations for smooth real-time effect rendering
- Benefits from Next.js performance features for complex visual effect combinations

## Acceptance Criteria

### Canvas Spacing Controls
1. **Padding Adjustment**
   - Canvas padding control adjusts space around entire composition (0-200px range)
   - Uniform padding applied to all sides with visual preview of affected area
   - Individual side padding control for advanced users (top, right, bottom, left)
   - Padding changes maintain center-alignment of composition

2. **Canvas Size Management**
   - Custom canvas dimensions with width and height input fields
   - Aspect ratio lock toggle maintains proportions during resize
   - Canvas size presets for common social media platforms (Instagram, Twitter, LinkedIn, etc.)
   - Smart resize that maintains composition positioning and scaling

### Visual Enhancement Effects
3. **Rounded Corners**
   - Corner radius adjustment for entire composition (0-50px range)
   - Real-time preview shows rounded corner effect on canvas
   - Corner radius applies to final export while maintaining editing capabilities
   - Radius adjustment works with all background types (solid, gradient, pattern)

4. **Shadow Effects**
   - Drop shadow settings for lifted/floating appearance of entire canvas
   - Shadow customization includes offset (X/Y), blur radius, and opacity
   - Shadow color picker with default dark shadow and custom color options
   - Shadow presets for common effects (subtle, medium, dramatic, none)

5. **Reflection Effect**
   - Reflection toggle creates mirror effect below canvas composition
   - Reflection intensity control adjusts opacity and fade distance
   - Reflection works with all canvas content including frames and backgrounds
   - Performance-optimized reflection rendering for smooth interaction using Next.js optimizations

### Advanced Canvas Effects
6. **Vignette Effect**
   - Vignette option adds subtle darkening around canvas edges
   - Vignette intensity slider controls effect strength (0-100%)
   - Vignette color customization (black, white, or custom color)
   - Vignette shape options (circular, rectangular) for different aesthetic effects

7. **Background Position Control**
   - Background position adjustment for gradient and pattern centering
   - Visual position controls with drag-to-adjust functionality
   - Position presets (center, top-left, top-right, bottom-left, bottom-right)
   - Position changes apply to background without affecting frame or image positioning

## Technical Implementation

### Canvas Enhancement State
```typescript
interface CanvasEnhancement {
  // Spacing and dimensions
  padding: {
    uniform: boolean
    top: number
    right: number
    bottom: number
    left: number
  }

  dimensions: {
    width: number
    height: number
    lockAspectRatio: boolean
    preset?: SocialMediaPreset
  }

  // Visual effects
  cornerRadius: number
  shadow: {
    enabled: boolean
    offsetX: number
    offsetY: number
    blur: number
    opacity: number
    color: string
  }

  reflection: {
    enabled: boolean
    intensity: number
    distance: number
    fadeLength: number
  }

  vignette: {
    enabled: boolean
    intensity: number
    color: string
    shape: 'circular' | 'rectangular'
    feather: number
  }

  // Background positioning
  backgroundPosition: {
    x: number  // -100 to 100
    y: number  // -100 to 100
  }
}

interface SocialMediaPreset {
  id: string
  name: string
  platform: string
  width: number
  height: number
  aspectRatio: string
  description: string
  icon: string
}
```

### Social Media Presets
```typescript
const SOCIAL_MEDIA_PRESETS: SocialMediaPreset[] = [
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    platform: 'Instagram',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    description: 'Square format for Instagram feed posts',
    icon: 'instagram'
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    platform: 'Instagram',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: 'Vertical format for Instagram Stories',
    icon: 'instagram'
  },
  {
    id: 'twitter-post',
    name: 'Twitter Post',
    platform: 'Twitter',
    width: 1200,
    height: 675,
    aspectRatio: '16:9',
    description: 'Landscape format for Twitter posts',
    icon: 'twitter'
  },
  {
    id: 'linkedin-post',
    name: 'LinkedIn Post',
    platform: 'LinkedIn',
    width: 1200,
    height: 627,
    aspectRatio: '1.91:1',
    description: 'Professional format for LinkedIn posts',
    icon: 'linkedin'
  },
  {
    id: 'facebook-post',
    name: 'Facebook Post',
    platform: 'Facebook',
    width: 1200,
    height: 630,
    aspectRatio: '1.9:1',
    description: 'Standard format for Facebook posts',
    icon: 'facebook'
  },
  {
    id: 'youtube-thumbnail',
    name: 'YouTube Thumbnail',
    platform: 'YouTube',
    width: 1280,
    height: 720,
    aspectRatio: '16:9',
    description: 'Thumbnail format for YouTube videos',
    icon: 'youtube'
  },
  {
    id: 'presentation-slide',
    name: 'Presentation Slide',
    platform: 'Generic',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    description: 'Standard format for presentation slides',
    icon: 'presentation'
  }
]
```

### Canvas Enhancement Component
```typescript
'use client'

import { useState, useCallback } from 'react'
import { useCanvasStore } from '@/stores/canvas'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { RulerIcon, SparklesIcon, MoveIcon, RotateCcwIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { debounce } from 'lodash'
import { DimensionsSection } from '@/components/dimensions-section'
import { EffectsSection } from '@/components/effects-section'
import { PositionSection } from '@/components/position-section'

export default function CanvasEnhancementPanel() {
  const {
    canvasEnhancement,
    updateCanvasEnhancement,
    applyCanvasEnhancement,
    resetCanvasEnhancement
  } = useCanvasStore()

  const [activeSection, setActiveSection] = useState<string>('dimensions')

  const sections = [
    { id: 'dimensions', name: 'Size & Spacing', icon: RulerIcon },
    { id: 'effects', name: 'Visual Effects', icon: SparklesIcon },
    { id: 'position', name: 'Background Position', icon: MoveIcon }
  ]

  const handleEnhancementChange = useCallback((
    section: keyof CanvasEnhancement,
    property: string,
    value: any
  ) => {
    const updatedEnhancement = {
      ...canvasEnhancement,
      [section]: {
        ...canvasEnhancement[section],
        [property]: value
      }
    }

    updateCanvasEnhancement(updatedEnhancement)

    // Debounced canvas update optimized for Next.js client-side performance
    const debouncedUpdate = debounce(() => {
      applyCanvasEnhancement(updatedEnhancement)
    }, 100)
    debouncedUpdate()
  }, [canvasEnhancement, updateCanvasEnhancement, applyCanvasEnhancement])

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Canvas Enhancement</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={resetCanvasEnhancement}
          >
            <RotateCcwIcon className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-md text-sm transition-all",
                  activeSection === section.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setActiveSection(section.id)}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{section.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeSection === 'dimensions' && (
          <DimensionsSection
            enhancement={canvasEnhancement}
            onChange={handleEnhancementChange}
          />
        )}

        {activeSection === 'effects' && (
          <EffectsSection
            enhancement={canvasEnhancement}
            onChange={handleEnhancementChange}
          />
        )}

        {activeSection === 'position' && (
          <PositionSection
            enhancement={canvasEnhancement}
            onChange={handleEnhancementChange}
          />
        )}
      </div>
    </div>
  )
}
```

### Dimensions Section Component
```typescript
'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

interface DimensionsSectionProps {
  enhancement: CanvasEnhancement
  onChange: (section: keyof CanvasEnhancement, property: string, value: any) => void
}

export function DimensionsSection({ enhancement, onChange }: DimensionsSectionProps) {
  const [showCustomSize, setShowCustomSize] = useState(false)

  const handlePresetSelect = useCallback((preset: SocialMediaPreset) => {
    onChange('dimensions', 'width', preset.width)
    onChange('dimensions', 'height', preset.height)
    onChange('dimensions', 'preset', preset)
  }, [onChange])

  const handlePaddingChange = useCallback((side: string, value: number) => {
    if (enhancement.padding.uniform) {
      onChange('padding', 'top', value)
      onChange('padding', 'right', value)
      onChange('padding', 'bottom', value)
      onChange('padding', 'left', value)
    } else {
      onChange('padding', side, value)
    }
  }, [enhancement.padding.uniform, onChange])

  return (
    <div className="space-y-6">
      {/* Canvas Size Presets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Canvas Size</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCustomSize(!showCustomSize)}
          >
            {showCustomSize ? 'Presets' : 'Custom'}
          </Button>
        </div>

        {!showCustomSize ? (
          <div className="grid grid-cols-1 gap-2">
            {SOCIAL_MEDIA_PRESETS.map((preset) => (
              <button
                key={preset.id}
                className={cn(
                  "p-3 border rounded-lg text-left transition-all hover:border-primary/50",
                  enhancement.dimensions.preset?.id === preset.id
                    ? "border-primary bg-primary/5"
                    : "border-muted"
                )}
                onClick={() => handlePresetSelect(preset)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{preset.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {preset.width} × {preset.height} ({preset.aspectRatio})
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {preset.platform}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Width</Label>
                <Input
                  type="number"
                  value={enhancement.dimensions.width}
                  onChange={(e) => onChange('dimensions', 'width', parseInt(e.target.value))}
                  min={100}
                  max={4000}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Height</Label>
                <Input
                  type="number"
                  value={enhancement.dimensions.height}
                  onChange={(e) => onChange('dimensions', 'height', parseInt(e.target.value))}
                  min={100}
                  max={4000}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={enhancement.dimensions.lockAspectRatio}
                onCheckedChange={(checked) => onChange('dimensions', 'lockAspectRatio', checked)}
              />
              <Label className="text-sm">Lock aspect ratio</Label>
            </div>
          </div>
        )}
      </div>

      {/* Canvas Padding */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Canvas Padding</Label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={!enhancement.padding.uniform}
              onCheckedChange={(checked) => onChange('padding', 'uniform', !checked)}
            />
            <Label className="text-xs">Individual sides</Label>
          </div>
        </div>

        {enhancement.padding.uniform ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">All sides</Label>
              <span className="text-xs text-muted-foreground">
                {enhancement.padding.top}px
              </span>
            </div>
            <Slider
              value={[enhancement.padding.top]}
              onValueChange={([value]) => handlePaddingChange('all', value)}
              min={0}
              max={200}
              step={1}
              className="w-full"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'top', label: 'Top' },
              { key: 'right', label: 'Right' },
              { key: 'bottom', label: 'Bottom' },
              { key: 'left', label: 'Left' }
            ].map(({ key, label }) => (
              <div key={key} className="space-y-1">
                <Label className="text-xs">{label}</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[enhancement.padding[key]]}
                    onValueChange={([value]) => handlePaddingChange(key, value)}
                    min={0}
                    max={200}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs w-8">{enhancement.padding[key]}px</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

### Effects Section Component
```typescript
'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { ShadowControls } from '@/components/shadow-controls'
import { ColorPickerButton } from '@/components/color-picker-button'

interface EffectsSectionProps {
  enhancement: CanvasEnhancement
  onChange: (section: keyof CanvasEnhancement, property: string, value: any) => void
}

export function EffectsSection({ enhancement, onChange }: EffectsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Corner Radius */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Corner Radius</Label>
          <span className="text-xs text-muted-foreground">
            {enhancement.cornerRadius}px
          </span>
        </div>
        <Slider
          value={[enhancement.cornerRadius]}
          onValueChange={([radius]) => onChange('cornerRadius', 'value', radius)}
          min={0}
          max={50}
          step={1}
          className="w-full"
        />
      </div>

      {/* Drop Shadow */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Drop Shadow</Label>
          <Switch
            checked={enhancement.shadow.enabled}
            onCheckedChange={(enabled) => onChange('shadow', 'enabled', enabled)}
          />
        </div>

        {enhancement.shadow.enabled && (
          <div className="space-y-4 pl-4 border-l-2 border-muted">
            <ShadowControls
              shadow={enhancement.shadow}
              onChange={(property, value) => onChange('shadow', property, value)}
            />
          </div>
        )}
      </div>

      {/* Reflection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Reflection</Label>
          <Switch
            checked={enhancement.reflection.enabled}
            onCheckedChange={(enabled) => onChange('reflection', 'enabled', enabled)}
          />
        </div>

        {enhancement.reflection.enabled && (
          <div className="space-y-4 pl-4 border-l-2 border-muted">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Intensity</Label>
                <span className="text-xs text-muted-foreground">
                  {Math.round(enhancement.reflection.intensity * 100)}%
                </span>
              </div>
              <Slider
                value={[enhancement.reflection.intensity]}
                onValueChange={([intensity]) => onChange('reflection', 'intensity', intensity)}
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Vignette */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Vignette</Label>
          <Switch
            checked={enhancement.vignette.enabled}
            onCheckedChange={(enabled) => onChange('vignette', 'enabled', enabled)}
          />
        </div>

        {enhancement.vignette.enabled && (
          <div className="space-y-4 pl-4 border-l-2 border-muted">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Intensity</Label>
                <span className="text-xs text-muted-foreground">
                  {Math.round(enhancement.vignette.intensity * 100)}%
                </span>
              </div>
              <Slider
                value={[enhancement.vignette.intensity]}
                onValueChange={([intensity]) => onChange('vignette', 'intensity', intensity)}
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Shape</Label>
              <div className="flex gap-2">
                <Button
                  variant={enhancement.vignette.shape === 'circular' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onChange('vignette', 'shape', 'circular')}
                >
                  Circular
                </Button>
                <Button
                  variant={enhancement.vignette.shape === 'rectangular' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onChange('vignette', 'shape', 'rectangular')}
                >
                  Rectangular
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Color</Label>
              <ColorPickerButton
                color={enhancement.vignette.color}
                onChange={(color) => onChange('vignette', 'color', color)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

### Canvas Enhancement Utilities
```typescript
// lib/canvas-enhancement-utils.ts
export function generateCanvasCSS(enhancement: CanvasEnhancement): React.CSSProperties {
  const styles: React.CSSProperties = {
    padding: enhancement.padding.uniform
      ? `${enhancement.padding.top}px`
      : `${enhancement.padding.top}px ${enhancement.padding.right}px ${enhancement.padding.bottom}px ${enhancement.padding.left}px`,
    borderRadius: `${enhancement.cornerRadius}px`,
    width: `${enhancement.dimensions.width}px`,
    height: `${enhancement.dimensions.height}px`
  }

  // Add shadow if enabled
  if (enhancement.shadow.enabled) {
    styles.boxShadow = `${enhancement.shadow.offsetX}px ${enhancement.shadow.offsetY}px ${enhancement.shadow.blur}px ${enhancement.shadow.color}${Math.round(enhancement.shadow.opacity * 255).toString(16).padStart(2, '0')}`
  }

  // Add background position
  if (enhancement.backgroundPosition.x !== 50 || enhancement.backgroundPosition.y !== 50) {
    styles.backgroundPosition = `${enhancement.backgroundPosition.x}% ${enhancement.backgroundPosition.y}%`
  }

  return styles
}

export function generateVignetteCSS(vignette: CanvasEnhancement['vignette']): string {
  if (!vignette.enabled) return ''

  const shape = vignette.shape === 'circular' ? 'radial-gradient(circle' : 'radial-gradient(ellipse'
  const color = `${vignette.color}${Math.round(vignette.intensity * 255).toString(16).padStart(2, '0')}`

  return `${shape}, transparent 30%, ${color} 100%)`
}

export function generateReflectionCSS(reflection: CanvasEnhancement['reflection']): React.CSSProperties {
  if (!reflection.enabled) return {}

  return {
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '100%',
      left: '0',
      right: '0',
      height: `${reflection.distance}px`,
      background: `linear-gradient(to bottom, rgba(0,0,0,${reflection.intensity}) 0%, transparent 100%)`,
      transform: 'scaleY(-1)',
      opacity: reflection.intensity
    }
  }
}
```

## Definition of Done

### Functional Requirements
- [ ] Canvas padding adjustment works with real-time preview
- [ ] Social media size presets apply correctly with accurate dimensions
- [ ] Visual effects (shadow, reflection, vignette) render properly using Next.js optimizations
- [ ] Corner radius applies to entire composition without affecting editing
- [ ] Background position control works with all background types

### Performance Requirements
- [ ] Enhancement effects update canvas within 100ms using Next.js client-side optimizations
- [ ] Visual effects maintain 60fps during adjustment with Next.js performance features
- [ ] Canvas resizing preserves composition positioning
- [ ] Effect rendering optimized for smooth interaction

### User Experience Requirements
- [ ] Enhancement controls intuitive with clear visual feedback
- [ ] Social media presets help users create platform-optimized content
- [ ] Effect intensity controls provide fine-grained adjustment
- [ ] Reset functionality allows easy return to default state

### Quality Requirements
- [ ] Visual effects match professional design tool quality
- [ ] Canvas enhancements preserved in export output
- [ ] Effect combinations work harmoniously together
- [ ] Enhancement settings persist across application sessions

## Success Metrics

### Feature Adoption
- **Target:** 40% of users who customize backgrounds also use canvas enhancements
- **Measurement:** Analytics tracking enhancement panel usage

### Social Media Optimization
- **Target:** 60% of users who use size presets choose social media formats
- **Measurement:** Canvas size preset selection tracking

### Enhancement Usage
- **Target:** Average user applies 2+ enhancement effects per mockup
- **Measurement:** Enhancement effect usage tracking and combinations

### Export Quality
- **Target:** 85% of enhanced mockups exported without removing effects
- **Measurement:** Enhancement retention through export process

### Performance Metrics
- **Target:** Canvas enhancement effects maintain <100ms response time with Next.js optimizations
- **Measurement:** Performance monitoring of effect rendering and updates

## Risk Assessment

### Primary Risk: Performance Impact of Multiple Effects
**Mitigation:**
- Optimize effect rendering with GPU acceleration where possible using Next.js client-side features
- Implement effect combination optimization with Next.js performance patterns
- Performance monitoring with automatic quality reduction
- Leverage Next.js built-in optimizations for smooth effect rendering

### Secondary Risk: Effect Combinations Creating Poor Visual Results
**Mitigation:**
- Smart defaults and effect presets for good combinations
- Visual guidelines and examples for effect usage
- User education through tooltips and examples

### Rollback Plan
- Feature flags for individual enhancement effects
- Fallback to basic canvas without enhancements if effects fail
- Effect preset system for quick recovery from poor combinations

## Testing Strategy

### Unit Tests
- Canvas dimension calculations and preset applications
- Effect combination logic and rendering accuracy
- Background position calculation with different background types

### Integration Tests
- End-to-end enhancement workflow from selection to export
- Cross-browser compatibility for visual effects rendering
- Performance testing with multiple simultaneous effects
- Next.js client-side optimization validation

### Visual Tests
- Effect rendering quality comparison across browsers
- Canvas enhancement preservation in export output
- Effect combination visual regression testing