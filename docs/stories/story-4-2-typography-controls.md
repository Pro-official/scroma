# Story 4.2: Typography Controls

## Story Overview

**Epic:** Epic 4 - Text Overlays & Annotations
**Story ID:** 4.2
**Priority:** High
**Status:** Ready for Development
**Estimated Effort:** 13 Story Points
**Sprint Assignment:** Sprint 7-8
**Dependencies:** Story 4.1 (Text Tool Foundation)

## User Story

**As a** user,
**I want to** have complete control over text appearance,
**So that I can** match my design requirements and create professional typography.

## Business Value

- Provides professional-grade typography control that matches expensive design software
- Enables brand consistency and corporate design requirements for business users
- Differentiates Scroma from basic text annotation tools through advanced typography
- Establishes foundation for design system integration and team typography standards
- Leverages Next.js font optimization for improved performance and user experience
- Utilizes Next.js SSG capabilities for optimized font loading and caching strategies

## Acceptance Criteria

### Font Management
1. **Font Selection System**
   - Font dropdown with minimum 10 high-quality web fonts including sans-serif and serif options
   - Font preview showing actual font appearance in dropdown menu
   - Font categories organized by type (Sans-serif, Serif, Monospace, Display)
   - Font search functionality for quick font discovery in larger libraries
   - Next.js font optimization for improved loading performance

2. **Font Loading and Performance**
   - Web fonts load asynchronously without blocking text editing using Next.js font optimization
   - Font fallbacks ensure text remains readable during font loading
   - Font caching provides instant switching for previously loaded fonts with Next.js built-in optimization
   - Custom font upload capability for brand-specific typography (future enhancement)
   - Static font generation at build time for improved performance

### Text Styling Controls
3. **Font Size and Weight**
   - Font size adjustment via slider (8px-200px) with direct input field
   - Font weight options (Light, Normal, Medium, Semi-Bold, Bold, Extra Bold)
   - Font style toggles for italic and oblique variations
   - Text decoration options (none, underline, line-through, overline)

4. **Color and Opacity**
   - Color picker with hex input, RGB sliders, and HSL controls
   - Opacity control for text transparency effects (0-100%)
   - Recent colors automatically saved for quick reuse
   - Color accessibility indicators showing contrast ratios with background

5. **Text Alignment and Spacing**
   - Text alignment options (left, center, right, justify) with visual indicators
   - Line height adjustment (0.8x to 3.0x) for proper vertical spacing
   - Letter spacing control (-0.1em to 1.0em) for character spacing adjustment
   - Word spacing control for fine-tuned text spacing

### Advanced Typography
6. **Text Effects and Shadows**
   - Text shadow toggle with offset, blur, and color controls
   - Shadow presets for common effects (subtle, medium, dramatic)
   - Text outline/stroke option with width and color controls
   - Text background highlight with color and padding options

7. **Real-time Preview System**
   - All typography changes apply immediately to selected text layer with client-side optimization
   - Typography panel updates when different text layers selected
   - Live preview maintains text editability during style adjustments
   - Typography changes integrated with undo/redo system
   - Client-side state management for responsive typography controls

## Technical Implementation

### Typography State Management
```typescript
interface TypographyStyle {
  // Font properties
  fontFamily: string
  fontSize: number  // in pixels
  fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  fontStyle: 'normal' | 'italic' | 'oblique'
  textDecoration: 'none' | 'underline' | 'line-through' | 'overline'

  // Color and opacity
  color: string
  opacity: number  // 0-1

  // Spacing and alignment
  textAlign: 'left' | 'center' | 'right' | 'justify'
  lineHeight: number  // multiplier (e.g., 1.5)
  letterSpacing: number  // in em units
  wordSpacing: number  // in em units

  // Effects
  textShadow: TextShadow | null
  textStroke: TextStroke | null
  background: TextBackground | null
}

interface TextShadow {
  enabled: boolean
  offsetX: number
  offsetY: number
  blur: number
  color: string
  opacity: number
}

interface TextStroke {
  enabled: boolean
  width: number
  color: string
  opacity: number
}

interface TextBackground {
  enabled: boolean
  color: string
  opacity: number
  padding: number
  borderRadius: number
}

interface FontDefinition {
  family: string
  displayName: string
  category: 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting'
  weights: number[]
  styles: ('normal' | 'italic')[]
  source: 'google' | 'system' | 'custom'
  previewText: string
  popularityScore: number
  nextjsVariable?: string  // Next.js font variable for optimization
}

interface TypographyState {
  availableFonts: FontDefinition[]
  loadedFonts: Set<string>
  recentFonts: string[]
  favoriteColors: string[]
  typographyPresets: TypographyPreset[]

  // UI state
  activeFontCategory: string | null
  fontSearchQuery: string
  showAdvancedControls: boolean
}
```

### Next.js Font Configuration
```typescript
// fonts/index.ts - Next.js font optimization
import { Inter, Roboto, Open_Sans, Playfair_Display, Merriweather, JetBrains_Mono, Fira_Code } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
})

export const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
})

export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
})

export const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-merriweather',
  display: 'swap',
})

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
})

// Font definitions with Next.js optimization
export const OPTIMIZED_FONTS: FontDefinition[] = [
  // Sans-serif fonts
  {
    family: 'Inter',
    displayName: 'Inter',
    category: 'sans-serif',
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    styles: ['normal', 'italic'],
    source: 'google',
    previewText: 'The quick brown fox jumps over the lazy dog',
    popularityScore: 95,
    nextjsVariable: '--font-inter'
  },
  {
    family: 'Roboto',
    displayName: 'Roboto',
    category: 'sans-serif',
    weights: [100, 300, 400, 500, 700, 900],
    styles: ['normal', 'italic'],
    source: 'google',
    previewText: 'Modern and friendly',
    popularityScore: 90,
    nextjsVariable: '--font-roboto'
  },
  {
    family: 'Open Sans',
    displayName: 'Open Sans',
    category: 'sans-serif',
    weights: [300, 400, 500, 600, 700, 800],
    styles: ['normal', 'italic'],
    source: 'google',
    previewText: 'Highly legible and versatile',
    popularityScore: 88,
    nextjsVariable: '--font-open-sans'
  },

  // Serif fonts
  {
    family: 'Playfair Display',
    displayName: 'Playfair Display',
    category: 'serif',
    weights: [400, 500, 600, 700, 800, 900],
    styles: ['normal', 'italic'],
    source: 'google',
    previewText: 'Elegant and sophisticated',
    popularityScore: 85,
    nextjsVariable: '--font-playfair-display'
  },
  {
    family: 'Merriweather',
    displayName: 'Merriweather',
    category: 'serif',
    weights: [300, 400, 700, 900],
    styles: ['normal', 'italic'],
    source: 'google',
    previewText: 'Designed for reading',
    popularityScore: 80,
    nextjsVariable: '--font-merriweather'
  },

  // Monospace fonts
  {
    family: 'JetBrains Mono',
    displayName: 'JetBrains Mono',
    category: 'monospace',
    weights: [100, 200, 300, 400, 500, 600, 700, 800],
    styles: ['normal', 'italic'],
    source: 'google',
    previewText: 'const code = "beautiful";',
    popularityScore: 75,
    nextjsVariable: '--font-jetbrains-mono'
  },
  {
    family: 'Fira Code',
    displayName: 'Fira Code',
    category: 'monospace',
    weights: [300, 400, 500, 600, 700],
    styles: ['normal'],
    source: 'google',
    previewText: '() => { return true; }',
    popularityScore: 72,
    nextjsVariable: '--font-fira-code'
  }
]
```

### Typography Controls Component
```typescript
'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTextStore } from '@/stores/text-store'
import { debounce } from 'lodash'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  TypeIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ColorPicker } from '@/components/ui/color-picker'
import { TextEffectsPanel } from './text-effects-panel'
import { FontSelector } from './font-selector'

function TypographyControls() {
  const {
    selectedTextLayer,
    updateTextLayer,
    availableFonts,
    recentFonts,
    favoriteColors,
    loadFont
  } = useTextStore()

  const [localStyle, setLocalStyle] = useState<TypographyStyle | null>(null)

  // Update local style when selection changes
  useEffect(() => {
    if (selectedTextLayer) {
      setLocalStyle(extractTypographyStyle(selectedTextLayer))
    } else {
      setLocalStyle(null)
    }
  }, [selectedTextLayer])

  // Debounced update to store with Next.js optimization
  const debouncedUpdate = useMemo(
    () => debounce((style: TypographyStyle) => {
      if (selectedTextLayer) {
        updateTextLayer(selectedTextLayer.id, applyTypographyStyle(style))
      }
    }, 150),
    [selectedTextLayer, updateTextLayer]
  )

  const handleStyleChange = useCallback((
    property: keyof TypographyStyle,
    value: any
  ) => {
    if (!localStyle) return

    const updatedStyle = { ...localStyle, [property]: value }
    setLocalStyle(updatedStyle)
    debouncedUpdate(updatedStyle)
  }, [localStyle, debouncedUpdate])

  if (!selectedTextLayer || !localStyle) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <TypeIcon className="w-8 h-8 mx-auto mb-2" />
        <p>Select a text layer to edit typography</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Typography</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => resetTypography(selectedTextLayer.id)}
        >
          Reset
        </Button>
      </div>

      {/* Font Selection with Next.js optimization */}
      <FontSelector
        selectedFont={localStyle.fontFamily}
        availableFonts={availableFonts}
        recentFonts={recentFonts}
        onFontChange={(font) => {
          handleStyleChange('fontFamily', font)
          loadFont(font)
        }}
      />

      {/* Size and Weight */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Size</Label>
          <div className="flex items-center space-x-2">
            <Slider
              value={[localStyle.fontSize]}
              onValueChange={([size]) => handleStyleChange('fontSize', size)}
              min={8}
              max={200}
              step={1}
              className="flex-1"
            />
            <Input
              value={localStyle.fontSize}
              onChange={(e) => {
                const size = parseInt(e.target.value)
                if (!isNaN(size)) {
                  handleStyleChange('fontSize', Math.max(8, Math.min(200, size)))
                }
              }}
              className="w-16 text-xs"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Weight</Label>
          <Select
            value={localStyle.fontWeight.toString()}
            onValueChange={(weight) => handleStyleChange('fontWeight', parseInt(weight))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100">Thin</SelectItem>
              <SelectItem value="200">Extra Light</SelectItem>
              <SelectItem value="300">Light</SelectItem>
              <SelectItem value="400">Normal</SelectItem>
              <SelectItem value="500">Medium</SelectItem>
              <SelectItem value="600">Semi Bold</SelectItem>
              <SelectItem value="700">Bold</SelectItem>
              <SelectItem value="800">Extra Bold</SelectItem>
              <SelectItem value="900">Black</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Style Toggles */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Style</Label>
        <div className="flex items-center gap-2">
          <Button
            variant={localStyle.fontStyle === 'italic' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStyleChange('fontStyle',
              localStyle.fontStyle === 'italic' ? 'normal' : 'italic'
            )}
          >
            <ItalicIcon className="w-4 h-4" />
          </Button>

          <Button
            variant={localStyle.textDecoration === 'underline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStyleChange('textDecoration',
              localStyle.textDecoration === 'underline' ? 'none' : 'underline'
            )}
          >
            <UnderlineIcon className="w-4 h-4" />
          </Button>

          <Button
            variant={localStyle.textDecoration === 'line-through' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStyleChange('textDecoration',
              localStyle.textDecoration === 'line-through' ? 'none' : 'line-through'
            )}
          >
            <StrikethroughIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Color */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Color</Label>
        <ColorPicker
          color={localStyle.color}
          opacity={localStyle.opacity}
          onChange={(color, opacity) => {
            handleStyleChange('color', color)
            handleStyleChange('opacity', opacity)
          }}
          recentColors={favoriteColors}
        />
      </div>

      {/* Alignment */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Alignment</Label>
        <div className="flex items-center gap-1">
          {[
            { value: 'left', icon: AlignLeftIcon },
            { value: 'center', icon: AlignCenterIcon },
            { value: 'right', icon: AlignRightIcon },
            { value: 'justify', icon: AlignJustifyIcon }
          ].map(({ value, icon: Icon }) => (
            <Button
              key={value}
              variant={localStyle.textAlign === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStyleChange('textAlign', value)}
            >
              <Icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Spacing</Label>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Line Height</Label>
            <span className="text-xs text-muted-foreground">
              {localStyle.lineHeight.toFixed(1)}
            </span>
          </div>
          <Slider
            value={[localStyle.lineHeight]}
            onValueChange={([height]) => handleStyleChange('lineHeight', height)}
            min={0.8}
            max={3.0}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Letter Spacing</Label>
            <span className="text-xs text-muted-foreground">
              {localStyle.letterSpacing.toFixed(2)}em
            </span>
          </div>
          <Slider
            value={[localStyle.letterSpacing]}
            onValueChange={([spacing]) => handleStyleChange('letterSpacing', spacing)}
            min={-0.1}
            max={1.0}
            step={0.01}
            className="w-full"
          />
        </div>
      </div>

      {/* Text Effects */}
      <TextEffectsPanel
        textShadow={localStyle.textShadow}
        textStroke={localStyle.textStroke}
        textBackground={localStyle.textBackground}
        onShadowChange={(shadow) => handleStyleChange('textShadow', shadow)}
        onStrokeChange={(stroke) => handleStyleChange('textStroke', stroke)}
        onBackgroundChange={(background) => handleStyleChange('textBackground', background)}
      />
    </div>
  )
}

export default TypographyControls
```

### Font Selector Component with Next.js Optimization
```typescript
'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronDownIcon, SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FontDefinition } from '@/types/typography'

interface FontSelectorProps {
  selectedFont: string
  availableFonts: FontDefinition[]
  recentFonts: string[]
  onFontChange: (font: string) => void
}

function FontSelector({ selectedFont, availableFonts, recentFonts, onFontChange }: FontSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = ['sans-serif', 'serif', 'monospace', 'display']

  const filteredFonts = useMemo(() => {
    let fonts = availableFonts

    // Apply category filter
    if (activeCategory) {
      fonts = fonts.filter(font => font.category === activeCategory)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      fonts = fonts.filter(font =>
        font.displayName.toLowerCase().includes(query) ||
        font.category.toLowerCase().includes(query)
      )
    }

    // Sort by popularity
    return fonts.sort((a, b) => b.popularityScore - a.popularityScore)
  }, [availableFonts, activeCategory, searchQuery])

  const recentFontDefinitions = useMemo(() =>
    recentFonts.map(fontFamily =>
      availableFonts.find(font => font.family === fontFamily)
    ).filter(Boolean).slice(0, 5)
  , [recentFonts, availableFonts])

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Font Family</Label>

      {/* Current Font Display with Next.js font variables */}
      <button
        className="w-full p-3 border rounded-lg text-left flex items-center justify-between hover:border-primary transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <p
            className="font-medium"
            style={{
              fontFamily: `var(${availableFonts.find(f => f.family === selectedFont)?.nextjsVariable || '--font-inter'}), ${selectedFont}`
            }}
          >
            {availableFonts.find(f => f.family === selectedFont)?.displayName || selectedFont}
          </p>
          <p
            className="text-sm text-muted-foreground"
            style={{
              fontFamily: `var(${availableFonts.find(f => f.family === selectedFont)?.nextjsVariable || '--font-inter'}), ${selectedFont}`
            }}
          >
            The quick brown fox jumps
          </p>
        </div>
        <ChevronDownIcon className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {/* Font Picker Modal */}
      {isOpen && (
        <div className="absolute z-50 w-80 bg-background border rounded-lg shadow-lg max-h-96 overflow-hidden">
          <div className="p-3 border-b">
            <div className="relative mb-3">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fonts..."
                className="pl-9"
              />
            </div>

            <div className="flex gap-1">
              <Button
                variant={!activeCategory ? 'default' : 'outline'}
                size="xs"
                onClick={() => setActiveCategory(null)}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={activeCategory === category ? 'default' : 'outline'}
                  size="xs"
                  onClick={() => setActiveCategory(category)}
                >
                  {category.replace('-', ' ')}
                </Button>
              ))}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {/* Recent Fonts */}
            {recentFontDefinitions.length > 0 && !searchQuery && (
              <div className="p-3 border-b">
                <Label className="text-xs text-muted-foreground mb-2 block">Recent</Label>
                {recentFontDefinitions.map(font => (
                  <FontOption
                    key={font.family}
                    font={font}
                    isSelected={selectedFont === font.family}
                    onClick={() => {
                      onFontChange(font.family)
                      setIsOpen(false)
                    }}
                  />
                ))}
              </div>
            )}

            {/* Font List */}
            <div className="p-3">
              {filteredFonts.length > 0 ? (
                filteredFonts.map(font => (
                  <FontOption
                    key={font.family}
                    font={font}
                    isSelected={selectedFont === font.family}
                    onClick={() => {
                      onFontChange(font.family)
                      setIsOpen(false)
                    }}
                  />
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">No fonts found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface FontOptionProps {
  font: FontDefinition
  isSelected: boolean
  onClick: () => void
}

function FontOption({ font, isSelected, onClick }: FontOptionProps) {
  return (
    <button
      className={cn(
        "w-full p-2 rounded text-left transition-colors mb-1",
        isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted"
      )}
      onClick={onClick}
    >
      <p
        className="font-medium text-sm"
        style={{
          fontFamily: `var(${font.nextjsVariable || '--font-inter'}), ${font.family}`
        }}
      >
        {font.displayName}
      </p>
      <p
        className="text-xs opacity-80"
        style={{
          fontFamily: `var(${font.nextjsVariable || '--font-inter'}), ${font.family}`
        }}
      >
        {font.previewText}
      </p>
    </button>
  )
}

export default FontSelector
```

## Definition of Done

### Functional Requirements
- [ ] Font selection system with minimum 10 professional web fonts optimized with Next.js
- [ ] Complete typography controls (size, weight, style, color, alignment, spacing)
- [ ] Text effects including shadow, stroke, and background options
- [ ] Real-time preview of all typography changes with client-side optimization
- [ ] Typography settings persist across text layer selections

### Performance Requirements
- [ ] Font loading optimized with Next.js font optimization and caching
- [ ] Typography changes apply within 100ms for responsive feedback with client-side state
- [ ] Font picker renders smoothly with large font collections using Next.js optimization
- [ ] Text rendering maintains quality at all sizes and zoom levels

### User Experience Requirements
- [ ] Typography controls intuitive for both designers and non-designers
- [ ] Font preview helps users make informed selections with Next.js font loading
- [ ] Color accessibility features support inclusive design
- [ ] Typography panel responsive and works on different screen sizes

### Quality Requirements
- [ ] Font rendering quality matches professional design tools with Next.js optimization
- [ ] Typography export preserves all styling in final output
- [ ] Text accessibility maintained with proper contrast ratios
- [ ] Cross-browser consistency for font rendering and effects

## Success Metrics

### Feature Adoption
- **Target:** 80% of users who add text customize at least one typography property
- **Measurement:** Analytics tracking typography control usage

### Typography Sophistication
- **Target:** Users who customize typography modify average of 3+ properties
- **Measurement:** Typography property change tracking and usage patterns

### Font Discovery
- **Target:** 50% of users try multiple fonts before settling on choice
- **Measurement:** Font selection and switching behavior analysis

### Professional Output
- **Target:** 75% of text-enhanced mockups use professional typography combinations
- **Measurement:** Typography quality assessment and export analysis

## Risk Assessment

### Primary Risk: Font Loading Performance Impact
**Mitigation:**
- Implement Next.js font optimization for popular fonts
- Use font display: swap for immediate text rendering
- Progressive font enhancement without blocking
- Static font generation at build time

### Secondary Risk: Typography UI Complexity
**Mitigation:**
- Progressive disclosure of advanced typography options
- Smart defaults that produce professional results
- Typography presets for quick application

### Rollback Plan
- Feature flags for typography components
- Fallback to system fonts if web fonts fail to load
- Simplified typography controls if advanced features cause issues

## Testing Strategy

### Unit Tests
- Font loading and caching logic with Next.js optimization
- Typography property validation and application
- Color accessibility calculation accuracy

### Integration Tests
- End-to-end typography customization workflow
- Cross-browser font rendering consistency with Next.js fonts
- Typography preservation through export process

### Accessibility Tests
- Color contrast compliance with various backgrounds
- Typography readability across different font sizes
- Screen reader compatibility with typography controls