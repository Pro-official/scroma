# Story 2.3: Frame Customization Controls

## Story Overview

**Epic:** Epic 2 - Frame System & Application
**Story ID:** 2.3
**Priority:** Medium
**Status:** Ready for Development
**Estimated Effort:** 8 Story Points
**Sprint Assignment:** Sprint 4
**Dependencies:** Story 2.2 (Frame Application Logic)

## User Story

**As a** user,
**I want to** customize frame properties,
**So that I can** match my brand or design preferences.

## Business Value

- Enables brand consistency and personalization that appeals to business users with Next.js SSG performance
- Provides advanced functionality that justifies premium features and pricing using Next.js optimization
- Differentiates Scroma from basic screenshot tools through professional customization with Next.js features
- Establishes foundation for team brand management and template features leveraging Next.js App Router

## Acceptance Criteria

### Color Customization
1. **Frame Color Control**
   - Color customization available for frames that support it (borders, browser chrome elements) in Next.js client component
   - Color picker with preset swatches, hex input, and RGB/HSL controls using Next.js patterns
   - Real-time preview shows color changes immediately on canvas with Next.js optimization
   - Color selection persists when switching between similar frame types using Next.js client-side state

2. **Brand Color Integration**
   - Recent colors automatically saved for quick reuse with Next.js localStorage integration
   - Popular brand colors available as preset swatches (Google, Apple, Microsoft, etc.) in Next.js component
   - Eyedropper tool to sample colors from uploaded image using Next.js client-side functionality
   - Color accessibility indicators show contrast ratios for readability in Next.js components

### Visual Effects
3. **Opacity Control**
   - Frame opacity adjustment via slider with range 50-100% in Next.js client component
   - Opacity changes show real-time preview without performance lag using Next.js optimization
   - Opacity setting applies to frame elements while preserving content area in Next.js
   - Default opacity optimized for professional appearance (typically 90-95%) with Next.js patterns

4. **Shadow Effects**
   - Drop shadow toggle with on/off switch for clean control in Next.js client component
   - Shadow customization includes offset, blur, and opacity settings using Next.js patterns
   - Shadow presets for common effects (subtle, medium, dramatic) in Next.js component
   - Shadow renders behind frame without affecting content positioning with Next.js CSS

### Spacing and Layout
5. **Padding Adjustment**
   - Padding control adjusts space between image and frame edge (0-100px range) in Next.js client component
   - Uniform padding applied to all sides with optional individual side control using Next.js patterns
   - Padding changes update image positioning automatically with Next.js state management
   - Visual guides show padding area during adjustment in Next.js component

6. **Corner Radius**
   - Corner radius adjustment for custom border frames (0-50px range) in Next.js client component
   - Radius control available only for frames that support rounded corners using Next.js patterns
   - Radius changes apply smoothly with real-time preview in Next.js optimization
   - Extreme values handled gracefully without visual artifacts in Next.js

### Settings Management
7. **Settings Persistence**
   - Customization settings persist when switching between similar frame types using Next.js client-side state
   - Settings automatically saved to user preferences for future sessions with Next.js localStorage
   - Frame-specific settings remember last used configuration using Next.js patterns
   - Settings sync applies to frames within same category (all browser frames share color) in Next.js

8. **Reset Functionality**
   - Reset button returns frame to default settings with single click in Next.js client component
   - Reset confirmation prevents accidental loss of customizations using Next.js patterns
   - Individual property reset available (reset only color, only shadow, etc.) in Next.js component
   - Reset operation included in undo/redo history with Next.js state management

## Technical Implementation

### Frame Properties System
```typescript
interface FrameProperties {
  // Color customization for Next.js
  color: string
  colorOverride: boolean  // Whether frame supports color customization

  // Visual effects for Next.js
  opacity: number  // 0.5 to 1.0
  shadow: ShadowConfig | null

  // Layout properties for Next.js
  padding: PaddingConfig
  cornerRadius: number  // 0 to 50

  // State for Next.js
  isCustomized: boolean
  lastModified: Date
}

interface ShadowConfig {
  enabled: boolean
  offsetX: number
  offsetY: number
  blur: number
  opacity: number
  color: string
}

interface PaddingConfig {
  uniform: boolean
  top: number
  right: number
  bottom: number
  left: number
}

interface FrameCustomization {
  frameId: string
  properties: FrameProperties
  presets: FramePropertyPreset[]
  capabilities: FrameCapabilities
}

interface FrameCapabilities {
  supportsColorCustomization: boolean
  supportsShadow: boolean
  supportsCornerRadius: boolean
  supportsIndividualPadding: boolean
  colorCustomizationAreas: string[]  // ['border', 'chrome', 'background']
}
```

### Frame Customization Panel
```typescript
'use client'

import { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { FrameIcon } from 'lucide-react'
import { debounce } from 'lodash-es'

const FrameCustomizationPanel = () => {
  const {
    activeFrame,
    frameProperties,
    updateFrameProperty,
    resetFrameProperties,
    applyFramePreset
  } = useFrameStore()

  const [tempProperties, setTempProperties] = useState<FrameProperties | null>(null)

  // Update frame properties with real-time preview for Next.js
  const handlePropertyChange = useCallback((
    property: keyof FrameProperties,
    value: any
  ) => {
    const newProperties = {
      ...frameProperties,
      [property]: value,
      isCustomized: true,
      lastModified: new Date()
    }

    setTempProperties(newProperties)

    // Debounced update to store for Next.js optimization
    debouncedUpdateProperty(newProperties)
  }, [frameProperties])

  const debouncedUpdateProperty = useMemo(
    () => debounce((properties: FrameProperties) => {
      updateFrameProperty(properties)
    }, 100),
    [updateFrameProperty]
  )

  if (!activeFrame) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <FrameIcon className="w-12 h-12 mx-auto mb-2" />
        <p>Select a frame to customize</p>
      </div>
    )
  }

  const currentProperties = tempProperties || frameProperties
  const capabilities = activeFrame.capabilities

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Customize Frame</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => resetFrameProperties(activeFrame.id)}
          disabled={!currentProperties.isCustomized}
        >
          Reset
        </Button>
      </div>

      {/* Color Customization for Next.js */}
      {capabilities.supportsColorCustomization && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Color</Label>
          <FrameColorPicker
            value={currentProperties.color}
            onChange={(color) => handlePropertyChange('color', color)}
            presets={BRAND_COLOR_PRESETS}
            recentColors={getRecentColors()}
          />
        </div>
      )}

      {/* Opacity Control for Next.js */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Opacity</Label>
          <span className="text-xs text-muted-foreground">
            {Math.round(currentProperties.opacity * 100)}%
          </span>
        </div>
        <Slider
          value={[currentProperties.opacity]}
          onValueChange={([value]) => handlePropertyChange('opacity', value)}
          min={0.5}
          max={1.0}
          step={0.05}
          className="w-full"
        />
      </div>

      {/* Shadow Control for Next.js */}
      {capabilities.supportsShadow && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Drop Shadow</Label>
            <Switch
              checked={currentProperties.shadow?.enabled || false}
              onCheckedChange={(enabled) => handlePropertyChange('shadow', {
                ...currentProperties.shadow,
                enabled
              })}
            />
          </div>

          {currentProperties.shadow?.enabled && (
            <ShadowCustomization
              shadow={currentProperties.shadow}
              onChange={(shadow) => handlePropertyChange('shadow', shadow)}
            />
          )}
        </div>
      )}

      {/* Padding Control for Next.js */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Padding</Label>
        <PaddingControl
          padding={currentProperties.padding}
          onChange={(padding) => handlePropertyChange('padding', padding)}
          allowIndividual={capabilities.supportsIndividualPadding}
        />
      </div>

      {/* Corner Radius for Next.js */}
      {capabilities.supportsCornerRadius && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Corner Radius</Label>
            <span className="text-xs text-muted-foreground">
              {currentProperties.cornerRadius}px
            </span>
          </div>
          <Slider
            value={[currentProperties.cornerRadius]}
            onValueChange={([value]) => handlePropertyChange('cornerRadius', value)}
            min={0}
            max={50}
            step={1}
            className="w-full"
          />
        </div>
      )}

      {/* Property Presets for Next.js */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Style Presets</Label>
        <FramePropertyPresets
          frameId={activeFrame.id}
          currentProperties={currentProperties}
          onPresetApply={applyFramePreset}
        />
      </div>
    </div>
  )
}
```

### Color Picker Component
```typescript
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const FrameColorPicker = ({
  value,
  onChange,
  presets,
  recentColors
}: {
  value: string
  onChange: (color: string) => void
  presets: string[]
  recentColors: string[]
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [customColor, setCustomColor] = useState(value)

  return (
    <div className="space-y-3">
      {/* Current Color Display for Next.js */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded border-2 border-muted cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => setIsPickerOpen(!isPickerOpen)}
        />
        <div className="flex-1">
          <Input
            value={value}
            onChange={(e) => {
              setCustomColor(e.target.value)
              if (isValidColor(e.target.value)) {
                onChange(e.target.value)
              }
            }}
            placeholder="#000000"
            className="text-sm font-mono"
          />
        </div>
      </div>

      {/* Color Presets for Next.js */}
      <div className="grid grid-cols-8 gap-2">
        {presets.map((color) => (
          <button
            key={color}
            className={cn(
              "w-6 h-6 rounded border-2 cursor-pointer transition-transform",
              value === color ? "border-primary scale-110" : "border-muted hover:scale-105"
            )}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            title={color}
          />
        ))}
      </div>

      {/* Recent Colors for Next.js */}
      {recentColors.length > 0 && (
        <div>
          <Label className="text-xs text-muted-foreground">Recent</Label>
          <div className="grid grid-cols-8 gap-2 mt-1">
            {recentColors.map((color, index) => (
              <button
                key={`${color}-${index}`}
                className="w-6 h-6 rounded border border-muted cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => onChange(color)}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Advanced Color Picker for Next.js */}
      {isPickerOpen && (
        <div className="relative">
          <ColorPicker
            color={customColor}
            onChange={setCustomColor}
            onChangeComplete={(color) => {
              onChange(color.hex)
              addToRecentColors(color.hex)
            }}
          />
        </div>
      )}
    </div>
  )
}
```

### Padding Control Component
```typescript
'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'

const PaddingControl = ({
  padding,
  onChange,
  allowIndividual
}: {
  padding: PaddingConfig
  onChange: (padding: PaddingConfig) => void
  allowIndividual: boolean
}) => {
  const [isIndividual, setIsIndividual] = useState(!padding.uniform)

  const handleUniformChange = (value: number) => {
    onChange({
      uniform: true,
      top: value,
      right: value,
      bottom: value,
      left: value
    })
  }

  const handleIndividualChange = (side: keyof PaddingConfig, value: number) => {
    onChange({
      ...padding,
      uniform: false,
      [side]: value
    })
  }

  return (
    <div className="space-y-3">
      {allowIndividual && (
        <div className="flex items-center space-x-2">
          <Switch
            checked={isIndividual}
            onCheckedChange={(checked) => {
              setIsIndividual(checked)
              if (!checked) {
                // Convert to uniform padding for Next.js
                const averagePadding = (padding.top + padding.right + padding.bottom + padding.left) / 4
                handleUniformChange(Math.round(averagePadding))
              }
            }}
          />
          <Label className="text-sm">Individual sides</Label>
        </div>
      )}

      {!isIndividual ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">All sides</Label>
            <span className="text-xs text-muted-foreground">{padding.top}px</span>
          </div>
          <Slider
            value={[padding.top]}
            onValueChange={([value]) => handleUniformChange(value)}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {/* Top for Next.js */}
          <div className="space-y-1">
            <Label className="text-xs">Top</Label>
            <div className="flex items-center space-x-2">
              <Slider
                value={[padding.top]}
                onValueChange={([value]) => handleIndividualChange('top', value)}
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs w-8">{padding.top}px</span>
            </div>
          </div>

          {/* Right for Next.js */}
          <div className="space-y-1">
            <Label className="text-xs">Right</Label>
            <div className="flex items-center space-x-2">
              <Slider
                value={[padding.right]}
                onValueChange={([value]) => handleIndividualChange('right', value)}
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs w-8">{padding.right}px</span>
            </div>
          </div>

          {/* Bottom for Next.js */}
          <div className="space-y-1">
            <Label className="text-xs">Bottom</Label>
            <div className="flex items-center space-x-2">
              <Slider
                value={[padding.bottom]}
                onValueChange={([value]) => handleIndividualChange('bottom', value)}
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs w-8">{padding.bottom}px</span>
            </div>
          </div>

          {/* Left for Next.js */}
          <div className="space-y-1">
            <Label className="text-xs">Left</Label>
            <div className="flex items-center space-x-2">
              <Slider
                value={[padding.left]}
                onValueChange={([value]) => handleIndividualChange('left', value)}
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs w-8">{padding.left}px</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

## Definition of Done

### Functional Requirements
- [ ] All customization controls work with real-time preview in Next.js client components
- [ ] Color picker supports hex input, swatches, and recent colors using Next.js patterns
- [ ] Opacity, shadow, padding, and corner radius controls functional in Next.js components
- [ ] Settings persist across frame switches and application sessions with Next.js client-side state
- [ ] Reset functionality returns frame to default state using Next.js state management

### Performance Requirements
- [ ] Property changes update preview within 100ms with Next.js optimization
- [ ] Customization panel renders smoothly with 60fps interactions using Next.js patterns
- [ ] Real-time preview doesn't impact canvas performance in Next.js client components
- [ ] Property persistence doesn't cause UI lag with Next.js localStorage integration

### User Experience Requirements
- [ ] Customization controls intuitive without training in Next.js components
- [ ] Visual feedback immediate for all property changes with Next.js optimization
- [ ] Property ranges and limits clearly communicated in Next.js UI
- [ ] Reset options prevent accidental loss of work using Next.js patterns

### Accessibility Requirements
- [ ] All controls accessible via keyboard navigation in Next.js components
- [ ] Color picker includes accessibility features with Next.js patterns
- [ ] Screen readers announce property values and changes in Next.js components
- [ ] Focus indicators visible for all interactive elements in Next.js app

## Success Metrics

### Feature Adoption
- **Target:** 60% of users who apply frames customize at least one property
- **Measurement:** Analytics tracking customization panel usage with Next.js analytics

### Customization Depth
- **Target:** Users who customize modify average of 2.5 properties per frame
- **Measurement:** Property change tracking and usage patterns with Next.js event tracking

### User Satisfaction
- **Target:** 80% of users rate customization options as "sufficient" or higher
- **Measurement:** User surveys and feedback collection with Next.js forms

### Performance Impact
- **Target:** Customization operations maintain <100ms response time
- **Measurement:** Performance monitoring of property update duration with Next.js performance tools

## Risk Assessment

### Primary Risk: Real-time Preview Performance in Next.js
**Mitigation:**
- Debounced property updates to prevent excessive rendering with Next.js optimization
- Optimized canvas rendering for property changes using Next.js patterns
- Performance monitoring with automatic quality degradation in Next.js

### Secondary Risk: Overwhelming User Interface in Next.js
**Mitigation:**
- Progressive disclosure of advanced options in Next.js components
- Smart defaults that produce good results with Next.js patterns
- Clear categorization and organization of controls in Next.js UI

### Rollback Plan
- Feature flags for individual customization components in Next.js
- Fallback to basic frame application if customization fails in Next.js
- Property preset system for quick recovery from issues with Next.js state management

## Testing Strategy

### Unit Tests
- Property validation and range checking in Next.js environment
- Color picker functionality with various input formats in Next.js components
- Settings persistence and restoration logic with Next.js localStorage

### Integration Tests
- End-to-end customization workflow in Next.js app
- Real-time preview performance and accuracy with Next.js optimization
- Cross-browser compatibility for color picker in Next.js environment

### User Acceptance Tests
- First-time users can successfully customize frame properties in Next.js app
- Power users can achieve specific brand color matching with Next.js components
- Customization workflow feels natural and efficient in Next.js interface