'use client'

import { AppStore } from './index'
import { SliceCreator } from './types'

export type PanelType = 'frames' | 'backgrounds' | 'text' | 'export' | 'settings' | 'help'
export type ModalType = 'export' | 'settings' | 'shortcuts' | 'about' | null
export type Theme = 'light' | 'dark' | 'system'

export interface PanelState {
  isOpen: boolean
  width?: number
  height?: number
  position?: { x: number; y: number }
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message?: string
  duration?: number
  createdAt: number
}

export interface UserPreferences {
  theme: Theme
  autoSave: boolean
  autoSaveInterval: number
  showGrid: boolean
  gridSize: number
  snapToGrid: boolean
  showRulers: boolean
  keyboardShortcutsEnabled: boolean
  language: string
  compactMode: boolean
}

export interface UIState {
  ui: {
    activePanel: PanelType | null
    openModal: ModalType
    panelStates: Record<PanelType, PanelState>
    preferences: UserPreferences
    notifications: Notification[]
    loadingStates: Record<string, boolean>
    progressStates: Record<string, number>
    sidebarCollapsed: boolean
    toolbarVisible: boolean
    isMobile: boolean
    isFullscreen: boolean
    isDarkMode: boolean
    lastInteraction: number
  }
}

export interface UIActions {
  setActivePanel: (panel: PanelType | null) => void
  togglePanel: (panel: PanelType) => void
  setPanelState: (panel: PanelType, state: Partial<PanelState>) => void
  openModal: (modal: ModalType) => void
  closeModal: () => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => string
  removeNotification: (id: string) => void
  clearNotifications: () => void
  setLoading: (key: string, isLoading: boolean) => void
  setProgress: (key: string, progress: number) => void
  toggleSidebar: () => void
  toggleToolbar: () => void
  toggleFullscreen: () => void
  setIsMobile: (isMobile: boolean) => void
  setTheme: (theme: Theme) => void
  recordInteraction: () => void
  resetUIState: () => void
}

export interface UISlice extends UIState, UIActions {}

const initialUIState: UIState = {
  ui: {
    activePanel: null,
    openModal: null,
    panelStates: {
      frames: { isOpen: false, width: 280 },
      backgrounds: { isOpen: false, width: 280 },
      text: { isOpen: false, width: 280 },
      export: { isOpen: false, width: 350 },
      settings: { isOpen: false, width: 400 },
      help: { isOpen: false, width: 350 },
    },
    preferences: {
      theme: 'system',
      autoSave: true,
      autoSaveInterval: 30000,
      showGrid: false,
      gridSize: 20,
      snapToGrid: false,
      showRulers: false,
      keyboardShortcutsEnabled: true,
      language: 'en',
      compactMode: false,
    },
    notifications: [],
    loadingStates: {},
    progressStates: {},
    sidebarCollapsed: false,
    toolbarVisible: true,
    isMobile: false,
    isFullscreen: false,
    isDarkMode: false,
    lastInteraction: Date.now(),
  }
}

export const createUISlice: SliceCreator<AppStore, UISlice> = (set, get) => ({
  ...initialUIState,

  setActivePanel: (panel) => {
    set((state) => {
      // Close current panel if same panel is clicked
      if (state.ui.activePanel === panel) {
        state.ui.activePanel = null
        if (panel) {
          state.ui.panelStates[panel].isOpen = false
        }
      } else {
        // Close previous panel
        if (state.ui.activePanel) {
          state.ui.panelStates[state.ui.activePanel].isOpen = false
        }

        // Open new panel
        state.ui.activePanel = panel
        if (panel) {
          state.ui.panelStates[panel].isOpen = true
        }
      }

      state.ui.lastInteraction = Date.now()
    })
  },

  togglePanel: (panel) => {
    const currentPanel = get().ui.activePanel
    if (currentPanel === panel) {
      get().setActivePanel(null)
    } else {
      get().setActivePanel(panel)
    }
  },

  setPanelState: (panel, state) => {
    set((draft) => {
      draft.ui.panelStates[panel] = {
        ...draft.ui.panelStates[panel],
        ...state
      }
    })
  },

  openModal: (modal) => {
    set((state) => {
      state.ui.openModal = modal
      state.ui.lastInteraction = Date.now()
    })
  },

  closeModal: () => {
    set((state) => {
      state.ui.openModal = null
    })
  },

  updatePreferences: (preferences) => {
    set((state) => {
      state.ui.preferences = {
        ...state.ui.preferences,
        ...preferences
      }

      // Apply theme change if theme preference updated
      if (preferences.theme !== undefined) {
        state.ui.isDarkMode = preferences.theme === 'dark' ||
          (preferences.theme === 'system' &&
           window.matchMedia('(prefers-color-scheme: dark)').matches)
      }
    })
  },

  addNotification: (notification) => {
    const id = crypto.randomUUID()

    set((state) => {
      state.ui.notifications.push({
        ...notification,
        id,
        createdAt: Date.now(),
        duration: notification.duration ?? 5000
      })

      // Keep only last 10 notifications
      if (state.ui.notifications.length > 10) {
        state.ui.notifications = state.ui.notifications.slice(-10)
      }
    })

    // Auto-remove notification after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        get().removeNotification(id)
      }, notification.duration ?? 5000)
    }

    return id
  },

  removeNotification: (id) => {
    set((state) => {
      state.ui.notifications = state.ui.notifications.filter(n => n.id !== id)
    })
  },

  clearNotifications: () => {
    set((state) => {
      state.ui.notifications = []
    })
  },

  setLoading: (key, isLoading) => {
    set((state) => {
      if (isLoading) {
        state.ui.loadingStates[key] = true
      } else {
        delete state.ui.loadingStates[key]
      }
    })
  },

  setProgress: (key, progress) => {
    set((state) => {
      if (progress >= 100 || progress < 0) {
        delete state.ui.progressStates[key]
      } else {
        state.ui.progressStates[key] = progress
      }
    })
  },

  toggleSidebar: () => {
    set((state) => {
      state.ui.sidebarCollapsed = !state.ui.sidebarCollapsed
      state.ui.lastInteraction = Date.now()
    })
  },

  toggleToolbar: () => {
    set((state) => {
      state.ui.toolbarVisible = !state.ui.toolbarVisible
      state.ui.lastInteraction = Date.now()
    })
  },

  toggleFullscreen: () => {
    set((state) => {
      state.ui.isFullscreen = !state.ui.isFullscreen
      state.ui.lastInteraction = Date.now()
    })

    // Actual fullscreen logic would be handled by the component
    if (!get().ui.isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  },

  setIsMobile: (isMobile) => {
    set((state) => {
      state.ui.isMobile = isMobile

      // Adjust UI for mobile
      if (isMobile) {
        state.ui.sidebarCollapsed = true
        state.ui.preferences.compactMode = true
      }
    })
  },

  setTheme: (theme) => {
    get().updatePreferences({ theme })
  },

  recordInteraction: () => {
    set((state) => {
      state.ui.lastInteraction = Date.now()
    })
  },

  resetUIState: () => {
    set((state) => {
      // Reset UI state but keep preferences
      const { preferences } = state.ui
      state.ui = {
        ...initialUIState.ui,
        preferences
      }
    })
  },
})