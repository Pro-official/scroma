'use client'

import { useEffect, useCallback } from 'react'
import { useAppStore } from '@/stores'
import {
  useCanUndo,
  useCanRedo,
  useHistoryActions,
  useCanvasActions,
  useUIActions,
  useGlobalActions,
  usePreferences
} from '@/stores/selectors'

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  action: () => void
  description: string
  category: 'canvas' | 'history' | 'ui' | 'file' | 'view'
}

export function useKeyboardShortcuts() {
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()
  const preferences = usePreferences()
  const { undo, redo } = useHistoryActions()
  const {
    zoomIn,
    zoomOut,
    resetCanvas,
    fitToScreen,
    clearImage
  } = useCanvasActions()
  const {
    toggleFullscreen,
    toggleSidebar,
    toggleToolbar,
    openModal,
    setActivePanel
  } = useUIActions()
  const { resetApp } = useGlobalActions()

  // Define shortcuts
  const shortcuts = useCallback((): KeyboardShortcut[] => [
    // History shortcuts
    {
      key: 'z',
      ctrl: true,
      action: () => canUndo && undo(),
      description: 'Undo',
      category: 'history'
    },
    {
      key: 'z',
      ctrl: true,
      shift: true,
      action: () => canRedo && redo(),
      description: 'Redo',
      category: 'history'
    },
    {
      key: 'y',
      ctrl: true,
      action: () => canRedo && redo(),
      description: 'Redo (alternative)',
      category: 'history'
    },

    // Canvas shortcuts
    {
      key: '=',
      ctrl: true,
      action: zoomIn,
      description: 'Zoom in',
      category: 'canvas'
    },
    {
      key: '-',
      ctrl: true,
      action: zoomOut,
      description: 'Zoom out',
      category: 'canvas'
    },
    {
      key: '0',
      ctrl: true,
      action: resetCanvas,
      description: 'Reset zoom',
      category: 'canvas'
    },
    {
      key: '9',
      ctrl: true,
      action: fitToScreen,
      description: 'Fit to screen',
      category: 'canvas'
    },
    {
      key: 'Delete',
      action: () => {
        if (window.confirm('Clear canvas image?')) {
          clearImage()
        }
      },
      description: 'Clear canvas',
      category: 'canvas'
    },

    // UI shortcuts
    {
      key: 'b',
      ctrl: true,
      action: toggleSidebar,
      description: 'Toggle sidebar',
      category: 'ui'
    },
    {
      key: 't',
      ctrl: true,
      action: toggleToolbar,
      description: 'Toggle toolbar',
      category: 'ui'
    },
    {
      key: 'F11',
      action: toggleFullscreen,
      description: 'Toggle fullscreen',
      category: 'view'
    },
    {
      key: 'f',
      alt: true,
      shift: true,
      action: toggleFullscreen,
      description: 'Toggle fullscreen (alternative)',
      category: 'view'
    },

    // File shortcuts
    {
      key: 'o',
      ctrl: true,
      action: () => {
        // Trigger file upload dialog
        const input = document.querySelector<HTMLInputElement>('#file-upload')
        input?.click()
      },
      description: 'Open file',
      category: 'file'
    },
    {
      key: 's',
      ctrl: true,
      action: () => openModal('export'),
      description: 'Export/Save',
      category: 'file'
    },
    {
      key: 'n',
      ctrl: true,
      action: () => {
        if (window.confirm('Start new project? This will clear current work.')) {
          resetApp()
        }
      },
      description: 'New project',
      category: 'file'
    },

    // Panel shortcuts
    {
      key: '1',
      alt: true,
      action: () => setActivePanel('frames'),
      description: 'Open frames panel',
      category: 'ui'
    },
    {
      key: '2',
      alt: true,
      action: () => setActivePanel('backgrounds'),
      description: 'Open backgrounds panel',
      category: 'ui'
    },
    {
      key: '3',
      alt: true,
      action: () => setActivePanel('text'),
      description: 'Open text panel',
      category: 'ui'
    },
    {
      key: '4',
      alt: true,
      action: () => setActivePanel('export'),
      description: 'Open export panel',
      category: 'ui'
    },

    // Help shortcuts
    {
      key: '?',
      shift: true,
      action: () => openModal('shortcuts'),
      description: 'Show keyboard shortcuts',
      category: 'ui'
    },
    {
      key: 'F1',
      action: () => setActivePanel('help'),
      description: 'Show help',
      category: 'ui'
    },

    // Settings
    {
      key: ',',
      ctrl: true,
      action: () => openModal('settings'),
      description: 'Open settings',
      category: 'ui'
    },

    // Escape key
    {
      key: 'Escape',
      action: () => {
        // Close modals first, then panels
        const store = useAppStore.getState()
        if (store.ui.openModal) {
          store.closeModal()
        } else if (store.ui.activePanel) {
          store.setActivePanel(null)
        }
      },
      description: 'Close modal/panel',
      category: 'ui'
    },
  ], [
    canUndo,
    canRedo,
    undo,
    redo,
    zoomIn,
    zoomOut,
    resetCanvas,
    fitToScreen,
    clearImage,
    toggleSidebar,
    toggleToolbar,
    toggleFullscreen,
    openModal,
    setActivePanel,
    resetApp
  ])

  useEffect(() => {
    // Check if keyboard shortcuts are enabled
    if (!preferences.keyboardShortcutsEnabled) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        return
      }

      // Find matching shortcut
      const shortcut = shortcuts().find(s => {
        const keyMatch = s.key.toLowerCase() === event.key.toLowerCase()
        const ctrlMatch = s.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey
        const shiftMatch = s.shift ? event.shiftKey : !event.shiftKey
        const altMatch = s.alt ? event.altKey : !event.altKey
        const metaMatch = s.meta ? event.metaKey : !s.ctrl && !event.metaKey

        return keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch
      })

      if (shortcut) {
        event.preventDefault()
        shortcut.action()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [preferences.keyboardShortcutsEnabled, shortcuts])

  return {
    shortcuts: shortcuts(),
    enabled: preferences.keyboardShortcutsEnabled
  }
}

// Hook for displaying shortcuts in UI
export function useShortcutsList() {
  const { shortcuts } = useKeyboardShortcuts()

  const categorizedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = []
    }
    acc[shortcut.category].push(shortcut)
    return acc
  }, {} as Record<KeyboardShortcut['category'], KeyboardShortcut[]>)

  return categorizedShortcuts
}

// Hook for specific shortcut
export function useShortcut(
  key: string,
  action: () => void,
  options?: {
    ctrl?: boolean
    shift?: boolean
    alt?: boolean
    meta?: boolean
    enabled?: boolean
  }
) {
  const preferences = usePreferences()

  useEffect(() => {
    if (!preferences.keyboardShortcutsEnabled || options?.enabled === false) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        return
      }

      const keyMatch = key.toLowerCase() === event.key.toLowerCase()
      const ctrlMatch = options?.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey
      const shiftMatch = options?.shift ? event.shiftKey : !event.shiftKey
      const altMatch = options?.alt ? event.altKey : !event.altKey
      const metaMatch = options?.meta ? event.metaKey : !options?.ctrl && !event.metaKey

      if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
        event.preventDefault()
        action()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [key, action, options, preferences.keyboardShortcutsEnabled])
}