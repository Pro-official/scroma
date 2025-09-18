import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAppStore } from '@/stores'
import { ImageData } from '@/stores/canvas-slice'

describe('Canvas Slice', () => {
  beforeEach(() => {
    // Reset store before each test
    useAppStore.setState(() => ({
      canvas: {
        image: null,
        viewport: {
          width: 1200,
          height: 800,
          zoom: 1,
          panX: 0,
          panY: 0,
          minZoom: 0.1,
          maxZoom: 5.0,
        },
        interaction: {
          isDragging: false,
          isZooming: false,
          dragStart: null,
        },
      }
    }))
  })

  describe('Image Management', () => {
    it('should set image correctly', () => {
      const { result } = renderHook(() => useAppStore())

      const imageData: ImageData = {
        src: 'blob:test-image',
        originalWidth: 1920,
        originalHeight: 1080,
        fileName: 'test.jpg',
        fileSize: 1024000,
        format: 'jpeg'
      }

      act(() => {
        result.current.setImage(imageData)
      })

      expect(result.current.canvas.image).toEqual(imageData)
      expect(result.current.canvas.viewport.zoom).toBe(1)
      expect(result.current.canvas.viewport.panX).toBe(0)
      expect(result.current.canvas.viewport.panY).toBe(0)
    })

    it('should clear image and reset viewport', () => {
      const { result } = renderHook(() => useAppStore())

      const imageData: ImageData = {
        src: 'blob:test-image',
        originalWidth: 1920,
        originalHeight: 1080,
        fileName: 'test.jpg',
        fileSize: 1024000,
        format: 'jpeg'
      }

      act(() => {
        result.current.setImage(imageData)
        result.current.setZoom(2)
        result.current.setPan(100, 50)
      })

      act(() => {
        result.current.clearImage()
      })

      expect(result.current.canvas.image).toBeNull()
      expect(result.current.canvas.viewport.zoom).toBe(1)
      expect(result.current.canvas.viewport.panX).toBe(0)
      expect(result.current.canvas.viewport.panY).toBe(0)
    })
  })

  describe('Zoom Operations', () => {
    it('should set zoom within valid range', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setZoom(2.5)
      })
      expect(result.current.canvas.viewport.zoom).toBe(2.5)

      act(() => {
        result.current.setZoom(10) // Above max
      })
      expect(result.current.canvas.viewport.zoom).toBe(5.0) // Clamped to max

      act(() => {
        result.current.setZoom(0.01) // Below min
      })
      expect(result.current.canvas.viewport.zoom).toBe(0.1) // Clamped to min
    })

    it('should zoom in correctly', () => {
      const { result } = renderHook(() => useAppStore())

      const initialZoom = result.current.canvas.viewport.zoom
      act(() => {
        result.current.zoomIn()
      })
      expect(result.current.canvas.viewport.zoom).toBe(initialZoom * 1.2)
    })

    it('should zoom out correctly', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setZoom(2)
      })
      const currentZoom = result.current.canvas.viewport.zoom

      act(() => {
        result.current.zoomOut()
      })
      expect(result.current.canvas.viewport.zoom).toBe(currentZoom / 1.2)
    })
  })

  describe('Pan Operations', () => {
    it('should set pan position', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setPan(150, -75)
      })

      expect(result.current.canvas.viewport.panX).toBe(150)
      expect(result.current.canvas.viewport.panY).toBe(-75)
    })

    it('should handle drag operations', () => {
      const { result } = renderHook(() => useAppStore())

      // Start drag
      act(() => {
        result.current.startDrag(100, 100)
      })
      expect(result.current.canvas.interaction.isDragging).toBe(true)
      expect(result.current.canvas.interaction.dragStart).toEqual({ x: 100, y: 100 })

      // Update drag
      act(() => {
        result.current.updateDrag(150, 120)
      })
      expect(result.current.canvas.viewport.panX).toBe(50) // 150 - 100
      expect(result.current.canvas.viewport.panY).toBe(20) // 120 - 100

      // End drag
      act(() => {
        result.current.endDrag()
      })
      expect(result.current.canvas.interaction.isDragging).toBe(false)
      expect(result.current.canvas.interaction.dragStart).toBeNull()
    })
  })

  describe('Viewport Operations', () => {
    it('should set viewport size', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setViewportSize(1600, 900)
      })

      expect(result.current.canvas.viewport.width).toBe(1600)
      expect(result.current.canvas.viewport.height).toBe(900)
    })

    it('should reset canvas state', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setZoom(3)
        result.current.setPan(200, 150)
        result.current.startDrag(50, 50)
      })

      act(() => {
        result.current.resetCanvas()
      })

      expect(result.current.canvas.viewport.zoom).toBe(1)
      expect(result.current.canvas.viewport.panX).toBe(0)
      expect(result.current.canvas.viewport.panY).toBe(0)
      expect(result.current.canvas.interaction.isDragging).toBe(false)
      expect(result.current.canvas.interaction.dragStart).toBeNull()
    })

    it('should fit image to screen', () => {
      const { result } = renderHook(() => useAppStore())

      const imageData: ImageData = {
        src: 'blob:test-image',
        originalWidth: 3000,
        originalHeight: 2000,
        fileName: 'test.jpg',
        fileSize: 1024000,
        format: 'jpeg'
      }

      act(() => {
        result.current.setImage(imageData)
        result.current.fitToScreen()
      })

      // Check zoom is calculated correctly (viewport width / image width * 0.9)
      const expectedZoom = (1200 / 3000) * 0.9
      expect(result.current.canvas.viewport.zoom).toBeCloseTo(expectedZoom, 2)
      expect(result.current.canvas.viewport.panX).toBe(0)
      expect(result.current.canvas.viewport.panY).toBe(0)
    })
  })
})