import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAppStore } from '@/stores'
import { ImageData } from '@/stores/canvas-slice'

describe('History Slice', () => {
  beforeEach(() => {
    // Reset store before each test
    useAppStore.setState(() => ({
      history: {
        actions: [],
        currentIndex: -1,
        maxSize: 50,
        canUndo: false,
        canRedo: false,
        isTracking: true,
        lastSaveIndex: -1,
      },
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

  describe('Action Recording', () => {
    it('should add actions to history', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.addAction({
          type: 'TEST_ACTION',
          data: { test: 'data' },
          description: 'Test action'
        })
      })

      expect(result.current.history.actions).toHaveLength(1)
      expect(result.current.history.actions[0].type).toBe('TEST_ACTION')
      expect(result.current.history.currentIndex).toBe(0)
      expect(result.current.history.canUndo).toBe(true)
      expect(result.current.history.canRedo).toBe(false)
    })

    it('should trim history when exceeding max size', () => {
      const { result } = renderHook(() => useAppStore())

      // Set a small max size for testing
      act(() => {
        useAppStore.setState((state) => ({
          history: {
            ...state.history,
            maxSize: 3
          }
        }))
      })

      // Add more actions than max size
      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.addAction({
            type: `ACTION_${i}`,
            data: { index: i }
          })
        }
      })

      expect(result.current.history.actions).toHaveLength(3)
      expect(result.current.history.actions[0].type).toBe('ACTION_2')
      expect(result.current.history.actions[2].type).toBe('ACTION_4')
    })

    it('should clear future actions when adding new action after undo', () => {
      const { result } = renderHook(() => useAppStore())

      // Add initial actions
      act(() => {
        result.current.addAction({ type: 'ACTION_1', data: { test: 'action1' } })
        result.current.addAction({ type: 'ACTION_2', data: { test: 'action2' } })
        result.current.addAction({ type: 'ACTION_3', data: {} })
      })

      // Undo twice
      act(() => {
        result.current.undo()
        result.current.undo()
      })

      expect(result.current.history.currentIndex).toBe(0)

      // Add new action
      act(() => {
        result.current.addAction({ type: 'NEW_ACTION', data: {} })
      })

      expect(result.current.history.actions).toHaveLength(2)
      expect(result.current.history.actions[1].type).toBe('NEW_ACTION')
      expect(result.current.history.canRedo).toBe(false)
    })
  })

  describe('Undo/Redo Operations', () => {
    it('should undo and redo image actions', () => {
      const { result } = renderHook(() => useAppStore())

      const imageData: ImageData = {
        src: 'blob:test-image',
        originalWidth: 1920,
        originalHeight: 1080,
        fileName: 'test.jpg',
        fileSize: 1024000,
        format: 'jpeg'
      }

      // Set image (this should add to history)
      act(() => {
        result.current.setImage(imageData)
      })

      expect(result.current.canvas.image).toEqual(imageData)
      expect(result.current.history.canUndo).toBe(true)

      // Undo
      act(() => {
        result.current.undo()
      })

      expect(result.current.canvas.image).toBeNull()
      expect(result.current.history.canUndo).toBe(false)
      expect(result.current.history.canRedo).toBe(true)

      // Redo
      act(() => {
        result.current.redo()
      })

      expect(result.current.canvas.image).toEqual(imageData)
      expect(result.current.history.canUndo).toBe(true)
      expect(result.current.history.canRedo).toBe(false)
    })

    it('should handle multiple undo/redo operations', () => {
      const { result } = renderHook(() => useAppStore())

      // Add multiple actions
      act(() => {
        result.current.addAction({ type: 'ACTION_1', data: { test: 'value1' } })
        result.current.addAction({ type: 'ACTION_2', data: { test: 'value2' } })
        result.current.addAction({ type: 'ACTION_3', data: { test: 'value3' } })
      })

      expect(result.current.history.currentIndex).toBe(2)

      // Undo all
      act(() => {
        result.current.undo()
        result.current.undo()
        result.current.undo()
      })

      expect(result.current.history.currentIndex).toBe(-1)
      expect(result.current.history.canUndo).toBe(false)
      expect(result.current.history.canRedo).toBe(true)

      // Redo all
      act(() => {
        result.current.redo()
        result.current.redo()
        result.current.redo()
      })

      expect(result.current.history.currentIndex).toBe(2)
      expect(result.current.history.canUndo).toBe(true)
      expect(result.current.history.canRedo).toBe(false)
    })
  })

  describe('History Management', () => {
    it('should clear history', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.addAction({ type: 'ACTION_1', data: { test: 'action1' } })
        result.current.addAction({ type: 'ACTION_2', data: { test: 'action2' } })
      })

      expect(result.current.history.actions).toHaveLength(2)

      act(() => {
        result.current.clearHistory()
      })

      expect(result.current.history.actions).toHaveLength(0)
      expect(result.current.history.currentIndex).toBe(-1)
      expect(result.current.history.canUndo).toBe(false)
      expect(result.current.history.canRedo).toBe(false)
    })

    it('should track save points and unsaved changes', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.addAction({ type: 'ACTION_1', data: {} })
      })

      expect(result.current.hasUnsavedChanges()).toBe(true)

      act(() => {
        result.current.markSavePoint()
      })

      expect(result.current.hasUnsavedChanges()).toBe(false)

      act(() => {
        result.current.addAction({ type: 'ACTION_2', data: {} })
      })

      expect(result.current.hasUnsavedChanges()).toBe(true)
    })

    it('should control history tracking', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setHistoryTracking(false)
      })

      act(() => {
        result.current.addAction({ type: 'UNTRACKED_ACTION', data: {} })
      })

      expect(result.current.history.actions).toHaveLength(0)

      act(() => {
        result.current.setHistoryTracking(true)
        result.current.addAction({ type: 'TRACKED_ACTION', data: {} })
      })

      expect(result.current.history.actions).toHaveLength(1)
      expect(result.current.history.actions[0].type).toBe('TRACKED_ACTION')
    })
  })

  describe('Helper Functions', () => {
    it('should correctly check if can perform undo', () => {
      const { result } = renderHook(() => useAppStore())

      expect(result.current.canPerformUndo()).toBe(false)

      act(() => {
        result.current.addAction({ type: 'ACTION', data: {} })
      })

      expect(result.current.canPerformUndo()).toBe(true)
    })

    it('should correctly check if can perform redo', () => {
      const { result } = renderHook(() => useAppStore())

      expect(result.current.canPerformRedo()).toBe(false)

      act(() => {
        result.current.addAction({ type: 'ACTION', data: {} })
        result.current.undo()
      })

      expect(result.current.canPerformRedo()).toBe(true)
    })

    it('should return correct history size', () => {
      const { result } = renderHook(() => useAppStore())

      expect(result.current.getHistorySize()).toBe(0)

      act(() => {
        result.current.addAction({ type: 'ACTION_1', data: { test: 'action1' } })
        result.current.addAction({ type: 'ACTION_2', data: { test: 'action2' } })
      })

      expect(result.current.getHistorySize()).toBe(2)
    })
  })
})