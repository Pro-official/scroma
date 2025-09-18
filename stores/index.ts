'use client'

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'

// Import all slices
import { createCanvasSlice, CanvasSlice } from './canvas-slice'
import { createUploadSlice, UploadSlice } from './upload-slice'
import { createHistorySlice, HistorySlice } from './history-slice'
import { createUISlice, UISlice } from './ui-slice'
import { createMemorySlice, MemorySlice } from './memory-slice'

// Combined store type for Next.js
export interface AppStore extends
  CanvasSlice,
  UploadSlice,
  HistorySlice,
  UISlice,
  MemorySlice {
  // Cross-slice actions
  initializeSession: () => void
  resetApp: () => void
  resetPartial: (slices: Array<'canvas' | 'upload' | 'ui' | 'history' | 'memory'>) => void
}

// Create store with middleware optimized for Next.js
export const useAppStore = create<AppStore>()(
  devtools(
    subscribeWithSelector(
      persist(
        immer<AppStore>((set, get, api) => ({
          // Combine all slices
          ...createCanvasSlice(set, get, api),
          ...createUploadSlice(set, get, api),
          ...createHistorySlice(set, get, api),
          ...createUISlice(set, get, api),
          ...createMemorySlice(set, get, api),

          // Cross-slice actions
          initializeSession: () => {
            set((state) => {
              // Initialize memory monitoring
              if (state.memory.isMonitoring) {
                const report = get().getMemoryReport()
                state.memory.current = report.totalMemory
              }

              // Set theme based on system preference
              if (state.ui.preferences.theme === 'system') {
                state.ui.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
              } else {
                state.ui.isDarkMode = state.ui.preferences.theme === 'dark'
              }

              // Check for mobile
              state.ui.isMobile = window.innerWidth < 768

              // Update last interaction
              state.ui.lastInteraction = Date.now()
            })

            // Show welcome notification
            if ('addNotification' in get()) {
              get().addNotification({
                type: 'success',
                title: 'Welcome to Scroma',
                message: 'Your session has been restored',
                duration: 3000
              })
            }
          },

          resetApp: () => {
            const confirmReset = window.confirm(
              'Are you sure you want to reset the application? This will clear all data and cannot be undone.'
            )

            if (!confirmReset) {
              return
            }

            set((state) => {
              // Clear canvas
              if (state.canvas.image?.src && state.canvas.image.src.startsWith('blob:')) {
                URL.revokeObjectURL(state.canvas.image.src)
              }
              state.canvas = createCanvasSlice(set, get, api).canvas

              // Clear uploads
              state.upload.files.forEach(file => {
                if (file.previewUrl && file.previewUrl.startsWith('blob:')) {
                  URL.revokeObjectURL(file.previewUrl)
                }
              })
              state.upload = createUploadSlice(set, get, api).upload

              // Clear history
              state.history = createHistorySlice(set, get, api).history

              // Reset UI (but keep preferences)
              const { preferences } = state.ui
              state.ui = {
                ...createUISlice(set, get, api).ui,
                preferences
              }

              // Reset memory tracking
              state.memory = createMemorySlice(set, get, api).memory
            })

            // Show reset notification
            if ('addNotification' in get()) {
              get().addNotification({
                type: 'info',
                title: 'Application Reset',
                message: 'All data has been cleared',
                duration: 3000
              })
            }
          },

          resetPartial: (slices) => {
            set((state) => {
              slices.forEach(slice => {
                switch (slice) {
                  case 'canvas':
                    if (state.canvas.image?.src && state.canvas.image.src.startsWith('blob:')) {
                      URL.revokeObjectURL(state.canvas.image.src)
                    }
                    state.canvas = createCanvasSlice(set, get, api).canvas
                    break

                  case 'upload':
                    state.upload.files.forEach(file => {
                      if (file.previewUrl && file.previewUrl.startsWith('blob:')) {
                        URL.revokeObjectURL(file.previewUrl)
                      }
                    })
                    state.upload = createUploadSlice(set, get, api).upload
                    break

                  case 'ui':
                    const { preferences } = state.ui
                    state.ui = {
                      ...createUISlice(set, get, api).ui,
                      preferences
                    }
                    break

                  case 'history':
                    state.history = createHistorySlice(set, get, api).history
                    break

                  case 'memory':
                    state.memory = createMemorySlice(set, get, api).memory
                    break
                }
              })
            })

            // Show notification
            if ('addNotification' in get()) {
              get().addNotification({
                type: 'info',
                title: 'Data Cleared',
                message: `Cleared: ${slices.join(', ')}`,
                duration: 3000
              })
            }
          },
        })),
        {
          name: 'scroma-app-storage',
          version: 1,
          partialize: (state) => ({
            canvas: {
              // Don't persist image data (too large)
              viewport: state.canvas.viewport,
            },
            upload: {
              recentFiles: state.upload.recentFiles,
              settings: state.upload.settings,
            },
            ui: {
              preferences: state.ui.preferences,
              panelStates: state.ui.panelStates,
            },
            // Don't persist history or memory (runtime only)
          }),
          onRehydrateStorage: () => (state) => {
            // Initialize session after rehydration
            state?.initializeSession()
          },
        }
      )
    ),
    {
      name: 'Scroma App Store',
      trace: true,
    }
  )
)

// Selectors for optimized Next.js component subscriptions
export const appSelectors = {
  // Canvas selectors
  canvasImage: (state: AppStore) => state.canvas.image,
  canvasViewport: (state: AppStore) => state.canvas.viewport,
  canvasZoom: (state: AppStore) => state.canvas.viewport.zoom,
  canvasInteraction: (state: AppStore) => state.canvas.interaction,

  // Upload selectors
  uploadFiles: (state: AppStore) => state.upload.files,
  uploadQueue: (state: AppStore) => state.upload.queue,
  isUploading: (state: AppStore) => state.upload.isUploading,
  uploadProgress: (state: AppStore) => state.upload.uploadProgress,
  uploadSettings: (state: AppStore) => state.upload.settings,
  recentFiles: (state: AppStore) => state.upload.recentFiles,

  // History selectors
  canUndo: (state: AppStore) => state.history.canUndo,
  canRedo: (state: AppStore) => state.history.canRedo,
  historyLength: (state: AppStore) => state.history.actions.length,
  hasUnsavedChanges: (state: AppStore) => state.hasUnsavedChanges(),

  // UI selectors
  activePanel: (state: AppStore) => state.ui.activePanel,
  openModal: (state: AppStore) => state.ui.openModal,
  preferences: (state: AppStore) => state.ui.preferences,
  notifications: (state: AppStore) => state.ui.notifications,
  isDarkMode: (state: AppStore) => state.ui.isDarkMode,
  isMobile: (state: AppStore) => state.ui.isMobile,
  isFullscreen: (state: AppStore) => state.ui.isFullscreen,

  // Memory selectors
  memoryUsage: (state: AppStore) => state.memory.current,
  memoryLimit: (state: AppStore) => state.memory.limit,
  memoryPercentage: (state: AppStore) => (state.memory.current / state.memory.limit) * 100,
  isMemoryCritical: (state: AppStore) => state.memory.current >= state.memory.criticalThreshold,
  isMemoryWarning: (state: AppStore) => state.memory.current >= state.memory.warningThreshold,

  // Combined selectors
  isWorking: (state: AppStore) => state.upload.isUploading || state.memory.cleanupInProgress,
  hasData: (state: AppStore) => state.canvas.image !== null || state.upload.files.length > 0,
}

// Export store for external access (testing, debugging)
export const store = useAppStore