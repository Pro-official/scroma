# Story 3.1: Gradient Builder Interface

## Story Overview

**Epic:** Epic 3 - Background & Canvas Styling
**Story ID:** 3.1
**Priority:** High
**Status:** Ready for Development
**Estimated Effort:** 13 Story Points
**Sprint Assignment:** Sprint 5
**Dependencies:** Epic 2 (Frame System for visual context)

## User Story

**As a** user,
**I want to** create custom gradient backgrounds,
**So that I can** design unique and appealing mockup presentations.

## Business Value

- Provides advanced creative capabilities that differentiate Scroma from basic screenshot tools
- Enables brand consistency and professional design quality that appeals to business users
- Establishes foundation for premium design features and template marketplace
- Supports goal of creating professional mockups that rival expensive design software
- Leverages Next.js App Router for optimal component loading and client-side gradient generation performance
- Benefits from Next.js build optimizations for faster gradient calculation bundle delivery

## Acceptance Criteria

### Gradient Creation Interface
1. **Visual Gradient Editor**
   - Interactive gradient editor with real-time preview that updates as user adjusts settings
   - Visual gradient bar shows current gradient with draggable color stops
   - Gradient preview automatically applies to canvas background for immediate context
   - Editor interface intuitive enough for users without design experience

2. **Color Stop Management**
   - Support for 2-5 color stops with smooth interpolation between colors
   - Add color stop by clicking on gradient bar at desired position
   - Remove color stop by dragging off gradient bar or delete button
   - Color stops show precise position percentage (0-100%) with manual input option

3. **Color Selection System**
   - Color picker for each stop with hex input, RGB sliders, and HSL controls
   - Color swatches for quick selection of common colors
   - Recent colors automatically saved for reuse across gradient creation
   - Eyedropper tool to sample colors from uploaded image or existing elements

### Gradient Configuration
4. **Gradient Direction Control**
   - Angle adjustment via circular slider (0-360°) with visual direction indicator
   - Direct angle input field for precise control
   - Common angle presets (0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°)
   - Visual preview shows gradient direction change in real-time

5. **Gradient Type Options**
   - Linear gradient type with configurable start and end points
   - Radial gradient type with center point and radius controls
   - Radial gradient positioning (center, top-left, top-right, etc.) via preset buttons
   - Smooth transition between gradient types without losing color configuration

6. **Advanced Gradient Features**
   - Gradient preview thumbnail for quick recognition and selection
   - Copy gradient CSS code feature for use in other design tools
   - Gradient URL generation for sharing custom gradients with team members
   - Gradient reverse function to flip color order with single click

### Real-time Preview System
7. **Canvas Integration**
   - Gradient changes immediately visible on main canvas behind frame and image
   - Preview maintains aspect ratio and positioning of current mockup composition
   - Gradient rendering optimized to maintain 60fps canvas performance using Next.js client-side optimizations
   - Preview quality matches final export output

## Technical Implementation

### Gradient Builder Component
```typescript
interface GradientConfig {
  id: string
  name: string
  type: 'linear' | 'radial'

  // Linear gradient properties
  angle: number  // 0-360 degrees

  // Radial gradient properties
  centerX: number  // 0-100 percentage
  centerY: number  // 0-100 percentage
  radius: number   // 0-100 percentage

  // Color stops
  stops: ColorStop[]

  // Metadata
  createdAt: Date
  lastModified: Date
  tags: string[]
}

interface ColorStop {
  id: string
  color: string     // hex, rgb, or hsl
  position: number  // 0-100 percentage
  opacity: number   // 0-1
}

interface GradientBuilderState {
  currentGradient: GradientConfig
  isEditing: boolean
  selectedStopId: string | null
  previewMode: boolean
  recentColors: string[]
  savedGradients: GradientConfig[]
}
```

### Gradient Builder Interface
```typescript
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useBackgroundStore } from '@/stores/background'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { CopyIcon, SaveIcon, ArrowRightLeftIcon, ShuffleIcon } from 'lucide-react'
import { debounce } from 'lodash'
import { cn } from '@/lib/utils'

export default function GradientBuilder() {
  const {
    currentGradient,
    selectedStopId,
    recentColors,
    updateGradient,
    addColorStop,
    removeColorStop,
    selectColorStop,
    applyGradientToCanvas
  } = useBackgroundStore()

  const [isDragging, setIsDragging] = useState(false)
  const gradientBarRef = useRef<HTMLDivElement>(null)

  // Real-time preview update optimized for Next.js client-side performance
  useEffect(() => {
    const debounced = debounce(() => {
      applyGradientToCanvas(currentGradient)
    }, 100)

    debounced()
    return () => debounced.cancel()
  }, [currentGradient, applyGradientToCanvas])

  const handleGradientBarClick = useCallback((event: React.MouseEvent) => {
    if (!gradientBarRef.current) return

    const rect = gradientBarRef.current.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const position = (clickX / rect.width) * 100

    // Add new color stop at click position
    const newStop: ColorStop = {
      id: `stop-${Date.now()}`,
      color: interpolateColorAt(currentGradient.stops, position),
      position: Math.max(0, Math.min(100, position)),
      opacity: 1
    }

    addColorStop(newStop)
    selectColorStop(newStop.id)
  }, [currentGradient.stops, addColorStop, selectColorStop])

  const handleStopDrag = useCallback((stopId: string, position: number) => {
    const clampedPosition = Math.max(0, Math.min(100, position))
    updateGradient({
      ...currentGradient,
      stops: currentGradient.stops.map(stop =>
        stop.id === stopId ? { ...stop, position: clampedPosition } : stop
      )
    })
  }, [currentGradient, updateGradient])

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Gradient Builder</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyGradientCSS(currentGradient)}
          >
            <CopyIcon className="w-4 h-4 mr-1" />
            Copy CSS
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => saveGradient(currentGradient)}
          >
            <SaveIcon className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Gradient Type Selector */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Gradient Type</Label>
        <div className="flex gap-2">
          <Button
            variant={currentGradient.type === 'linear' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateGradient({ ...currentGradient, type: 'linear' })}
          >
            Linear
          </Button>
          <Button
            variant={currentGradient.type === 'radial' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateGradient({ ...currentGradient, type: 'radial' })}
          >
            Radial
          </Button>
        </div>
      </div>

      {/* Gradient Bar */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Colors</Label>
        <div
          ref={gradientBarRef}
          className="relative h-8 rounded cursor-pointer"
          style={{ background: generateGradientCSS(currentGradient) }}
          onClick={handleGradientBarClick}
        >
          {currentGradient.stops.map((stop) => (
            <ColorStopHandle
              key={stop.id}
              stop={stop}
              isSelected={selectedStopId === stop.id}
              onSelect={() => selectColorStop(stop.id)}
              onDrag={(position) => handleStopDrag(stop.id, position)}
              onRemove={() => removeColorStop(stop.id)}
              canRemove={currentGradient.stops.length > 2}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Click on the gradient to add color stops. Drag stops to reposition.
        </p>
      </div>

      {/* Selected Color Stop Editor */}
      {selectedStopId && (
        <ColorStopEditor
          stop={currentGradient.stops.find(s => s.id === selectedStopId)!}
          recentColors={recentColors}
          onChange={(updatedStop) => {
            updateGradient({
              ...currentGradient,
              stops: currentGradient.stops.map(stop =>
                stop.id === selectedStopId ? updatedStop : stop
              )
            })
          }}
        />
      )}

      {/* Direction/Position Controls */}
      {currentGradient.type === 'linear' ? (
        <LinearGradientControls
          angle={currentGradient.angle}
          onChange={(angle) => updateGradient({ ...currentGradient, angle })}
        />
      ) : (
        <RadialGradientControls
          centerX={currentGradient.centerX}
          centerY={currentGradient.centerY}
          radius={currentGradient.radius}
          onChange={(properties) => updateGradient({ ...currentGradient, ...properties })}
        />
      )}

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => reverseGradient(currentGradient)}
        >
          <ArrowRightLeftIcon className="w-4 h-4 mr-1" />
          Reverse
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => randomizeGradient()}
        >
          <ShuffleIcon className="w-4 h-4 mr-1" />
          Random
        </Button>
      </div>
    </div>
  )
}
```

### Color Stop Components
```typescript
'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { ColorPicker } from '@/components/ui/color-picker'
import { cn } from '@/lib/utils'

interface ColorStopHandleProps {
  stop: ColorStop
  isSelected: boolean
  onSelect: () => void
  onDrag: (position: number) => void
  onRemove: () => void
  canRemove: boolean
}

function ColorStopHandle({ stop, isSelected, onSelect, onDrag, onRemove, canRemove }: ColorStopHandleProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    setIsDragging(true)
    onSelect()

    const handleMouseMove = (e: MouseEvent) => {
      const gradientBar = (event.target as HTMLElement).parentElement!
      const rect = gradientBar.getBoundingClientRect()
      const position = ((e.clientX - rect.left) / rect.width) * 100
      onDrag(position)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [onSelect, onDrag])

  const handleDoubleClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (canRemove) {
      onRemove()
    }
  }, [canRemove, onRemove])

  return (
    <div
      className={cn(
        "absolute top-0 w-4 h-8 transform -translate-x-1/2 cursor-pointer",
        "border-2 rounded transition-all",
        isSelected ? "border-primary scale-110" : "border-white shadow-sm",
        isDragging && "scale-125"
      )}
      style={{
        left: `${stop.position}%`,
        backgroundColor: stop.color
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      title={`${stop.color} at ${stop.position.toFixed(1)}%`}
    >
      {canRemove && isSelected && (
        <button
          className="absolute -top-2 -right-1 w-3 h-3 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}

interface ColorStopEditorProps {
  stop: ColorStop
  recentColors: string[]
  onChange: (stop: ColorStop) => void
}

function ColorStopEditor({ stop, recentColors, onChange }: ColorStopEditorProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Color Stop</Label>
        <span className="text-xs text-muted-foreground">
          {stop.position.toFixed(1)}%
        </span>
      </div>

      {/* Color Picker */}
      <div className="space-y-2">
        <Label className="text-xs">Color</Label>
        <ColorPicker
          color={stop.color}
          onChange={(color) => onChange({ ...stop, color })}
          recentColors={recentColors}
        />
      </div>

      {/* Position Control */}
      <div className="space-y-2">
        <Label className="text-xs">Position</Label>
        <div className="flex items-center space-x-2">
          <Slider
            value={[stop.position]}
            onValueChange={([position]) => onChange({ ...stop, position })}
            min={0}
            max={100}
            step={0.1}
            className="flex-1"
          />
          <Input
            value={stop.position.toFixed(1)}
            onChange={(e) => {
              const position = parseFloat(e.target.value)
              if (!isNaN(position)) {
                onChange({ ...stop, position: Math.max(0, Math.min(100, position)) })
              }
            }}
            className="w-16 text-xs"
          />
        </div>
      </div>

      {/* Opacity Control */}
      <div className="space-y-2">
        <Label className="text-xs">Opacity</Label>
        <Slider
          value={[stop.opacity]}
          onValueChange={([opacity]) => onChange({ ...stop, opacity })}
          min={0}
          max={1}
          step={0.01}
          className="w-full"
        />
      </div>
    </div>
  )
}
```

### Gradient Generation Utilities
```typescript
function generateGradientCSS(gradient: GradientConfig): string {
  const stops = gradient.stops
    .sort((a, b) => a.position - b.position)
    .map(stop => {
      const color = stop.opacity < 1
        ? `${stop.color}${Math.round(stop.opacity * 255).toString(16).padStart(2, '0')}`
        : stop.color
      return `${color} ${stop.position}%`
    })
    .join(', ')

  if (gradient.type === 'linear') {
    return `linear-gradient(${gradient.angle}deg, ${stops})`
  } else {
    return `radial-gradient(circle at ${gradient.centerX}% ${gradient.centerY}%, ${stops})`
  }
}

function interpolateColorAt(stops: ColorStop[], position: number): string {
  const sortedStops = [...stops].sort((a, b) => a.position - b.position)

  // Find surrounding stops
  let beforeStop = sortedStops[0]
  let afterStop = sortedStops[sortedStops.length - 1]

  for (let i = 0; i < sortedStops.length - 1; i++) {
    if (position >= sortedStops[i].position && position <= sortedStops[i + 1].position) {
      beforeStop = sortedStops[i]
      afterStop = sortedStops[i + 1]
      break
    }
  }

  if (beforeStop === afterStop) {
    return beforeStop.color
  }

  // Interpolate between colors
  const ratio = (position - beforeStop.position) / (afterStop.position - beforeStop.position)
  return interpolateColors(beforeStop.color, afterStop.color, ratio)
}

function interpolateColors(color1: string, color2: string, ratio: number): string {
  // Convert hex to RGB, interpolate, convert back
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) return color1

  const interpolated = {
    r: Math.round(rgb1.r + (rgb2.r - rgb1.r) * ratio),
    g: Math.round(rgb1.g + (rgb2.g - rgb1.g) * ratio),
    b: Math.round(rgb1.b + (rgb2.b - rgb1.b) * ratio)
  }

  return rgbToHex(interpolated.r, interpolated.g, interpolated.b)
}
```

## Definition of Done

### Functional Requirements
- [ ] Gradient editor supports 2-5 color stops with smooth interpolation
- [ ] Real-time preview updates canvas background immediately
- [ ] Color picker includes hex input, RGB/HSL controls, and recent colors
- [ ] Linear and radial gradient types fully functional
- [ ] Gradient export as CSS code working correctly

### Performance Requirements
- [ ] Gradient preview updates within 100ms of user input
- [ ] Canvas rendering maintains 60fps during gradient editing using Next.js client-side optimizations
- [ ] Color interpolation calculations optimized for smooth interaction
- [ ] Memory usage efficient for complex gradients with Next.js component optimization

### User Experience Requirements
- [ ] Interface intuitive for users without design experience
- [ ] Visual feedback immediate for all gradient adjustments
- [ ] Color stop management clear and discoverable
- [ ] Gradient direction controls easy to understand and use

### Quality Requirements
- [ ] Gradient rendering quality matches professional design tools
- [ ] Color accuracy maintained across different display types
- [ ] Export functionality produces standards-compliant CSS
- [ ] Edge cases handled gracefully (duplicate stops, invalid colors)

## Success Metrics

### Feature Adoption
- **Target:** 70% of users who access background features try gradient builder
- **Measurement:** Analytics tracking gradient editor opens and usage

### Creative Engagement
- **Target:** Users who use gradient builder create average of 3+ gradients per session
- **Measurement:** Gradient creation and modification tracking

### User Satisfaction
- **Target:** 85% of users rate gradient quality as "professional" or higher
- **Measurement:** User surveys and feedback collection

### Performance Metrics
- **Target:** Gradient operations maintain <100ms response time with Next.js optimizations
- **Measurement:** Performance monitoring of gradient generation and preview

## Risk Assessment

### Primary Risk: Complex UI Overwhelming Non-Designers
**Mitigation:**
- Progressive disclosure of advanced features
- Smart defaults that produce attractive results
- Preset gradients for quick selection
- Clear visual feedback and guidance

### Secondary Risk: Performance Impact on Lower-End Devices
**Mitigation:**
- Debounced updates to prevent excessive rendering
- Simplified gradient rendering mode for performance
- Canvas optimization for gradient backgrounds
- Next.js client-side component optimizations for efficient rendering

### Rollback Plan
- Feature flags for gradient builder components
- Fallback to solid color backgrounds if gradient system fails
- Preset library ensures users always have usable options

## Testing Strategy

### Unit Tests
- Gradient CSS generation with various configurations
- Color interpolation accuracy and edge cases
- Color stop management and validation

### Integration Tests
- End-to-end gradient creation and application workflow
- Real-time preview performance and accuracy
- Export functionality and CSS standards compliance

### User Acceptance Tests
- First-time users can create attractive gradients within 2 minutes
- Design-experienced users can achieve specific gradient requirements
- Gradient builder workflow feels natural and efficient