# Story 1.3: Canvas Display System

## Story Overview

**Epic:** Epic 1 - Foundation & Core Upload System
**Story ID:** 1.3
**Priority:** High
**Status:** Ready for Development
**Estimated Effort:** 13 Story Points
**Sprint Assignment:** Sprint 1-2
**Dependencies:** Story 1.2 (File Upload Interface)

## User Story

**As a** user,
**I want to** see my uploaded image on an interactive canvas with Next.js 15 optimization,
**So that I can** view and prepare it for enhancement with 60fps performance.

## Business Value

- Provides immediate visual feedback and value after file upload with Next.js SSG performance
- Establishes foundation for all subsequent editing operations
- Enables interactive image manipulation that differentiates Scroma from basic viewers
- Supports professional workflow with zoom, pan, and precision viewing capabilities
- Leverages Next.js client-side optimization for smooth 60fps canvas interactions

## Acceptance Criteria

### Canvas Display

1. **Image Rendering**

   - Uploaded image displays centered on canvas with appropriate initial zoom level
   - Image maintains aspect ratio and visual quality at all zoom levels
   - Canvas background has subtle pattern to clearly indicate transparent areas
   - High-resolution images render smoothly without pixelation using Next.js optimization

2. **Viewport Management**

   - Canvas dimensions automatically adjust to available viewport space
   - Responsive layout maintains canvas usability on different screen sizes
   - Canvas container properly handles overflow and scrolling when zoomed
   - Minimum canvas size maintained for usability (800x600px minimum)
   - Viewport optimized for Next.js client-side rendering performance

3. **Visual Feedback**
   - Image metadata displayed in status bar (dimensions, file size, format)
   - Loading states shown during image processing and rendering
   - Error states clearly communicated if image fails to load
   - Canvas boundaries visually distinct from surrounding interface

### Zoom Controls

4. **Zoom Functionality**

   - Zoom range from 10% to 500% with smooth transitions using Next.js client optimization
   - Zoom controls include buttons (+/-), slider, and fit-to-screen option
   - Mouse wheel zoom centered on cursor position for intuitive navigation
   - Keyboard shortcuts (Ctrl/Cmd + +/-) for accessibility

5. **Zoom Precision**
   - Zoom increments provide useful magnification levels (10%, 25%, 50%, 75%, 100%, 150%, 200%, 300%, 400%, 500%)
   - Current zoom level clearly displayed as percentage
   - Zoom maintains center point for consistent user experience
   - Smooth zoom animation without performance degradation via Next.js optimization

### Pan Functionality

6. **Image Navigation**

   - Drag to pan when image is zoomed beyond viewport size
   - Pan boundaries prevent dragging image completely out of view
   - Pan cursor indicates draggable state when hovering over image
   - Touch device support for pinch-zoom and drag-pan gestures
   - Pan operations optimized for Next.js client performance

7. **Navigation Reset**
   - Reset view button returns to initial centered state (100% zoom, centered position)
   - Double-click to fit image to viewport for quick overview
   - Space bar temporarily enables pan mode for keyboard users
   - Pan position preserved when switching between interface panels

## Technical Implementation

### Next.js 15 Component Architecture

```
components/canvas/
├── canvas-viewport.tsx          # Main canvas container with Next.js client optimization
├── canvas-image.tsx             # Image rendering component
├── zoom-controls.tsx            # Zoom UI controls
├── pan-handler.tsx              # Pan interaction management
├── canvas-status-bar.tsx        # Image metadata display
└── canvas-reset-controls.tsx    # Reset and fit controls

lib/canvas/
├── canvas-manager.ts            # Canvas state management optimized for Next.js
├── zoom-calculator.ts           # Zoom level calculations
├── pan-calculator.ts            # Pan boundary calculations
└── canvas-utils.ts              # Canvas utility functions
```

### Canvas State Management (Zustand + Next.js)

```typescript
interface CanvasState {
  // Image data
  currentImage: ImageData | null;
  imageLoaded: boolean;
  imageError: string | null;

  // Viewport state
  viewportDimensions: { width: number; height: number };
  canvasDimensions: { width: number; height: number };

  // Transform state
  zoom: number;
  panX: number;
  panY: number;

  // Interaction state
  isDragging: boolean;
  dragStart: { x: number; y: number } | null;

  // Next.js optimization state
  renderFrameId: number | null;
  performanceMode: boolean;
}

interface ImageData {
  src: string;
  width: number;
  height: number;
  format: string;
  size: number;
  name: string;
}

// Next.js 15 optimized canvas manager
export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.setupNextJSOptimization();
  }

  private setupNextJSOptimization() {
    // Enable Next.js client-side optimization
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = "high";
  }

  renderImage(imageData: ImageData, zoom: number, panX: number, panY: number) {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render background pattern
    this.renderBackgroundPattern();

    // Calculate image position and size
    const scaledWidth = imageData.width * zoom;
    const scaledHeight = imageData.height * zoom;
    const x = (this.canvas.width - scaledWidth) / 2 + panX;
    const y = (this.canvas.height - scaledHeight) / 2 + panY;

    // Create image element with Next.js optimization
    const img = new Image();
    img.onload = () => {
      this.ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
    };
    img.src = imageData.src;
  }

  private renderBackgroundPattern() {
    // Render transparency checkerboard pattern
    const patternSize = 20;
    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = patternSize * 2;
    patternCanvas.height = patternSize * 2;

    const patternCtx = patternCanvas.getContext("2d")!;
    patternCtx.fillStyle = "#f0f0f0";
    patternCtx.fillRect(0, 0, patternSize, patternSize);
    patternCtx.fillRect(patternSize, patternSize, patternSize, patternSize);

    const pattern = this.ctx.createPattern(patternCanvas, "repeat")!;
    this.ctx.fillStyle = pattern;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
```

### Next.js 15 Canvas Viewport Component

```typescript
"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useCanvasStore } from "@/stores/canvas-store";

export function CanvasViewport() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasManager, setCanvasManager] = useState<CanvasManager | null>(
    null
  );

  const {
    currentImage,
    zoom,
    panX,
    panY,
    setViewportDimensions,
    updateZoom,
    updatePan,
  } = useCanvasStore();

  // Initialize canvas with Next.js optimization
  useEffect(() => {
    if (canvasRef.current) {
      const manager = new CanvasManager(canvasRef.current);
      setCanvasManager(manager);
    }
  }, []);

  // Handle viewport resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setViewportDimensions(width, height);

        if (canvasRef.current) {
          canvasRef.current.width = width;
          canvasRef.current.height = height;
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setViewportDimensions]);

  // Render image when state changes
  useEffect(() => {
    if (canvasManager && currentImage) {
      canvasManager.renderImage(currentImage, zoom, panX, panY);
    }
  }, [canvasManager, currentImage, zoom, panX, panY]);

  // Handle mouse wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(5, zoom * zoomDelta));
      updateZoom(newZoom);
    },
    [zoom, updateZoom]
  );

  // Handle pan drag
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      const startX = e.clientX - panX;
      const startY = e.clientY - panY;

      const handleMouseMove = (e: MouseEvent) => {
        updatePan(e.clientX - startX, e.clientY - startY);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [panX, panY, updatePan]
  );

  return (
    <div
      ref={containerRef}
      className="canvas-viewport flex-1 relative overflow-hidden bg-gray-50"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
      />

      {!currentImage && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <p>Upload an image to get started</p>
        </div>
      )}
    </div>
  );
}
```

### Zoom Controls Component

```typescript
"use client";

import { useCanvasStore } from "@/stores/canvas-store";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export function ZoomControls() {
  const { zoom, updateZoom, fitToScreen, resetView } = useCanvasStore();

  const zoomPercentage = Math.round(zoom * 100);

  const handleZoomIn = () => {
    updateZoom(Math.min(5, zoom * 1.2));
  };

  const handleZoomOut = () => {
    updateZoom(Math.max(0.1, zoom * 0.8));
  };

  const handleSliderChange = (value: number[]) => {
    updateZoom(value[0] / 100);
  };

  return (
    <div className="zoom-controls flex items-center gap-2 p-2 bg-white rounded-lg shadow">
      <Button
        variant="outline"
        size="sm"
        onClick={handleZoomOut}
        disabled={zoom <= 0.1}
      >
        -
      </Button>

      <Slider
        value={[zoomPercentage]}
        onValueChange={handleSliderChange}
        min={10}
        max={500}
        step={10}
        className="w-24"
      />

      <Button
        variant="outline"
        size="sm"
        onClick={handleZoomIn}
        disabled={zoom >= 5}
      >
        +
      </Button>

      <span className="text-sm font-mono min-w-[4ch] text-center">
        {zoomPercentage}%
      </span>

      <Button variant="outline" size="sm" onClick={fitToScreen}>
        Fit
      </Button>

      <Button variant="outline" size="sm" onClick={resetView}>
        Reset
      </Button>
    </div>
  );
}
```

## Definition of Done

### Functional Requirements

- [ ] Canvas displays uploaded images with perfect quality at all zoom levels
- [ ] Zoom controls (buttons, slider, mouse wheel) work smoothly from 10% to 500%
- [ ] Pan functionality enables navigation of zoomed images without limitations
- [ ] Reset and fit-to-screen functions return to appropriate default views
- [ ] Image metadata accurately displayed in status bar
- [ ] Next.js client optimization ensures 60fps canvas performance

### Performance Requirements

- [ ] Canvas renders at consistent 60fps during zoom and pan operations using Next.js optimization
- [ ] Image loading and display completes within 2 seconds for typical files
- [ ] Memory usage remains efficient during extended canvas interactions
- [ ] Viewport resizing responsive and smooth across different screen sizes
- [ ] Touch gestures work smoothly on mobile devices

### User Experience Requirements

- [ ] Canvas interactions feel immediate and responsive
- [ ] Zoom and pan operations intuitive for new users
- [ ] Visual feedback clear for all interaction states
- [ ] Keyboard shortcuts accessible and discoverable
- [ ] Mobile touch interactions natural and precise
- [ ] Next.js client optimization provides smooth interactions

### Accessibility Requirements

- [ ] Keyboard navigation supports all canvas operations
- [ ] Screen readers announce zoom levels and image information
- [ ] Focus indicators visible for interactive elements
- [ ] Color contrast sufficient for all UI elements

## Testing Strategy

### Unit Tests

- Canvas rendering with various image formats and sizes
- Zoom calculation accuracy across full range
- Pan boundary detection and enforcement
- Viewport resize handling and responsiveness
- Next.js client component optimization

### Integration Tests

- End-to-end canvas workflow from upload to interaction
- Browser compatibility for canvas operations
- Touch device gesture recognition and response
- Performance testing under various load conditions
- Next.js optimization performance validation

### User Acceptance Tests

- First-time users can navigate canvas within 30 seconds of image upload
- Professional users can precisely position and zoom images for detailed work
- Canvas remains responsive during extended editing sessions
- Mobile users can effectively zoom and pan using touch gestures

## Success Metrics

### Performance (Next.js 15 Optimized)

- **Target:** Canvas maintains 60fps during all zoom and pan operations
- **Measurement:** Frame rate monitoring during user interactions
- **Next.js Target:** Canvas loads instantly via optimized client rendering

### User Engagement

- **Target:** 90% of users who upload images interact with zoom/pan controls
- **Measurement:** Analytics tracking canvas interaction events

### Usability

- **Target:** Users successfully navigate to desired zoom level within 10 seconds
- **Measurement:** Task completion time analysis

### Technical Quality

- **Target:** <1% of canvas operations result in visual glitches or errors
- **Measurement:** Error tracking and visual regression testing

## Risk Assessment

### Primary Risk: Canvas Performance on Lower-End Devices

**Mitigation:**

- Performance monitoring with automatic quality degradation
- Optimized rendering pipeline using Next.js client patterns
- Fallback modes for devices with limited capabilities
- Progressive enhancement for advanced features

### Secondary Risk: Browser Compatibility Issues

**Mitigation:**

- Comprehensive testing across target browser matrix
- Feature detection and graceful degradation
- Canvas API polyfills where necessary
- Next.js client-side optimization handles browser differences

### Rollback Plan

- Feature flags for individual canvas features
- Fallback to static image display if canvas fails
- Performance monitoring with automatic feature disabling
- Alternative viewing modes for problematic devices

---

**Story Owner:** Development Team
**Technical Lead:** Frontend Developer
**Timeline:** Sprint 1-2 - Weeks 2-3
**Dependencies:** Next.js 15 project setup (Story 1.1), File upload (Story 1.2)
**Next.js 15 Migration:** Complete client-side optimization for 60fps canvas performance
