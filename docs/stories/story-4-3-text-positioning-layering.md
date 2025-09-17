# Story 4.3: Text Positioning & Layering

## Epic
Epic 4: Text Overlays & Annotations

## User Story
As a user,
I want precise control over text placement,
so that I can position text exactly where needed.

## Story Context

**Existing System Integration:**
- Integrates with: Canvas display system, text tool foundation, typography controls
- Technology: Next.js 15 App Router, Fabric.js canvas manipulation, Zustand state management with Next.js patterns
- Follows pattern: Direct manipulation pattern established in canvas viewport component with Next.js client optimization
- Touch points: Text layer selection system, canvas event handlers, positioning controls with client-side state management

## Acceptance Criteria

**Functional Requirements:**
1. Drag to move text anywhere on canvas with smooth visual feedback using client-side optimization
2. Smart guides show alignment with other elements (text layers, frame edges, canvas center) with real-time calculation
3. Keyboard arrow keys allow pixel-precise positioning (1px steps, 10px with Shift) with client-side state updates

**Integration Requirements:**
4. Existing canvas zoom and pan functionality continues to work unchanged during text positioning
5. New positioning follows existing canvas coordinate system pattern with Next.js client components
6. Integration with text selection system maintains current selection behavior with optimized state management

**Advanced Positioning Requirements:**
7. Layer order controls (bring forward, send back, bring to front, send to back) with instant client-side updates
8. Rotation handle allows text angle adjustment (-180° to +180°) with smooth client-side rendering
9. Snap-to-grid option for consistent alignment with configurable grid size and client-side calculations
10. Position coordinates display with manual input option (X, Y values) using controlled components

**Quality Requirements:**
11. Positioning is covered by unit and integration tests
12. Drag performance maintains 60fps during movement with optimized client-side state
13. No regression in existing text editing functionality verified

## Technical Notes

- **Integration Approach:** Extends existing canvas event handling system with text-specific drag logic using Next.js client components
- **Existing Pattern Reference:** Follow canvas-viewport.tsx drag patterns for image manipulation with Next.js optimization
- **Key Constraints:** Must work seamlessly with existing zoom/pan controls without mode conflicts, leveraging client-side state management

## Technical Implementation

### Text Positioning State Management
```typescript
'use client'

interface TextPosition {
  x: number
  y: number
  rotation: number
  zIndex: number
  snapToGrid: boolean
  gridSize: number
}

interface TextLayer {
  id: string
  content: string
  position: TextPosition
  typography: TypographyStyle
  isSelected: boolean
  isEditing: boolean
  bounds: {
    width: number
    height: number
    top: number
    left: number
    right: number
    bottom: number
  }
}

interface PositioningState {
  dragState: {
    isDragging: boolean
    dragTarget: string | null
    startPosition: { x: number; y: number }
    offset: { x: number; y: number }
  }

  alignmentGuides: {
    visible: boolean
    horizontal: number[]
    vertical: number[]
    snapThreshold: number
  }

  gridSettings: {
    enabled: boolean
    size: number
    visible: boolean
    color: string
    opacity: number
  }

  layerOrder: string[]
  selectedLayers: string[]
}
```

### Text Positioning Component
```typescript
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTextStore } from '@/stores/text-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import {
  MoveIcon,
  RotateCwIcon,
  AlignCenterHorizontalIcon,
  AlignCenterVerticalIcon,
  BringToFrontIcon,
  SendToBackIcon,
  GridIcon
} from 'lucide-react'

function TextPositioning() {
  const {
    selectedTextLayer,
    updateTextLayer,
    dragState,
    alignmentGuides,
    gridSettings,
    updateDragState,
    updateGridSettings,
    moveLayerToFront,
    moveLayerToBack,
    moveLayerForward,
    moveLayerBackward
  } = useTextStore()

  const [localPosition, setLocalPosition] = useState<TextPosition | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Update local position when selection changes
  useEffect(() => {
    if (selectedTextLayer) {
      setLocalPosition(selectedTextLayer.position)
    } else {
      setLocalPosition(null)
    }
  }, [selectedTextLayer])

  // Handle position updates with client-side optimization
  const handlePositionChange = useCallback((
    property: keyof TextPosition,
    value: number
  ) => {
    if (!selectedTextLayer || !localPosition) return

    const updatedPosition = { ...localPosition, [property]: value }
    setLocalPosition(updatedPosition)

    // Immediate update for responsive feedback
    updateTextLayer(selectedTextLayer.id, {
      position: updatedPosition
    })
  }, [selectedTextLayer, localPosition, updateTextLayer])

  // Keyboard navigation with client-side state
  const handleKeyboardNavigation = useCallback((event: KeyboardEvent) => {
    if (!selectedTextLayer || !localPosition) return

    const step = event.shiftKey ? 10 : 1
    let deltaX = 0
    let deltaY = 0

    switch (event.key) {
      case 'ArrowLeft':
        deltaX = -step
        break
      case 'ArrowRight':
        deltaX = step
        break
      case 'ArrowUp':
        deltaY = -step
        break
      case 'ArrowDown':
        deltaY = step
        break
      default:
        return
    }

    event.preventDefault()
    handlePositionChange('x', localPosition.x + deltaX)
    handlePositionChange('y', localPosition.y + deltaY)
  }, [selectedTextLayer, localPosition, handlePositionChange])

  // Set up keyboard listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardNavigation)
    return () => document.removeEventListener('keydown', handleKeyboardNavigation)
  }, [handleKeyboardNavigation])

  if (!selectedTextLayer || !localPosition) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <MoveIcon className="w-8 h-8 mx-auto mb-2" />
        <p>Select a text layer to adjust positioning</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Position & Layer</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            handlePositionChange('x', 0)
            handlePositionChange('y', 0)
            handlePositionChange('rotation', 0)
          }}
        >
          Reset
        </Button>
      </div>

      {/* Position Coordinates */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Position</Label>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">X Position</Label>
            <Input
              type="number"
              value={Math.round(localPosition.x)}
              onChange={(e) => {
                const x = parseFloat(e.target.value) || 0
                handlePositionChange('x', x)
              }}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Y Position</Label>
            <Input
              type="number"
              value={Math.round(localPosition.y)}
              onChange={(e) => {
                const y = parseFloat(e.target.value) || 0
                handlePositionChange('y', y)
              }}
              className="text-sm"
            />
          </div>
        </div>

        {/* Quick Alignment */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Center horizontally on canvas
              const canvasWidth = canvasRef.current?.width || 800
              const textWidth = selectedTextLayer.bounds.width
              handlePositionChange('x', (canvasWidth - textWidth) / 2)
            }}
          >
            <AlignCenterHorizontalIcon className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Center vertically on canvas
              const canvasHeight = canvasRef.current?.height || 600
              const textHeight = selectedTextLayer.bounds.height
              handlePositionChange('y', (canvasHeight - textHeight) / 2)
            }}
          >
            <AlignCenterVerticalIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Rotation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Rotation</Label>
          <span className="text-xs text-muted-foreground">
            {Math.round(localPosition.rotation)}°
          </span>
        </div>

        <Slider
          value={[localPosition.rotation]}
          onValueChange={([rotation]) => handlePositionChange('rotation', rotation)}
          min={-180}
          max={180}
          step={1}
          className="w-full"
        />

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePositionChange('rotation', localPosition.rotation - 90)}
          >
            <RotateCwIcon className="w-4 h-4 scale-x-[-1]" />
            -90°
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePositionChange('rotation', 0)}
          >
            Reset
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePositionChange('rotation', localPosition.rotation + 90)}
          >
            <RotateCwIcon className="w-4 h-4" />
            +90°
          </Button>
        </div>
      </div>

      {/* Layer Order */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Layer Order</Label>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => moveLayerToFront(selectedTextLayer.id)}
          >
            <BringToFrontIcon className="w-4 h-4 mr-1" />
            To Front
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => moveLayerToBack(selectedTextLayer.id)}
          >
            <SendToBackIcon className="w-4 h-4 mr-1" />
            To Back
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => moveLayerForward(selectedTextLayer.id)}
          >
            Forward
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => moveLayerBackward(selectedTextLayer.id)}
          >
            Backward
          </Button>
        </div>
      </div>

      {/* Grid Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Snap to Grid</Label>
          <Switch
            checked={localPosition.snapToGrid}
            onCheckedChange={(checked) => handlePositionChange('snapToGrid', checked)}
          />
        </div>

        {localPosition.snapToGrid && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Grid Size</Label>
              <span className="text-xs text-muted-foreground">
                {localPosition.gridSize}px
              </span>
            </div>

            <Slider
              value={[localPosition.gridSize]}
              onValueChange={([size]) => handlePositionChange('gridSize', size)}
              min={5}
              max={50}
              step={5}
              className="w-full"
            />

            <div className="flex items-center justify-between">
              <Label className="text-xs">Show Grid</Label>
              <Switch
                checked={gridSettings.visible}
                onCheckedChange={(visible) => updateGridSettings({ visible })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Alignment Guides */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Smart Guides</Label>
          <Switch
            checked={alignmentGuides.visible}
            onCheckedChange={(visible) => updateGridSettings({ alignmentGuides: { visible } })}
          />
        </div>

        {alignmentGuides.visible && (
          <div className="text-xs text-muted-foreground">
            Drag text to see alignment guides with other elements
          </div>
        )}
      </div>
    </div>
  )
}

export default TextPositioning
```

### Text Drag Handler with Next.js Client Optimization
```typescript
'use client'

import { useCallback, useRef, useEffect } from 'react'
import { useTextStore } from '@/stores/text-store'

interface UseDragHandlerProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  textLayerId: string
}

export function useDragHandler({ canvasRef, textLayerId }: UseDragHandlerProps) {
  const {
    updateTextLayer,
    dragState,
    updateDragState,
    alignmentGuides,
    gridSettings,
    calculateAlignmentGuides,
    snapToGrid
  } = useTextStore()

  const dragStartRef = useRef<{ x: number; y: number } | null>(null)

  // Handle mouse down - start drag
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    dragStartRef.current = { x, y }

    updateDragState({
      isDragging: true,
      dragTarget: textLayerId,
      startPosition: { x, y },
      offset: { x: 0, y: 0 }
    })

    // Prevent default to avoid text selection
    event.preventDefault()
  }, [textLayerId, updateDragState, canvasRef])

  // Handle mouse move - update position
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!dragState.isDragging || dragState.dragTarget !== textLayerId || !dragStartRef.current) {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const currentX = event.clientX - rect.left
    const currentY = event.clientY - rect.top

    let deltaX = currentX - dragStartRef.current.x
    let deltaY = currentY - dragStartRef.current.y

    // Apply snap to grid if enabled
    if (gridSettings.enabled) {
      const snapped = snapToGrid(
        dragStartRef.current.x + deltaX,
        dragStartRef.current.y + deltaY,
        gridSettings.size
      )
      deltaX = snapped.x - dragStartRef.current.x
      deltaY = snapped.y - dragStartRef.current.y
    }

    // Update drag state for visual feedback
    updateDragState({
      offset: { x: deltaX, y: deltaY }
    })

    // Calculate alignment guides
    calculateAlignmentGuides(textLayerId, {
      x: dragStartRef.current.x + deltaX,
      y: dragStartRef.current.y + deltaY
    })

    // Update text layer position with optimized client-side state
    updateTextLayer(textLayerId, {
      position: {
        x: dragStartRef.current.x + deltaX,
        y: dragStartRef.current.y + deltaY
      }
    })

  }, [
    dragState,
    textLayerId,
    updateDragState,
    updateTextLayer,
    gridSettings,
    snapToGrid,
    calculateAlignmentGuides,
    canvasRef
  ])

  // Handle mouse up - end drag
  const handleMouseUp = useCallback(() => {
    if (!dragState.isDragging) return

    updateDragState({
      isDragging: false,
      dragTarget: null,
      startPosition: { x: 0, y: 0 },
      offset: { x: 0, y: 0 }
    })

    dragStartRef.current = null
  }, [dragState.isDragging, updateDragState])

  // Set up global event listeners for drag operations
  useEffect(() => {
    if (dragState.isDragging && dragState.dragTarget === textLayerId) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [dragState.isDragging, dragState.dragTarget, textLayerId, handleMouseMove, handleMouseUp])

  return {
    handleMouseDown,
    isDragging: dragState.isDragging && dragState.dragTarget === textLayerId
  }
}
```

### Canvas Integration Component
```typescript
'use client'

import { useRef, useEffect } from 'react'
import { useTextStore } from '@/stores/text-store'
import { useDragHandler } from './use-drag-handler'

function TextCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const {
    textLayers,
    selectedTextLayer,
    alignmentGuides,
    gridSettings,
    renderTextLayers,
    renderAlignmentGuides,
    renderGrid
  } = useTextStore()

  const { handleMouseDown } = useDragHandler({
    canvasRef,
    textLayerId: selectedTextLayer?.id || ''
  })

  // Render canvas content with Next.js optimization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Render grid if enabled
    if (gridSettings.visible) {
      renderGrid(ctx, canvas.width, canvas.height, gridSettings)
    }

    // Render text layers
    renderTextLayers(ctx, textLayers)

    // Render alignment guides
    if (alignmentGuides.visible) {
      renderAlignmentGuides(ctx, alignmentGuides)
    }

  }, [textLayers, alignmentGuides, gridSettings, renderTextLayers, renderAlignmentGuides, renderGrid])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="border border-gray-200 cursor-pointer"
      onMouseDown={handleMouseDown}
      style={{
        cursor: selectedTextLayer ? 'move' : 'default'
      }}
    />
  )
}

export default TextCanvas
```

## Definition of Done

- [ ] Text layers can be dragged smoothly anywhere on canvas with client-side optimization
- [ ] Smart guides appear during positioning with proper alignment detection
- [ ] Keyboard arrow keys provide precise positioning control with immediate feedback
- [ ] Layer order controls function correctly with visual feedback and client-side updates
- [ ] Rotation handle enables smooth angle adjustment with optimized rendering
- [ ] Snap-to-grid toggle works with visual grid display and client-side calculations
- [ ] Position coordinates display accurately and accept manual input
- [ ] Existing canvas and text functionality regression tested
- [ ] Code follows established canvas manipulation patterns with Next.js client components
- [ ] Tests pass (existing and new positioning tests)
- [ ] Performance maintains 60fps during text dragging with optimized state management
- [ ] Documentation updated for new positioning features

## Risk Assessment

**Primary Risk:** Interference with existing canvas drag behavior (zoom/pan vs text positioning)
**Mitigation:** Implement clear interaction modes with visual feedback for current drag target using Next.js client-side state management
**Rollback:** Disable text positioning features while maintaining basic text editing capability

## Compatibility Check

- [ ] No breaking changes to existing text or canvas APIs
- [ ] Positioning changes are additive only to text layer data structure
- [ ] UI changes follow existing design patterns from frame/background tools with Next.js components
- [ ] Performance impact measured and remains within acceptable limits (60fps target) with client-side optimization