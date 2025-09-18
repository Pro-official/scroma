'use client'

import { AppStore } from './index'
import { SliceCreator } from './types'

export interface MemoryUsageEntry {
  timestamp: number
  usage: number
  category: 'canvas' | 'upload' | 'history' | 'other'
}

export interface MemoryState {
  memory: {
    current: number
    limit: number
    warningThreshold: number
    criticalThreshold: number
    history: MemoryUsageEntry[]
    lastCleanup: number
    isMonitoring: boolean
    autoCleanup: boolean
    cleanupInProgress: boolean
  }
}

export interface MemoryActions {
  updateMemoryUsage: (usage: number, category?: MemoryUsageEntry['category']) => void
  triggerMemoryWarning: () => void
  triggerCriticalMemoryWarning: () => void
  performMemoryCleanup: () => Promise<void>
  addMemoryHistoryEntry: (usage: number, category: MemoryUsageEntry['category']) => void
  resetMemoryTracking: () => void
  checkMemoryBeforeAction: (estimatedSize: number) => boolean
  cleanupMemoryIfNeeded: () => Promise<void>
  setAutoCleanup: (enabled: boolean) => void
  getMemoryReport: () => {
    canvasMemory: number
    uploadMemory: number
    historyMemory: number
    totalMemory: number
  }
}

export interface MemorySlice extends MemoryState, MemoryActions {}

const MEMORY_LIMIT_MB = 500
const WARNING_THRESHOLD_MB = 400
const CRITICAL_THRESHOLD_MB = 450

const initialMemoryState: MemoryState = {
  memory: {
    current: 0,
    limit: MEMORY_LIMIT_MB,
    warningThreshold: WARNING_THRESHOLD_MB,
    criticalThreshold: CRITICAL_THRESHOLD_MB,
    history: [],
    lastCleanup: Date.now(),
    isMonitoring: true,
    autoCleanup: true,
    cleanupInProgress: false,
  }
}

export const createMemorySlice: SliceCreator<AppStore, MemorySlice> = (set, get) => ({
  ...initialMemoryState,

  updateMemoryUsage: (usage, category = 'other') => {
    set((state) => {
      state.memory.current = usage

      // Add to history
      state.memory.history.push({
        timestamp: Date.now(),
        usage,
        category
      })

      // Keep only last 100 entries
      if (state.memory.history.length > 100) {
        state.memory.history = state.memory.history.slice(-100)
      }
    })

    // Check thresholds
    const { memory } = get()
    if (usage >= memory.criticalThreshold) {
      get().triggerCriticalMemoryWarning()
    } else if (usage >= memory.warningThreshold) {
      get().triggerMemoryWarning()
    }

    // Auto cleanup if needed
    if (memory.autoCleanup && usage >= memory.criticalThreshold && !memory.cleanupInProgress) {
      get().cleanupMemoryIfNeeded()
    }
  },

  triggerMemoryWarning: () => {
    const { memory } = get()

    if ('addNotification' in get()) {
      get().addNotification({
        type: 'warning',
        title: 'Memory Usage High',
        message: `Using ${memory.current}MB of ${memory.limit}MB available`,
        duration: 5000
      })
    }
  },

  triggerCriticalMemoryWarning: () => {
    const { memory } = get()

    if ('addNotification' in get()) {
      get().addNotification({
        type: 'error',
        title: 'Critical Memory Usage',
        message: `Memory usage critical: ${memory.current}MB of ${memory.limit}MB. Some features may be disabled.`,
        duration: 0 // Don't auto-dismiss
      })
    }
  },

  performMemoryCleanup: async () => {
    set((state) => {
      state.memory.cleanupInProgress = true
    })

    try {
      // Clean up completed uploads
      set((state) => {
        const completedFiles = state.upload.files.filter(f => f.status === 'completed')

        // Release preview URLs
        completedFiles.forEach(file => {
          if (file.previewUrl && file.previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(file.previewUrl)
          }
        })

        // Remove completed files
        state.upload.files = state.upload.files.filter(f => f.status !== 'completed')
      })

      // Trim history
      set((state) => {
        const maxHistorySize = 20
        if (state.history.actions.length > maxHistorySize) {
          state.history.actions = state.history.actions.slice(-maxHistorySize)
          state.history.currentIndex = Math.min(state.history.currentIndex, state.history.actions.length - 1)
        }
      })

      // Clear old notifications
      set((state) => {
        state.ui.notifications = state.ui.notifications.slice(-5)
      })

      // Clear old errors
      set((state) => {
        state.upload.errors = state.upload.errors.slice(-10)
      })

      // Update last cleanup time
      set((state) => {
        state.memory.lastCleanup = Date.now()
      })

      // Force garbage collection if available (browser-specific)
      if (typeof (globalThis as { gc?: () => void }).gc === 'function') {
        (globalThis as { gc?: () => void }).gc?.()
      }

      // Recalculate memory usage
      const report = get().getMemoryReport()
      get().updateMemoryUsage(report.totalMemory, 'other')

      if ('addNotification' in get()) {
        get().addNotification({
          type: 'success',
          title: 'Memory Cleanup Complete',
          message: `Freed memory. Current usage: ${get().memory.current}MB`,
          duration: 3000
        })
      }

    } catch (error) {
      console.error('Memory cleanup failed:', error)

      if ('addNotification' in get()) {
        get().addNotification({
          type: 'error',
          title: 'Memory Cleanup Failed',
          message: 'Unable to free memory. Please reload the application.',
          duration: 0
        })
      }
    } finally {
      set((state) => {
        state.memory.cleanupInProgress = false
      })
    }
  },

  addMemoryHistoryEntry: (usage, category) => {
    set((state) => {
      state.memory.history.push({
        timestamp: Date.now(),
        usage,
        category
      })

      // Keep only last 100 entries
      if (state.memory.history.length > 100) {
        state.memory.history = state.memory.history.slice(-100)
      }
    })
  },

  resetMemoryTracking: () => {
    set((state) => {
      state.memory = {
        ...initialMemoryState.memory,
        isMonitoring: state.memory.isMonitoring,
        autoCleanup: state.memory.autoCleanup
      }
    })
  },

  checkMemoryBeforeAction: (estimatedSize) => {
    const { memory } = get()
    const estimatedUsage = memory.current + estimatedSize

    if (estimatedUsage > memory.limit) {
      if ('addNotification' in get()) {
        get().addNotification({
          type: 'error',
          title: 'Memory Limit Exceeded',
          message: 'This action would exceed the memory limit. Please free up memory first.',
          duration: 5000
        })
      }
      return false
    }

    if (estimatedUsage > memory.criticalThreshold) {
      if ('addNotification' in get()) {
        get().addNotification({
          type: 'warning',
          title: 'High Memory Usage',
          message: 'This action will use significant memory. Consider clearing unused data.',
          duration: 5000
        })
      }
    }

    return true
  },

  cleanupMemoryIfNeeded: async () => {
    const { memory } = get()

    if (memory.current >= memory.criticalThreshold && !memory.cleanupInProgress) {
      await get().performMemoryCleanup()
    }
  },

  setAutoCleanup: (enabled) => {
    set((state) => {
      state.memory.autoCleanup = enabled
    })
  },

  getMemoryReport: () => {
    const state = get()

    // Estimate memory usage (simplified calculation)
    let canvasMemory = 0
    if (state.canvas.image) {
      // Rough estimate: 4 bytes per pixel
      canvasMemory = (state.canvas.image.originalWidth * state.canvas.image.originalHeight * 4) / (1024 * 1024)
    }

    let uploadMemory = 0
    state.upload.files.forEach(file => {
      uploadMemory += file.file.size / (1024 * 1024)
    })

    let historyMemory = 0
    // Rough estimate: 1KB per action
    historyMemory = state.history.actions.length * 0.001

    const totalMemory = Math.round(canvasMemory + uploadMemory + historyMemory)

    return {
      canvasMemory: Math.round(canvasMemory),
      uploadMemory: Math.round(uploadMemory),
      historyMemory: Math.round(historyMemory),
      totalMemory
    }
  },
})