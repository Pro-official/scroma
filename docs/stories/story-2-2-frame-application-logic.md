# Story 2.2: Frame Application Logic

## Story Overview

**Epic:** Epic 2 - Frame System & Application
**Story ID:** 2.2
**Priority:** High
**Status:** Ready for Development
**Estimated Effort:** 13 Story Points
**Sprint Assignment:** Sprint 3-4
**Dependencies:** Story 2.1 (Frame Library Component)

## User Story

**As a** user,
**I want to** apply frames to my screenshot with proper scaling,
**So that I can** transform my image into a professional mockup.

## Business Value

- Delivers the core transformation that defines Scroma's value proposition with Next.js SSG performance benefits
- Provides immediate visual impact that justifies tool adoption over basic alternatives using Next.js optimization
- Establishes foundation for frame customization and advanced styling features leveraging Next.js App Router
- Enables achievement of professional results without design expertise with Next.js static generation

## Acceptance Criteria

### Frame Application
1. **Immediate Application**
   - Selected frame applies instantly to canvas with real-time preview in Next.js client component
   - Frame application completes within 500ms for responsive user experience with Next.js optimization
   - Visual feedback shows frame being applied (subtle animation or progress indicator) using Next.js patterns
   - Frame change updates canvas without requiring separate "apply" action in Next.js component

2. **Image Scaling Logic**
   - Uploaded image automatically scales to fit within frame content area using Next.js optimization
   - Scaling algorithm preserves image aspect ratio without distortion in Next.js client component
   - Image positioned optimally within frame (centered by default) with Next.js calculations
   - Scaling calculations account for frame padding and content boundaries in Next.js

3. **Aspect Ratio Handling**
   - Images with different aspect ratios handled gracefully with letterboxing/pillarboxing in Next.js
   - Background color for letterbox/pillarbox areas configurable (default: transparent) using Next.js patterns
   - Option to crop vs. fit image within frame boundaries in Next.js client component
   - Smart positioning for non-standard aspect ratios (16:10, 4:3, etc.) with Next.js optimization

### Rendering Quality
4. **Resolution Preservation**
   - Frame renders at correct resolution relative to source image with Next.js optimization
   - High-resolution images maintain quality when framed using Next.js Image component
   - Frame assets scale without quality loss at different zoom levels in Next.js
   - No visible artifacts or pixelation in frame edges or corners with Next.js rendering

5. **Layer Management**
   - Frame renders above image but below text overlays in proper z-order using Next.js CSS
   - Image remains editable (moveable, scalable) within frame boundaries in Next.js client component
   - Frame doesn't interfere with existing canvas zoom and pan functionality in Next.js
   - Multi-layer rendering optimized for 60fps canvas performance with Next.js optimization

### State Management
6. **Frame Persistence**
   - Applied frame persists when switching between interface panels using Next.js client-side state
   - Frame configuration saved to application state for undo/redo functionality with Next.js patterns
   - Frame state preserved during canvas zoom, pan, and resize operations in Next.js
   - Frame settings maintained when switching between similar frame types with Next.js state management

7. **Frame Removal**
   - "Remove Frame" option available in frame library or right-click context in Next.js component
   - Frame removal returns canvas to original image-only state using Next.js state management
   - Removal preserves image position, zoom, and other canvas settings in Next.js
   - Undo functionality available for frame removal action with Next.js history management

## Technical Implementation

### Frame Application Engine
```typescript
interface FrameApplicationEngine {
  applyFrame(frame: Frame, image: ImageData, canvas: CanvasData): Promise<FramedCanvasData>
  removeFrame(canvas: FramedCanvasData): CanvasData
  calculateImageFit(image: ImageData, frame: Frame): ImageFitResult
  renderFramedCanvas(canvas: FramedCanvasData): Promise<void>
}

interface ImageFitResult {
  scale: number
  position: { x: number; y: number }
  fitType: 'contain' | 'cover' | 'fill'
  letterboxing: {
    top: number
    bottom: number
    left: number
    right: number
  } | null
}

interface FramedCanvasData extends CanvasData {
  frame: {
    frameId: string
    frameData: Frame
    imageTransform: {
      scale: number
      offsetX: number
      offsetY: number
      rotation: number
    }
    frameProperties: FrameProperties
  }
}

// Next.js optimized frame application service
class FrameApplicationService {
  static async applyFrame(
    frame: Frame,
    image: ImageData,
    canvasState: CanvasState
  ): Promise<FramedCanvasData> {
    // Calculate optimal image fit within frame for Next.js
    const fitResult = this.calculateImageFit(image, frame)

    // Create framed canvas data optimized for Next.js
    const framedCanvas: FramedCanvasData = {
      ...canvasState,
      frame: {
        frameId: frame.id,
        frameData: frame,
        imageTransform: {
          scale: fitResult.scale,
          offsetX: fitResult.position.x,
          offsetY: fitResult.position.y,
          rotation: 0
        },
        frameProperties: { ...frame.defaultProperties }
      }
    }

    // Render the framed composition with Next.js optimization
    await this.renderFramedCanvas(framedCanvas)

    return framedCanvas
  }

  static calculateImageFit(image: ImageData, frame: Frame): ImageFitResult {
    const { width: imgWidth, height: imgHeight } = image
    const { contentArea } = frame.dimensions

    // Calculate scale to fit image within frame content area for Next.js
    const scaleX = contentArea.width / imgWidth
    const scaleY = contentArea.height / imgHeight
    const scale = Math.min(scaleX, scaleY) // Preserve aspect ratio

    // Calculate final dimensions and positioning for Next.js
    const finalWidth = imgWidth * scale
    const finalHeight = imgHeight * scale

    const offsetX = contentArea.x + (contentArea.width - finalWidth) / 2
    const offsetY = contentArea.y + (contentArea.height - finalHeight) / 2

    // Determine if letterboxing is needed for Next.js
    let letterboxing = null
    if (scale === scaleX && scaleY > scaleX) {
      // Horizontal letterboxing
      const letterboxHeight = (contentArea.height - finalHeight) / 2
      letterboxing = {
        top: letterboxHeight,
        bottom: letterboxHeight,
        left: 0,
        right: 0
      }
    } else if (scale === scaleY && scaleX > scaleY) {
      // Vertical letterboxing
      const letterboxWidth = (contentArea.width - finalWidth) / 2
      letterboxing = {
        top: 0,
        bottom: 0,
        left: letterboxWidth,
        right: letterboxWidth
      }
    }

    return {
      scale,
      position: { x: offsetX, y: offsetY },
      fitType: 'contain',
      letterboxing
    }
  }

  static async renderFramedCanvas(framedCanvas: FramedCanvasData): Promise<void> {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    // Set canvas dimensions for Next.js optimization
    canvas.width = framedCanvas.canvas.width
    canvas.height = framedCanvas.canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Render background if present (Next.js optimized)
    if (framedCanvas.background) {
      await this.renderBackground(ctx, framedCanvas.background)
    }

    // Render letterboxing background if needed (Next.js pattern)
    if (framedCanvas.frame.imageTransform.letterboxing) {
      await this.renderLetterboxing(ctx, framedCanvas.frame.imageTransform.letterboxing)
    }

    // Render image with transform (Next.js optimized)
    await this.renderTransformedImage(ctx, framedCanvas.image, framedCanvas.frame.imageTransform)

    // Render frame overlay (Next.js optimized)
    await this.renderFrameOverlay(ctx, framedCanvas.frame.frameData, framedCanvas.frame.frameProperties)

    // Update main canvas (Next.js pattern)
    const mainCanvas = framedCanvas.canvasRef.current
    if (mainCanvas) {
      const mainCtx = mainCanvas.getContext('2d')!
      mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height)
      mainCtx.drawImage(canvas, 0, 0)
    }
  }

  static async renderTransformedImage(
    ctx: CanvasRenderingContext2D,
    image: ImageData,
    transform: FrameImageTransform
  ): Promise<void> {
    const img = new Image()

    return new Promise((resolve, reject) => {
      img.onload = () => {
        ctx.save()

        // Apply transforms (Next.js optimized)
        ctx.translate(transform.offsetX, transform.offsetY)
        ctx.scale(transform.scale, transform.scale)

        if (transform.rotation !== 0) {
          ctx.rotate(transform.rotation * Math.PI / 180)
        }

        // Draw image with Next.js optimization
        ctx.drawImage(img, 0, 0, image.originalWidth, image.originalHeight)

        ctx.restore()
        resolve()
      }

      img.onerror = reject
      img.src = image.src
    })
  }

  static async renderFrameOverlay(
    ctx: CanvasRenderingContext2D,
    frame: Frame,
    properties: FrameProperties
  ): Promise<void> {
    const frameImg = new Image()

    return new Promise((resolve, reject) => {
      frameImg.onload = () => {
        ctx.save()

        // Apply frame properties (opacity, shadow, etc.) for Next.js
        if (properties.opacity < 1) {
          ctx.globalAlpha = properties.opacity
        }

        if (properties.shadow) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
          ctx.shadowBlur = 10
          ctx.shadowOffsetY = 5
        }

        // Draw frame with Next.js optimization
        ctx.drawImage(frameImg, 0, 0, frame.dimensions.width, frame.dimensions.height)

        ctx.restore()
        resolve()
      }

      frameImg.onerror = reject
      frameImg.src = frame.assetUrl
    })
  }
}
```

### Canvas Integration
```typescript
'use client'

import { useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-react'

const FramedCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const {
    image,
    activeFrame,
    canvasState,
    applyFrame,
    removeFrame,
    updateFrameTransform
  } = useCanvasStore()

  // Apply frame when frame selection changes (Next.js optimization)
  useEffect(() => {
    if (activeFrame && image && canvasRef.current) {
      const applyFrameToCanvas = async () => {
        try {
          const framedCanvas = await FrameApplicationService.applyFrame(
            activeFrame,
            image,
            canvasState
          )
          applyFrame(framedCanvas)
        } catch (error) {
          console.error('Failed to apply frame:', error)
          // Show error message to user in Next.js
        }
      }

      applyFrameToCanvas()
    }
  }, [activeFrame, image, canvasState])

  // Handle image transform updates (drag, scale, rotate) for Next.js
  const handleImageTransform = useCallback((transform: Partial<FrameImageTransform>) => {
    if (canvasState.frame) {
      updateFrameTransform({
        ...canvasState.frame.imageTransform,
        ...transform
      })
    }
  }, [canvasState.frame, updateFrameTransform])

  // Handle frame removal for Next.js
  const handleRemoveFrame = useCallback(() => {
    if (canvasState.frame) {
      const unframedCanvas = FrameApplicationService.removeFrame(canvasState)
      removeFrame(unframedCanvas)
    }
  }, [canvasState, removeFrame])

  return (
    <div className="relative flex-1">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        width={canvasState.canvas.width}
        height={canvasState.canvas.height}
      />

      {/* Frame controls overlay for Next.js */}
      {canvasState.frame && (
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRemoveFrame}
            className="bg-background/90 backdrop-blur-sm"
          >
            <XIcon className="w-4 h-4 mr-1" />
            Remove Frame
          </Button>
        </div>
      )}

      {/* Image transform handles for Next.js */}
      {canvasState.frame && (
        <ImageTransformHandles
          transform={canvasState.frame.imageTransform}
          onTransformChange={handleImageTransform}
        />
      )}
    </div>
  )
}
```

## Definition of Done

### Functional Requirements
- [ ] Frame application works instantly with real-time preview in Next.js client components
- [ ] Image scaling preserves aspect ratio and optimizes positioning with Next.js patterns
- [ ] Letterboxing/pillarboxing handled gracefully for mismatched aspect ratios in Next.js
- [ ] Frame removal returns canvas to original state using Next.js state management
- [ ] Multi-layer rendering maintains proper z-order with Next.js CSS optimization

### Performance Requirements
- [ ] Frame application completes within 500ms for typical images with Next.js optimization
- [ ] Canvas rendering maintains 60fps during frame operations using Next.js patterns
- [ ] Large images (up to 10MB) apply frames without UI blocking in Next.js client components
- [ ] Memory usage optimized for multiple frame switches with Next.js memory management

### Quality Requirements
- [ ] Frame rendering quality matches professional design tools with Next.js optimization
- [ ] No visible artifacts or quality degradation in final output using Next.js Image component
- [ ] High-resolution images maintain sharpness when framed with Next.js static optimization
- [ ] Frame edges clean and anti-aliased at all zoom levels in Next.js

### Integration Requirements
- [ ] Frame system integrates seamlessly with existing canvas zoom/pan in Next.js
- [ ] Undo/redo system captures frame application and removal with Next.js history management
- [ ] State persistence maintains frame configuration across sessions using Next.js client-side state
- [ ] Frame operations compatible with future text overlay system in Next.js

## Success Metrics

### User Engagement
- **Target:** 90% of users who select frames successfully apply them
- **Measurement:** Frame selection to application completion rate with Next.js analytics

### User Satisfaction
- **Target:** 85% of users rate frame quality as "professional" or higher
- **Measurement:** User surveys and feedback collection with Next.js forms

### Performance Metrics
- **Target:** Frame application maintains <500ms response time
- **Measurement:** Performance monitoring of frame application duration with Next.js performance tools

### Quality Metrics
- **Target:** <2% of frame applications result in visual artifacts
- **Measurement:** Error tracking and user feedback on frame quality with Next.js monitoring

## Risk Assessment

### Primary Risk: Frame Rendering Performance in Next.js
**Mitigation:**
- Optimize frame assets for web delivery with Next.js static optimization
- Implement progressive rendering for large frames using Next.js patterns
- Use Web Workers for complex frame calculations in Next.js

### Secondary Risk: Image Quality Degradation in Next.js
**Mitigation:**
- High-quality scaling algorithms optimized for Next.js
- Canvas rendering optimization with Next.js performance patterns
- Quality testing across different image types in Next.js environment

### Tertiary Risk: Complex Aspect Ratio Handling in Next.js
**Mitigation:**
- Comprehensive testing with various image dimensions in Next.js
- Clear visual feedback for letterboxing scenarios using Next.js components
- User control over fit vs. crop behavior in Next.js client components

### Rollback Plan
- Feature flags for frame application engine in Next.js
- Fallback to basic frame overlay if advanced features fail in Next.js
- Frame asset versioning for quick quality rollback with Next.js static assets

## Testing Strategy

### Unit Tests
- Image scaling calculations with various aspect ratios in Next.js environment
- Frame positioning logic for different frame types with Next.js patterns
- Layer rendering order and z-index management in Next.js CSS

### Integration Tests
- End-to-end frame application workflow in Next.js app
- Canvas state management during frame operations with Next.js state
- Performance testing with large images and complex frames in Next.js

### Visual Regression Tests
- Frame rendering consistency across browsers with Next.js optimization
- Image quality preservation at different resolutions using Next.js Image component
- Canvas output comparison with reference images in Next.js environment