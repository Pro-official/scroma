'use client'

import { AppStore } from './index'
import { SliceCreator } from './types'
import { ImageData } from './canvas-slice'
import { UserPreferences } from './ui-slice'

export interface ActionDataMap {
  SET_IMAGE: { imageData: ImageData }
  CLEAR_IMAGE: { previousImage: ImageData | null }
  SET_ZOOM: { zoom: number; previousZoom: number }
  SET_PAN: { pan: { x: number; y: number }; previousPan: { x: number; y: number } }
  ADD_FILE: { fileId: string; fileName: string }
  UPDATE_PREFERENCES: { preferences: Partial<UserPreferences>; previousPreferences: UserPreferences }
  TEST_ACTION: { test?: string }
  DEFAULT: Record<string, string | number | boolean>
}

export type ActionData = ActionDataMap[keyof ActionDataMap]

export interface HistoryAction {
  type: string
  timestamp: number
  data: ActionData
  description?: string
}

export interface HistoryState {
  history: {
    actions: HistoryAction[]
    currentIndex: number
    maxSize: number
    canUndo: boolean
    canRedo: boolean
    isTracking: boolean
    lastSaveIndex: number
  }
}

export interface HistoryActions {
  addAction: (action: Omit<HistoryAction, 'timestamp'>) => void
  undo: () => void
  redo: () => void
  clearHistory: () => void
  canPerformUndo: () => boolean
  canPerformRedo: () => boolean
  startHistoryGroup: () => void
  endHistoryGroup: () => void
  markSavePoint: () => void
  hasUnsavedChanges: () => boolean
  getHistorySize: () => number
  setHistoryTracking: (enabled: boolean) => void
}

export interface HistorySlice extends HistoryState, HistoryActions {}

const initialHistoryState: HistoryState = {
  history: {
    actions: [],
    currentIndex: -1,
    maxSize: 50,
    canUndo: false,
    canRedo: false,
    isTracking: true,
    lastSaveIndex: -1,
  }
}

export const createHistorySlice: SliceCreator<AppStore, HistorySlice> = (set, get) => ({
  ...initialHistoryState,

  addAction: (action) => {
    // Don't track if tracking is disabled
    if (!get().history.isTracking) {
      return
    }

    set((state) => {
      // Remove any actions after current index (if we're in middle of history)
      state.history.actions = state.history.actions.slice(0, state.history.currentIndex + 1)

      // Add new action with timestamp
      const newAction: HistoryAction = {
        ...action,
        timestamp: Date.now()
      }
      state.history.actions.push(newAction)
      state.history.currentIndex = state.history.actions.length - 1

      // Trim history if it exceeds max size
      if (state.history.actions.length > state.history.maxSize) {
        const trimCount = state.history.actions.length - state.history.maxSize
        state.history.actions = state.history.actions.slice(trimCount)
        state.history.currentIndex = state.history.actions.length - 1

        // Adjust save index if needed
        if (state.history.lastSaveIndex >= 0) {
          state.history.lastSaveIndex = Math.max(-1, state.history.lastSaveIndex - trimCount)
        }
      }

      // Update undo/redo flags
      state.history.canUndo = state.history.currentIndex >= 0
      state.history.canRedo = false
    })
  },

  undo: () => {
    const { history } = get()
    if (!history.canUndo || history.currentIndex < 0) {
      return
    }

    const action = history.actions[history.currentIndex]

    set((state) => {
      // Apply undo logic based on action type
      switch (action.type) {
        case 'SET_IMAGE':
          // Clear the image
          state.canvas.image = null
          state.canvas.viewport.zoom = 1
          state.canvas.viewport.panX = 0
          state.canvas.viewport.panY = 0
          break

        case 'CLEAR_IMAGE':
          // Restore the previous image
          if ('previousImage' in action.data) {
            const data = action.data as { previousImage: ImageData | null }
            state.canvas.image = data.previousImage
          }
          break

        case 'SET_ZOOM':
          // Restore previous zoom
          if ('previousZoom' in action.data) {
            const data = action.data as { zoom: number; previousZoom: number }
            state.canvas.viewport.zoom = data.previousZoom
          }
          break

        case 'SET_PAN':
          // Restore previous pan position
          if ('previousPan' in action.data) {
            const data = action.data as { pan: { x: number; y: number }; previousPan: { x: number; y: number } }
            state.canvas.viewport.panX = data.previousPan.x
            state.canvas.viewport.panY = data.previousPan.y
          }
          break

        case 'ADD_FILE':
          // Remove the file from upload queue
          if ('fileId' in action.data && 'fileName' in action.data) {
            const data = action.data as { fileId: string; fileName: string }
            state.upload.files = state.upload.files.filter((f: { id: string }) => f.id !== data.fileId)
            state.upload.queue = state.upload.queue.filter((id: string) => id !== data.fileId)
          }
          break

        case 'UPDATE_PREFERENCES':
          // Restore previous preferences
          if ('previousPreferences' in action.data) {
            const data = action.data as { preferences: Partial<UserPreferences>; previousPreferences: UserPreferences }
            state.ui.preferences = data.previousPreferences
          }
          break
      }

      // Update history state
      state.history.currentIndex -= 1
      state.history.canUndo = state.history.currentIndex >= 0
      state.history.canRedo = true
    })

    // Show undo notification
    if ('addNotification' in get()) {
      get().addNotification({
        type: 'info',
        title: 'Action undone',
        message: action.description || `Undid: ${action.type}`,
        duration: 2000
      })
    }
  },

  redo: () => {
    const { history } = get()
    if (!history.canRedo || history.currentIndex >= history.actions.length - 1) {
      return
    }

    const nextIndex = history.currentIndex + 1
    const action = history.actions[nextIndex]

    set((state) => {
      // Apply redo logic based on action type
      switch (action.type) {
        case 'SET_IMAGE':
          // Restore the image
          if ('imageData' in action.data) {
            const data = action.data as { imageData: ImageData }
            state.canvas.image = data.imageData
            state.canvas.viewport.zoom = 1
            state.canvas.viewport.panX = 0
            state.canvas.viewport.panY = 0
          }
          break

        case 'CLEAR_IMAGE':
          // Clear the image again
          state.canvas.image = null
          state.canvas.viewport.zoom = 1
          state.canvas.viewport.panX = 0
          state.canvas.viewport.panY = 0
          break

        case 'SET_ZOOM':
          // Apply the zoom again
          if ('zoom' in action.data) {
            const data = action.data as { zoom: number; previousZoom: number }
            state.canvas.viewport.zoom = data.zoom
          }
          break

        case 'SET_PAN':
          // Apply the pan again
          if ('pan' in action.data) {
            const data = action.data as { pan: { x: number; y: number }; previousPan: { x: number; y: number } }
            state.canvas.viewport.panX = data.pan.x
            state.canvas.viewport.panY = data.pan.y
          }
          break

        case 'ADD_FILE':
          // Re-add the file (would need to be handled by upload logic)
          // This is simplified - actual implementation would need the file data
          break

        case 'UPDATE_PREFERENCES':
          // Apply the preferences again
          if ('preferences' in action.data) {
            const data = action.data as { preferences: Partial<UserPreferences>; previousPreferences: UserPreferences }
            state.ui.preferences = {
              ...state.ui.preferences,
              ...data.preferences
            }
          }
          break
      }

      // Update history state
      state.history.currentIndex = nextIndex
      state.history.canRedo = state.history.currentIndex < state.history.actions.length - 1
      state.history.canUndo = true
    })

    // Show redo notification
    if ('addNotification' in get()) {
      get().addNotification({
        type: 'info',
        title: 'Action redone',
        message: action.description || `Redid: ${action.type}`,
        duration: 2000
      })
    }
  },

  clearHistory: () => {
    set((state) => {
      state.history.actions = []
      state.history.currentIndex = -1
      state.history.canUndo = false
      state.history.canRedo = false
      state.history.lastSaveIndex = -1
    })
  },

  canPerformUndo: () => {
    return get().history.canUndo && get().history.currentIndex >= 0
  },

  canPerformRedo: () => {
    const { history } = get()
    return history.canRedo && history.currentIndex < history.actions.length - 1
  },

  startHistoryGroup: () => {
    // This would be used to group multiple actions together
    // Implementation would track group start and combine actions
    set((state) => {
      state.history.isTracking = false
    })
  },

  endHistoryGroup: () => {
    // End grouping and add combined action
    set((state) => {
      state.history.isTracking = true
    })
  },

  markSavePoint: () => {
    set((state) => {
      state.history.lastSaveIndex = state.history.currentIndex
    })
  },

  hasUnsavedChanges: () => {
    const { history } = get()
    return history.currentIndex !== history.lastSaveIndex
  },

  getHistorySize: () => {
    return get().history.actions.length
  },

  setHistoryTracking: (enabled) => {
    set((state) => {
      state.history.isTracking = enabled
    })
  },
})