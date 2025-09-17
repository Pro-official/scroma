# Story 2.4: Frame Rendering Optimization

## Story Overview

**Epic:** Epic 2 - Frame System & Application
**Story ID:** 2.4
**Priority:** Medium
**Status:** Ready for Development
**Estimated Effort:** 5 Story Points
**Sprint Assignment:** Sprint 4
**Dependencies:** Story 2.3 (Frame Customization Controls)

## User Story

**As a** developer,
**I want to** optimize frame rendering performance,
**So that** users experience smooth interactions even with complex frames.

## Business Value

- Ensures professional-grade performance that meets user expectations for creative tools
- Prevents performance degradation that could drive users to competitor products
- Establishes scalable foundation for future advanced frame features
- Supports business goal of maintaining 60fps canvas interactions

## Acceptance Criteria

### Loading Performance
1. **Asynchronous Frame Loading**
   - Frame assets load asynchronously without blocking UI interactions
   - Loading indicators show progress for frame assets over 1MB
   - Failed frame loads gracefully degrade to fallback frames
   - Preloading system anticipates likely frame selections based on user behavior

2. **Frame Asset Caching**
   - Frame assets cached in browser after first load for instant switching
   - Cache strategy prioritizes recently used and popular frames
   - Cache size management prevents browser storage quota issues
   - Cache invalidation handles frame asset updates properly

3. **Progressive Loading**
   - Large frame assets load progressively with low-resolution preview first
   - High-resolution frame assets stream in without blocking interaction
   - Bandwidth detection adjusts loading strategy for slower connections
   - User can interact with frames while high-quality assets finish loading

### Rendering Performance
4. **Scalable Vector Graphics**
   - SVG frames scale without quality loss at any zoom level (10% to 500%)
   - Vector frame rendering optimized for canvas performance
   - Complex SVG elements simplified for faster rendering without quality loss
   - SVG animations disabled during interaction to maintain performance

5. **Smooth Animation Framework**
   - Frame transitions use requestAnimationFrame for optimal timing
   - Animation queue prevents stacking of multiple simultaneous transitions
   - Easing functions provide natural motion feel without performance cost
   - Motion can be disabled for accessibility or performance preferences

6. **Memory Management (NFR8 Compliance)**
   - Frame switching releases previous frame resources efficiently
   - Canvas context cleanup prevents memory leaks during heavy usage
   - Large frame assets use memory pooling to reduce garbage collection
   - **Memory usage monitoring ensures total app memory stays below 500MB limit**
   - **Automatic cleanup triggers when memory usage exceeds 400MB (80% threshold)**
   - **Frame asset memory usage tracked and reported to memory monitoring system**
   - **Memory leak detection specifically for frame rendering operations**
   - **Frame cache size limited to prevent memory limit violations**

### Performance Monitoring
7. **Real-time Performance Tracking**
   - Frame rendering performance maintains consistent 60fps during operations
   - Performance metrics tracked and logged for optimization analysis
   - Automatic quality degradation when performance drops below thresholds
   - Performance warnings shown to users when system struggles with operations

8. **Graceful Degradation**
   - Fallback rendering mode for systems that can't maintain target performance
   - Simplified frame versions available for low-performance devices
   - Frame complexity automatically reduced based on device capabilities
   - User control over performance vs. quality trade-offs

## Memory Management Integration

```typescript
// Frame rendering memory management
interface FrameMemoryManager {
  trackFrameMemoryUsage(frameId: string, memorySize: number): void
  releaseFrameMemory(frameId: string): void
  getCacheMemoryUsage(): number
  cleanupFrameCache(): Promise<void>
  checkMemoryBeforeFrameLoad(frameSize: number): boolean
}

// Integration with global memory monitoring
class FrameRenderingService {
  private memoryManager: FrameMemoryManager
  private globalMemoryMonitor: MemoryMonitor

  async loadFrame(frameId: string): Promise<Frame> {
    const frameData = await this.getFrameData(frameId)
    const estimatedMemory = this.estimateFrameMemoryUsage(frameData)

    // Check global memory limit before loading
    if (!this.globalMemoryMonitor.checkAvailableMemory(estimatedMemory)) {
      await this.globalMemoryMonitor.cleanup()
    }

    // Track frame-specific memory usage
    this.memoryManager.trackFrameMemoryUsage(frameId, estimatedMemory)

    return frameData
  }
}
```

## Technical Implementation

### Frame Asset Management
```typescript
interface FrameAssetManager {
  loadFrame(frameId: string): Promise<FrameAsset>
  preloadFrames(frameIds: string[]): Promise<void>
  invalidateCache(frameId?: string): void
  getLoadingProgress(frameId: string): number
  getCacheStatus(): CacheStatus
}

interface FrameAsset {
  id: string
  type: 'svg' | 'png' | 'webp'
  data: HTMLImageElement | SVGElement
  size: number
  loadTime: number
  lastAccessed: Date
  quality: 'low' | 'medium' | 'high'
}

interface CacheStatus {
  totalSize: number
  maxSize: number
  itemCount: number
  hitRate: number
  evictions: number
}

class FrameAssetManager {
  private cache = new Map<string, FrameAsset>()
  private loadingPromises = new Map<string, Promise<FrameAsset>>()
  private maxCacheSize = 50 * 1024 * 1024 // 50MB
  private performanceTracker = new PerformanceTracker()

  async loadFrame(frameId: string): Promise<FrameAsset> {
    // Check cache first
    const cached = this.cache.get(frameId)
    if (cached) {
      cached.lastAccessed = new Date()
      return cached
    }

    // Check if already loading
    const existing = this.loadingPromises.get(frameId)
    if (existing) {
      return existing
    }

    // Start loading
    const loadPromise = this.loadFrameAsset(frameId)
    this.loadingPromises.set(frameId, loadPromise)

    try {
      const asset = await loadPromise
      this.cache.set(frameId, asset)
      this.ensureCacheSize()
      return asset
    } finally {
      this.loadingPromises.delete(frameId)
    }
  }

  private async loadFrameAsset(frameId: string): Promise<FrameAsset> {
    const startTime = performance.now()

    try {
      // Determine optimal format based on browser support and connection
      const format = this.selectOptimalFormat(frameId)
      const url = this.getFrameUrl(frameId, format)

      if (format === 'svg') {
        return await this.loadSVGFrame(frameId, url, startTime)
      } else {
        return await this.loadImageFrame(frameId, url, format, startTime)
      }
    } catch (error) {
      console.warn(`Failed to load frame ${frameId}:`, error)
      return await this.loadFallbackFrame(frameId)
    }
  }

  private async loadSVGFrame(frameId: string, url: string, startTime: number): Promise<FrameAsset> {
    const response = await fetch(url)
    const svgText = await response.text()
    const parser = new DOMParser()
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml')
    const svgElement = svgDoc.documentElement

    // Optimize SVG for performance
    this.optimizeSVG(svgElement)

    const loadTime = performance.now() - startTime
    this.performanceTracker.recordLoadTime(frameId, loadTime)

    return {
      id: frameId,
      type: 'svg',
      data: svgElement,
      size: svgText.length,
      loadTime,
      lastAccessed: new Date(),
      quality: 'high'
    }
  }

  private async loadImageFrame(
    frameId: string,
    url: string,
    format: 'png' | 'webp',
    startTime: number
  ): Promise<FrameAsset> {
    return new Promise((resolve, reject) => {
      const img = new Image()

      img.onload = () => {
        const loadTime = performance.now() - startTime
        this.performanceTracker.recordLoadTime(frameId, loadTime)

        resolve({
          id: frameId,
          type: format,
          data: img,
          size: this.estimateImageSize(img),
          loadTime,
          lastAccessed: new Date(),
          quality: 'high'
        })
      }

      img.onerror = reject
      img.src = url
    })
  }

  private optimizeSVG(svgElement: SVGElement): void {
    // Remove unnecessary elements for performance
    const elementsToRemove = svgElement.querySelectorAll('metadata, title, desc')
    elementsToRemove.forEach(el => el.remove())

    // Disable animations during interaction
    const animations = svgElement.querySelectorAll('animate, animateTransform')
    animations.forEach(anim => {
      anim.setAttribute('dur', '0s')
    })

    // Simplify complex paths if needed
    const paths = svgElement.querySelectorAll('path')
    paths.forEach(path => {
      const d = path.getAttribute('d')
      if (d && d.length > 5000) {
        // Simplify very complex paths
        path.setAttribute('d', this.simplifyPath(d))
      }
    })
  }

  private ensureCacheSize(): void {
    const currentSize = Array.from(this.cache.values())
      .reduce((total, asset) => total + asset.size, 0)

    if (currentSize > this.maxCacheSize) {
      // Remove least recently used items
      const sorted = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.lastAccessed.getTime() - b.lastAccessed.getTime())

      let removedSize = 0
      while (removedSize < currentSize - this.maxCacheSize && sorted.length > 0) {
        const [id, asset] = sorted.shift()!
        this.cache.delete(id)
        removedSize += asset.size
      }
    }
  }

  async preloadFrames(frameIds: string[]): Promise<void> {
    // Load popular/likely frames in background
    const loadPromises = frameIds.map(id =>
      this.loadFrame(id).catch(error => {
        console.warn(`Preload failed for frame ${id}:`, error)
      })
    )

    await Promise.allSettled(loadPromises)
  }
}
```

### Performance-Optimized Renderer
```typescript
class OptimizedFrameRenderer {
  private renderQueue: RenderTask[] = []
  private isRendering = false
  private performanceTracker = new PerformanceTracker()
  private renderContext: CanvasRenderingContext2D | null = null

  async renderFrame(
    canvas: HTMLCanvasElement,
    frame: FrameAsset,
    image: ImageData,
    properties: FrameProperties
  ): Promise<void> {
    const task: RenderTask = {
      id: `${frame.id}-${Date.now()}`,
      canvas,
      frame,
      image,
      properties,
      priority: 'high',
      startTime: performance.now()
    }

    return this.queueRender(task)
  }

  private async queueRender(task: RenderTask): Promise<void> {
    return new Promise((resolve, reject) => {
      task.resolve = resolve
      task.reject = reject

      // Insert task based on priority
      const insertIndex = this.renderQueue.findIndex(t => t.priority === 'low')
      if (insertIndex === -1) {
        this.renderQueue.push(task)
      } else {
        this.renderQueue.splice(insertIndex, 0, task)
      }

      this.processRenderQueue()
    })
  }

  private async processRenderQueue(): Promise<void> {
    if (this.isRendering || this.renderQueue.length === 0) {
      return
    }

    this.isRendering = true

    while (this.renderQueue.length > 0) {
      const task = this.renderQueue.shift()!

      try {
        await this.executeRenderTask(task)
        task.resolve?.()
      } catch (error) {
        task.reject?.(error)
      }

      // Yield control to browser for other tasks
      await this.yieldToMain()
    }

    this.isRendering = false
  }

  private async executeRenderTask(task: RenderTask): Promise<void> {
    const startTime = performance.now()

    try {
      this.renderContext = task.canvas.getContext('2d')!

      // Clear and setup canvas
      this.setupCanvas(task.canvas, task.properties)

      // Render image
      await this.renderImage(task.image, task.properties)

      // Render frame
      await this.renderFrameAsset(task.frame, task.properties)

      // Apply post-processing effects
      this.applyEffects(task.properties)

      const renderTime = performance.now() - startTime
      this.performanceTracker.recordRenderTime(task.frame.id, renderTime)

      // Check performance and adjust quality if needed
      if (renderTime > 16.67) { // Slower than 60fps
        this.performanceTracker.reportSlowRender(task.frame.id, renderTime)
      }

    } catch (error) {
      console.error('Frame render failed:', error)
      await this.renderFallback(task)
    }
  }

  private async renderFrameAsset(frame: FrameAsset, properties: FrameProperties): Promise<void> {
    if (!this.renderContext) return

    const ctx = this.renderContext

    ctx.save()

    // Apply frame properties
    if (properties.opacity < 1) {
      ctx.globalAlpha = properties.opacity
    }

    if (properties.shadow?.enabled) {
      ctx.shadowColor = properties.shadow.color
      ctx.shadowBlur = properties.shadow.blur
      ctx.shadowOffsetX = properties.shadow.offsetX
      ctx.shadowOffsetY = properties.shadow.offsetY
    }

    // Render based on frame type
    if (frame.type === 'svg') {
      await this.renderSVGFrame(frame.data as SVGElement, properties)
    } else {
      ctx.drawImage(frame.data as HTMLImageElement, 0, 0)
    }

    ctx.restore()
  }

  private async renderSVGFrame(svg: SVGElement, properties: FrameProperties): Promise<void> {
    if (!this.renderContext) return

    // Convert SVG to canvas for optimal performance
    const svgData = new XMLSerializer().serializeToString(svg)
    const img = new Image()

    return new Promise((resolve, reject) => {
      img.onload = () => {
        this.renderContext!.drawImage(img, 0, 0)
        resolve()
      }
      img.onerror = reject

      const blob = new Blob([svgData], { type: 'image/svg+xml' })
      img.src = URL.createObjectURL(blob)
    })
  }

  private yieldToMain(): Promise<void> {
    return new Promise(resolve => {
      if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
        // Use Scheduler API if available
        ;(window as any).scheduler.postTask(resolve, { priority: 'user-blocking' })
      } else {
        // Fallback to setTimeout
        setTimeout(resolve, 0)
      }
    })
  }
}

interface RenderTask {
  id: string
  canvas: HTMLCanvasElement
  frame: FrameAsset
  image: ImageData
  properties: FrameProperties
  priority: 'high' | 'low'
  startTime: number
  resolve?: () => void
  reject?: (error: Error) => void
}
```

### Performance Monitoring
```typescript
class PerformanceTracker {
  private metrics = {
    loadTimes: new Map<string, number[]>(),
    renderTimes: new Map<string, number[]>(),
    memoryUsage: [],
    slowRenders: []
  }

  recordLoadTime(frameId: string, time: number): void {
    if (!this.metrics.loadTimes.has(frameId)) {
      this.metrics.loadTimes.set(frameId, [])
    }
    this.metrics.loadTimes.get(frameId)!.push(time)

    // Keep only recent measurements
    const times = this.metrics.loadTimes.get(frameId)!
    if (times.length > 10) {
      times.shift()
    }
  }

  recordRenderTime(frameId: string, time: number): void {
    if (!this.metrics.renderTimes.has(frameId)) {
      this.metrics.renderTimes.set(frameId, [])
    }
    this.metrics.renderTimes.get(frameId)!.push(time)

    const times = this.metrics.renderTimes.get(frameId)!
    if (times.length > 10) {
      times.shift()
    }
  }

  reportSlowRender(frameId: string, time: number): void {
    this.metrics.slowRenders.push({
      frameId,
      time,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    })

    // Alert user if performance consistently poor
    const recentSlowRenders = this.metrics.slowRenders
      .filter(r => Date.now() - r.timestamp < 30000) // Last 30 seconds

    if (recentSlowRenders.length > 5) {
      this.suggestPerformanceMode()
    }
  }

  getAverageLoadTime(frameId: string): number {
    const times = this.metrics.loadTimes.get(frameId)
    if (!times || times.length === 0) return 0

    return times.reduce((sum, time) => sum + time, 0) / times.length
  }

  getAverageRenderTime(frameId: string): number {
    const times = this.metrics.renderTimes.get(frameId)
    if (!times || times.length === 0) return 0

    return times.reduce((sum, time) => sum + time, 0) / times.length
  }

  private suggestPerformanceMode(): void {
    // Notify user about performance issues
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Scroma Performance', {
        body: 'Consider enabling performance mode for smoother experience',
        icon: '/icon-192.png'
      })
    }

    // Could also show in-app notification
    console.warn('Performance issues detected. Consider reducing quality settings.')
  }
}
```

## Definition of Done

### Performance Requirements
- [ ] Frame loading completes asynchronously without blocking UI
- [ ] Frame asset caching provides instant switching for loaded frames
- [ ] SVG frames scale without quality loss at all zoom levels
- [ ] Frame rendering maintains 60fps during all operations
- [ ] Memory usage stays within reasonable bounds (<200MB)

### Technical Requirements
- [ ] requestAnimationFrame used for all smooth animations
- [ ] Memory cleanup prevents leaks during frame switching
- [ ] Performance monitoring tracks and reports slow operations
- [ ] Graceful degradation handles low-performance devices

### Quality Requirements
- [ ] No visual artifacts during frame transitions
- [ ] Frame quality preserved at all supported zoom levels
- [ ] Loading states provide clear feedback to users
- [ ] Fallback systems handle network and loading failures

## Success Metrics

### Performance Metrics
- **Target:** 95% of frame operations maintain 60fps
- **Measurement:** Real-time FPS monitoring during frame operations

### Loading Performance
- **Target:** Frame switching under 200ms for cached frames
- **Measurement:** Performance timing of frame application

### Memory Efficiency
- **Target:** Memory usage under 200MB for typical usage sessions
- **Measurement:** Browser memory profiling during extended use

### User Experience
- **Target:** <5% of users report performance issues
- **Measurement:** User feedback and error reporting

## Risk Assessment

### Primary Risk: Performance Degradation on Lower-End Devices
**Mitigation:**
- Device capability detection and automatic quality adjustment
- Performance mode with simplified rendering pipeline
- Frame complexity reduction for struggling devices

### Secondary Risk: Memory Leaks with Heavy Frame Usage
**Mitigation:**
- Aggressive cleanup of unused frame resources
- Memory monitoring with automatic garbage collection
- Frame cache size limits and intelligent eviction

### Rollback Plan
- Feature flags for individual optimization components
- Fallback to simpler rendering pipeline if optimizations fail
- Performance monitoring with automatic degradation

## Testing Strategy

### Performance Tests
- Frame loading and caching performance across different connection speeds
- Memory usage profiling during extended frame switching sessions
- Frame rendering performance with various frame complexities

### Load Tests
- Stress testing with rapid frame switching
- Large frame asset handling and memory management
- Concurrent frame loading behavior

### Browser Compatibility Tests
- Performance consistency across target browsers
- SVG rendering quality and performance validation
- Canvas performance on different graphics hardware