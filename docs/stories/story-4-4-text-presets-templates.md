# Story 4.4: Text Presets & Templates

## Epic
Epic 4: Text Overlays & Annotations

## User Story
As a user,
I want text style presets and templates,
so that I can quickly apply consistent text styling.

## Story Context

**Existing System Integration:**
- Integrates with: Typography controls, text positioning system, text layer management
- Technology: Next.js 15 App Router, Zustand state management with Next.js patterns, JSON-based preset system with SSG optimization
- Follows pattern: Preset management pattern from background preset library (Story 3.2) with Next.js static generation
- Touch points: Text properties panel, preset storage system, import/export functionality with Next.js API routes

## Acceptance Criteria

**Functional Requirements:**
1. Save current text style as reusable preset with custom naming and SSG-optimized storage
2. Pre-built presets available for common uses (title, subtitle, watermark, caption) with static generation
3. Apply preset to existing or new text layers with one-click functionality and client-side state updates

**Template System Requirements:**
4. Text templates include positioned multi-layer text groups (e.g., "Title + Subtitle") with SSG-optimized thumbnails
5. Custom preset management with naming, editing, and deletion capabilities using Next.js client components
6. Import/export presets for team sharing (JSON format) via Next.js API routes
7. Preview shows preset style before application with live sample text and Next.js Image optimization

**Integration Requirements:**
8. Existing text editing functionality continues to work unchanged
9. New preset system follows existing background preset library pattern with Next.js optimization
10. Integration with text layer system maintains current layer management behavior with client-side state

**Quality Requirements:**
11. Preset system is covered by appropriate tests
12. JSON import/export validates format and handles errors gracefully via Next.js API validation
13. No regression in existing text functionality verified

## Technical Notes

- **Integration Approach:** Extends existing text store with preset management slice, following background-store.ts pattern with Next.js SSG optimization
- **Existing Pattern Reference:** Background preset library in story-3-2 for UI patterns and data management with Next.js static generation
- **Key Constraints:** Presets must serialize/deserialize all text properties without data loss, optimized with Next.js static generation

## Technical Implementation

### Text Preset State Management with Next.js SSG
```typescript
'use client'

interface TextPreset {
  id: string
  name: string
  description?: string
  category: 'title' | 'subtitle' | 'body' | 'watermark' | 'caption' | 'custom'
  typography: TypographyStyle
  position?: Partial<TextPosition>
  thumbnail?: string // Next.js optimized thumbnail URL
  isBuiltIn: boolean
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

interface TextTemplate {
  id: string
  name: string
  description?: string
  category: 'layout' | 'title-combo' | 'watermark-set' | 'custom'
  layers: Array<{
    name: string
    content: string
    typography: TypographyStyle
    position: TextPosition
    zIndex: number
  }>
  thumbnail?: string // Next.js optimized thumbnail URL
  dimensions: {
    width: number
    height: number
  }
  isBuiltIn: boolean
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

interface PresetState {
  presets: TextPreset[]
  templates: TextTemplate[]
  categories: string[]
  searchQuery: string
  selectedCategory: string | null
  isLoading: boolean
  error: string | null

  // UI state
  showPresetModal: boolean
  showTemplateModal: boolean
  editingPreset: TextPreset | null
  editingTemplate: TextTemplate | null
}
```

### Static Generation for Built-in Presets
```typescript
// lib/presets/built-in-presets.ts - SSG optimized presets
import { TextPreset, TextTemplate } from '@/types/text-presets'

export const BUILT_IN_PRESETS: TextPreset[] = [
  {
    id: 'preset-title-primary',
    name: 'Primary Title',
    description: 'Large, bold title for main headings',
    category: 'title',
    typography: {
      fontFamily: 'Inter',
      fontSize: 48,
      fontWeight: 700,
      fontStyle: 'normal',
      textDecoration: 'none',
      color: '#000000',
      opacity: 1,
      textAlign: 'center',
      lineHeight: 1.2,
      letterSpacing: -0.02,
      wordSpacing: 0,
      textShadow: null,
      textStroke: null,
      background: null
    },
    thumbnail: '/presets/thumbnails/title-primary.webp',
    isBuiltIn: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    tags: ['title', 'heading', 'bold', 'primary']
  },
  {
    id: 'preset-subtitle-elegant',
    name: 'Elegant Subtitle',
    description: 'Refined subtitle with serif typography',
    category: 'subtitle',
    typography: {
      fontFamily: 'Playfair Display',
      fontSize: 24,
      fontWeight: 400,
      fontStyle: 'italic',
      textDecoration: 'none',
      color: '#333333',
      opacity: 0.9,
      textAlign: 'center',
      lineHeight: 1.4,
      letterSpacing: 0.01,
      wordSpacing: 0,
      textShadow: null,
      textStroke: null,
      background: null
    },
    thumbnail: '/presets/thumbnails/subtitle-elegant.webp',
    isBuiltIn: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    tags: ['subtitle', 'elegant', 'serif', 'secondary']
  },
  {
    id: 'preset-watermark-subtle',
    name: 'Subtle Watermark',
    description: 'Low-opacity watermark text',
    category: 'watermark',
    typography: {
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: 300,
      fontStyle: 'normal',
      textDecoration: 'none',
      color: '#888888',
      opacity: 0.4,
      textAlign: 'right',
      lineHeight: 1.0,
      letterSpacing: 0.05,
      wordSpacing: 0,
      textShadow: null,
      textStroke: null,
      background: null
    },
    position: {
      x: -50, // Relative to bottom-right
      y: -30,
      rotation: -15,
      zIndex: 1000,
      snapToGrid: false,
      gridSize: 10
    },
    thumbnail: '/presets/thumbnails/watermark-subtle.webp',
    isBuiltIn: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    tags: ['watermark', 'subtle', 'transparent', 'corner']
  },
  {
    id: 'preset-caption-modern',
    name: 'Modern Caption',
    description: 'Clean caption text for image descriptions',
    category: 'caption',
    typography: {
      fontFamily: 'Open Sans',
      fontSize: 14,
      fontWeight: 400,
      fontStyle: 'normal',
      textDecoration: 'none',
      color: '#666666',
      opacity: 1,
      textAlign: 'left',
      lineHeight: 1.5,
      letterSpacing: 0,
      wordSpacing: 0,
      textShadow: null,
      textStroke: null,
      background: {
        enabled: true,
        color: '#ffffff',
        opacity: 0.9,
        padding: 8,
        borderRadius: 4
      }
    },
    thumbnail: '/presets/thumbnails/caption-modern.webp',
    isBuiltIn: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    tags: ['caption', 'description', 'modern', 'background']
  }
]

export const BUILT_IN_TEMPLATES: TextTemplate[] = [
  {
    id: 'template-title-subtitle-combo',
    name: 'Title + Subtitle',
    description: 'Professional title and subtitle combination',
    category: 'title-combo',
    layers: [
      {
        name: 'Main Title',
        content: 'Your Title Here',
        typography: BUILT_IN_PRESETS[0].typography, // Primary Title
        position: { x: 400, y: 200, rotation: 0, zIndex: 2, snapToGrid: false, gridSize: 10 },
        zIndex: 2
      },
      {
        name: 'Subtitle',
        content: 'Your subtitle text goes here',
        typography: BUILT_IN_PRESETS[1].typography, // Elegant Subtitle
        position: { x: 400, y: 250, rotation: 0, zIndex: 1, snapToGrid: false, gridSize: 10 },
        zIndex: 1
      }
    ],
    thumbnail: '/templates/thumbnails/title-subtitle-combo.webp',
    dimensions: { width: 800, height: 600 },
    isBuiltIn: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    tags: ['title', 'subtitle', 'combo', 'professional']
  },
  {
    id: 'template-watermark-set',
    name: 'Corner Watermark Set',
    description: 'Complete watermark solution for all corners',
    category: 'watermark-set',
    layers: [
      {
        name: 'Top Left Watermark',
        content: '© Your Brand',
        typography: BUILT_IN_PRESETS[2].typography,
        position: { x: 50, y: 50, rotation: 0, zIndex: 1000, snapToGrid: false, gridSize: 10 },
        zIndex: 1000
      },
      {
        name: 'Bottom Right Watermark',
        content: 'yourwebsite.com',
        typography: BUILT_IN_PRESETS[2].typography,
        position: { x: 650, y: 520, rotation: -15, zIndex: 1000, snapToGrid: false, gridSize: 10 },
        zIndex: 1000
      }
    ],
    thumbnail: '/templates/thumbnails/watermark-set.webp',
    dimensions: { width: 800, height: 600 },
    isBuiltIn: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    tags: ['watermark', 'copyright', 'branding', 'protection']
  }
]
```

### Preset Management Component with Next.js Optimization
```typescript
'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTextStore } from '@/stores/text-store'
import { usePresetStore } from '@/stores/preset-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  SaveIcon,
  DownloadIcon,
  UploadIcon,
  SearchIcon,
  StarIcon,
  PlusIcon,
  EditIcon,
  TrashIcon
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

function TextPresetsPanel() {
  const {
    selectedTextLayer,
    applyPresetToLayer,
    createTextFromTemplate
  } = useTextStore()

  const {
    presets,
    templates,
    categories,
    searchQuery,
    selectedCategory,
    isLoading,
    error,
    savePreset,
    deletePreset,
    loadPresets,
    importPresets,
    exportPresets,
    setSearchQuery,
    setSelectedCategory
  } = usePresetStore()

  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [newPresetName, setNewPresetName] = useState('')
  const [selectedTab, setSelectedTab] = useState<'presets' | 'templates'>('presets')

  // Load presets on mount
  useEffect(() => {
    loadPresets()
  }, [loadPresets])

  // Filter presets based on search and category
  const filteredPresets = useMemo(() => {
    let filtered = presets

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(preset => preset.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(preset =>
        preset.name.toLowerCase().includes(query) ||
        preset.description?.toLowerCase().includes(query) ||
        preset.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return filtered.sort((a, b) => {
      // Built-in presets first, then by name
      if (a.isBuiltIn && !b.isBuiltIn) return -1
      if (!a.isBuiltIn && b.isBuiltIn) return 1
      return a.name.localeCompare(b.name)
    })
  }, [presets, selectedCategory, searchQuery])

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let filtered = templates

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description?.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return filtered.sort((a, b) => {
      if (a.isBuiltIn && !b.isBuiltIn) return -1
      if (!a.isBuiltIn && b.isBuiltIn) return 1
      return a.name.localeCompare(b.name)
    })
  }, [templates, searchQuery])

  // Save current text style as preset
  const handleSavePreset = async () => {
    if (!selectedTextLayer || !newPresetName.trim()) return

    const typography = extractTypographyStyle(selectedTextLayer)
    const position = selectedTextLayer.position

    await savePreset({
      name: newPresetName.trim(),
      description: `Custom preset created from ${selectedTextLayer.content.substring(0, 30)}...`,
      category: 'custom',
      typography,
      position,
      tags: ['custom', 'user-created']
    })

    setNewPresetName('')
    setShowSaveDialog(false)
  }

  // Apply preset to selected layer
  const handleApplyPreset = (preset: TextPreset) => {
    if (!selectedTextLayer) return
    applyPresetToLayer(selectedTextLayer.id, preset)
  }

  // Apply template (create new text layers)
  const handleApplyTemplate = (template: TextTemplate) => {
    createTextFromTemplate(template)
  }

  // Export presets as JSON
  const handleExportPresets = async () => {
    const customPresets = presets.filter(p => !p.isBuiltIn)
    await exportPresets(customPresets)
  }

  // Import presets from JSON
  const handleImportPresets = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      await importPresets(file)
    } catch (error) {
      console.error('Failed to import presets:', error)
    }
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Text Presets</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSaveDialog(true)}
            disabled={!selectedTextLayer}
          >
            <SaveIcon className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPresets}
          >
            <DownloadIcon className="w-4 h-4 mr-1" />
            Export
          </Button>
          <label>
            <Button variant="outline" size="sm" asChild>
              <span>
                <UploadIcon className="w-4 h-4 mr-1" />
                Import
              </span>
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImportPresets}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search presets and templates..."
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="xs"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="xs"
              onClick={() => setSelectedCategory(category)}
            >
              {category.replace('-', ' ')}
            </Button>
          ))}
        </div>
      </div>

      {/* Tabs for Presets and Templates */}
      <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="presets">Style Presets</TabsTrigger>
          <TabsTrigger value="templates">Text Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="space-y-4">
          {/* Save Preset Dialog */}
          {showSaveDialog && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Save Current Style</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder="Enter preset name..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSavePreset()
                    if (e.key === 'Escape') setShowSaveDialog(false)
                  }}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSavePreset}
                    disabled={!newPresetName.trim()}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSaveDialog(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Presets Grid */}
          <div className="grid grid-cols-2 gap-3">
            {filteredPresets.map(preset => (
              <PresetCard
                key={preset.id}
                preset={preset}
                onApply={() => handleApplyPreset(preset)}
                onDelete={preset.isBuiltIn ? undefined : () => deletePreset(preset.id)}
                isDisabled={!selectedTextLayer}
              />
            ))}
          </div>

          {filteredPresets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No presets found</p>
              <p className="text-xs">Try adjusting your search or create a new preset</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          {/* Templates Grid */}
          <div className="grid grid-cols-1 gap-3">
            {filteredTemplates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onApply={() => handleApplyTemplate(template)}
              />
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No templates found</p>
              <p className="text-xs">Try adjusting your search</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  )
}

// Preset Card Component with Next.js Image optimization
interface PresetCardProps {
  preset: TextPreset
  onApply: () => void
  onDelete?: () => void
  isDisabled?: boolean
}

function PresetCard({ preset, onApply, onDelete, isDisabled }: PresetCardProps) {
  return (
    <Card className={cn(
      "cursor-pointer transition-all hover:border-primary",
      isDisabled && "opacity-50 cursor-not-allowed"
    )}>
      <CardContent className="p-3">
        {/* Thumbnail with Next.js optimization */}
        <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden relative">
          {preset.thumbnail ? (
            <Image
              src={preset.thumbnail}
              alt={preset.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-center p-2"
              style={{
                fontFamily: preset.typography.fontFamily,
                fontSize: Math.min(preset.typography.fontSize * 0.3, 16),
                fontWeight: preset.typography.fontWeight,
                fontStyle: preset.typography.fontStyle,
                color: preset.typography.color,
                opacity: preset.typography.opacity,
                textAlign: preset.typography.textAlign
              }}
            >
              Sample Text
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-sm truncate">{preset.name}</h4>
              {preset.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {preset.description}
                </p>
              )}
            </div>
            {preset.isBuiltIn && (
              <StarIcon className="w-3 h-3 text-amber-500 flex-shrink-0" />
            )}
          </div>

          <div className="flex gap-1 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {preset.category}
            </Badge>
            {preset.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-1">
            <Button
              size="sm"
              className="flex-1"
              onClick={onApply}
              disabled={isDisabled}
            >
              Apply
            </Button>
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
              >
                <TrashIcon className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Template Card Component
interface TemplateCardProps {
  template: TextTemplate
  onApply: () => void
}

function TemplateCard({ template, onApply }: TemplateCardProps) {
  return (
    <Card className="cursor-pointer transition-all hover:border-primary">
      <CardContent className="p-3">
        <div className="flex gap-3">
          {/* Thumbnail */}
          <div className="w-20 h-16 bg-muted rounded-lg flex-shrink-0 overflow-hidden relative">
            {template.thumbnail ? (
              <Image
                src={template.thumbnail}
                alt={template.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
                <PlusIcon className="w-6 h-6 text-primary" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-sm truncate">{template.name}</h4>
                {template.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                )}
              </div>
              {template.isBuiltIn && (
                <StarIcon className="w-3 h-3 text-amber-500 flex-shrink-0 ml-2" />
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-1 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  {template.layers.length} layers
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
              </div>

              <Button size="sm" onClick={onApply}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TextPresetsPanel
```

### Next.js API Routes for Preset Management
```typescript
// app/api/presets/route.ts - SSG-optimized preset API
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { BUILT_IN_PRESETS, BUILT_IN_TEMPLATES } from '@/lib/presets/built-in-presets'

const PresetSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  category: z.enum(['title', 'subtitle', 'body', 'watermark', 'caption', 'custom']),
  typography: z.object({
    fontFamily: z.string(),
    fontSize: z.number().min(8).max(200),
    fontWeight: z.number().min(100).max(900),
    fontStyle: z.enum(['normal', 'italic', 'oblique']),
    textDecoration: z.enum(['none', 'underline', 'line-through', 'overline']),
    color: z.string(),
    opacity: z.number().min(0).max(1),
    textAlign: z.enum(['left', 'center', 'right', 'justify']),
    lineHeight: z.number().min(0.8).max(3.0),
    letterSpacing: z.number().min(-0.1).max(1.0),
    wordSpacing: z.number().min(0).max(2.0)
  }),
  position: z.object({
    x: z.number(),
    y: z.number(),
    rotation: z.number().min(-180).max(180),
    zIndex: z.number(),
    snapToGrid: z.boolean(),
    gridSize: z.number().min(5).max(50)
  }).optional(),
  tags: z.array(z.string()).default([])
})

// GET /api/presets - Get all presets (built-in + custom)
export async function GET() {
  try {
    // In a real app, you'd fetch custom presets from database
    // For now, return built-in presets with SSG optimization
    const presets = BUILT_IN_PRESETS
    const templates = BUILT_IN_TEMPLATES

    return NextResponse.json({
      presets,
      templates,
      categories: ['title', 'subtitle', 'body', 'watermark', 'caption', 'custom']
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch presets' },
      { status: 500 }
    )
  }
}

// POST /api/presets - Create new custom preset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = PresetSchema.parse(body)

    // In a real app, save to database
    const newPreset = {
      id: `preset-${Date.now()}`,
      ...validated,
      isBuiltIn: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return NextResponse.json(newPreset, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid preset data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create preset' },
      { status: 500 }
    )
  }
}

// DELETE /api/presets/[id] - Delete custom preset
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Prevent deletion of built-in presets
    if (BUILT_IN_PRESETS.some(preset => preset.id === id)) {
      return NextResponse.json(
        { error: 'Cannot delete built-in preset' },
        { status: 400 }
      )
    }

    // In a real app, delete from database
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete preset' },
      { status: 500 }
    )
  }
}
```

### Static Generation Configuration
```typescript
// next.config.js - Optimize for preset assets
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },

  // Generate static files for preset thumbnails
  generateStaticParams: async () => {
    return [
      { slug: 'presets' },
      { slug: 'templates' }
    ]
  }
}

module.exports = nextConfig
```

## Definition of Done

- [ ] Current text style can be saved as custom preset with naming and SSG optimization
- [ ] Pre-built presets (title, subtitle, watermark, caption) are available and functional with static generation
- [ ] Presets apply correctly to both existing and new text layers with client-side state updates
- [ ] Text templates support multi-layer compositions with relative positioning and SSG thumbnails
- [ ] Custom preset management allows create, edit, delete operations via Next.js API routes
- [ ] JSON import/export works reliably with proper error handling through Next.js API validation
- [ ] Preview functionality shows accurate representation before application with Next.js Image optimization
- [ ] Existing text editing and positioning functionality regression tested
- [ ] Code follows established preset management patterns from background system with Next.js optimization
- [ ] Tests pass (existing and new preset tests)
- [ ] Preset persistence works correctly with SSG and API routes
- [ ] Documentation updated for preset management features

## Risk Assessment

**Primary Risk:** Preset application conflicts with existing text layer properties
**Mitigation:** Implement preset merging logic that preserves user customizations where appropriate using Next.js client-side state management
**Rollback:** Disable preset features while maintaining manual text styling capabilities

## Compatibility Check

- [ ] No breaking changes to existing text layer data structure
- [ ] Preset data additions are backward compatible with SSG optimization
- [ ] UI changes follow existing design patterns from background preset library with Next.js components
- [ ] Performance impact is negligible for preset operations with static generation
- [ ] JSON schema is versioned for future compatibility and API validation