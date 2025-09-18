'use client'

import { useAppStore } from './index'

// Canvas selectors with equality checks
export const useCanvasImage = () => useAppStore(state => state.canvas.image)
export const useCanvasViewport = () => useAppStore(state => state.canvas.viewport)
export const useCanvasZoom = () => useAppStore(state => state.canvas.viewport.zoom)
export const useCanvasPan = () => useAppStore(
  state => ({ x: state.canvas.viewport.panX, y: state.canvas.viewport.panY })
)
export const useCanvasInteraction = () => useAppStore(state => state.canvas.interaction)
export const useIsCanvasDragging = () => useAppStore(state => state.canvas.interaction.isDragging)

// Canvas actions
export const useCanvasActions = () => useAppStore(
  (state) => ({
    setImage: state.setImage,
    clearImage: state.clearImage,
    setZoom: state.setZoom,
    setPan: state.setPan,
    resetCanvas: state.resetCanvas,
    fitToScreen: state.fitToScreen,
    zoomIn: state.zoomIn,
    zoomOut: state.zoomOut,
    startDrag: state.startDrag,
    updateDrag: state.updateDrag,
    endDrag: state.endDrag,
  })
)

// Upload selectors
export const useUploadFiles = () => useAppStore(state => state.upload.files)
export const useUploadQueue = () => useAppStore(state => state.upload.queue)
export const useIsUploading = () => useAppStore(state => state.upload.isUploading)
export const useUploadProgress = () => useAppStore(state => state.upload.uploadProgress)
export const useUploadSettings = () => useAppStore(state => state.upload.settings)
export const useRecentFiles = () => useAppStore(state => state.upload.recentFiles)
export const useUploadErrors = () => useAppStore(state => state.upload.errors)

// Upload actions
export const useUploadActions = () => useAppStore(
  (state) => ({
    addFile: state.addFile,
    addMultipleFiles: state.addMultipleFiles,
    removeFile: state.removeFile,
    updateProgress: state.updateProgress,
    setUploadStatus: state.setUploadStatus,
    setUploadError: state.setUploadError,
    clearCompleted: state.clearCompleted,
    clearAll: state.clearAll,
    updateSettings: state.updateSettings,
    processQueue: state.processQueue,
    retryUpload: state.retryUpload,
    setPreviewUrl: state.setPreviewUrl,
  })
)

// History selectors
export const useCanUndo = () => useAppStore(state => state.history.canUndo)
export const useCanRedo = () => useAppStore(state => state.history.canRedo)
export const useHistoryLength = () => useAppStore(state => state.history.actions.length)
export const useHasUnsavedChanges = () => useAppStore(state => state.hasUnsavedChanges())

// History actions
export const useHistoryActions = () => useAppStore(
  (state) => ({
    undo: state.undo,
    redo: state.redo,
    clearHistory: state.clearHistory,
    markSavePoint: state.markSavePoint,
  })
)

// UI selectors
export const useActivePanel = () => useAppStore(state => state.ui.activePanel)
export const useOpenModal = () => useAppStore(state => state.ui.openModal)
export const usePreferences = () => useAppStore(state => state.ui.preferences)
export const useNotifications = () => useAppStore(state => state.ui.notifications)
export const useIsDarkMode = () => useAppStore(state => state.ui.isDarkMode)
export const useIsMobile = () => useAppStore(state => state.ui.isMobile)
export const useIsFullscreen = () => useAppStore(state => state.ui.isFullscreen)
export const useSidebarCollapsed = () => useAppStore(state => state.ui.sidebarCollapsed)
export const useToolbarVisible = () => useAppStore(state => state.ui.toolbarVisible)
export const useLoadingStates = () => useAppStore(state => state.ui.loadingStates)
export const useProgressStates = () => useAppStore(state => state.ui.progressStates)

// UI actions
export const useUIActions = () => useAppStore(
  (state) => ({
    setActivePanel: state.setActivePanel,
    togglePanel: state.togglePanel,
    openModal: state.openModal,
    closeModal: state.closeModal,
    updatePreferences: state.updatePreferences,
    addNotification: state.addNotification,
    removeNotification: state.removeNotification,
    clearNotifications: state.clearNotifications,
    setLoading: state.setLoading,
    setProgress: state.setProgress,
    toggleSidebar: state.toggleSidebar,
    toggleToolbar: state.toggleToolbar,
    toggleFullscreen: state.toggleFullscreen,
    setIsMobile: state.setIsMobile,
    setTheme: state.setTheme,
    recordInteraction: state.recordInteraction,
    resetUIState: state.resetUIState,
  })
)

// Memory selectors
export const useMemoryUsage = () => useAppStore(state => state.memory.current)
export const useMemoryLimit = () => useAppStore(state => state.memory.limit)
export const useMemoryPercentage = () => useAppStore(state => (state.memory.current / state.memory.limit) * 100)
export const useIsMemoryCritical = () => useAppStore(state => state.memory.current >= state.memory.criticalThreshold)
export const useIsMemoryWarning = () => useAppStore(state => state.memory.current >= state.memory.warningThreshold)
export const useMemoryHistory = () => useAppStore(state => state.memory.history)
export const useIsAutoCleanup = () => useAppStore(state => state.memory.autoCleanup)

// Memory actions
export const useMemoryActions = () => useAppStore(
  (state) => ({
    updateMemoryUsage: state.updateMemoryUsage,
    performMemoryCleanup: state.performMemoryCleanup,
    checkMemoryBeforeAction: state.checkMemoryBeforeAction,
    getMemoryReport: state.getMemoryReport,
    setAutoCleanup: state.setAutoCleanup,
    resetMemoryTracking: state.resetMemoryTracking,
  })
)

// Global actions
export const useGlobalActions = () => useAppStore(
  (state) => ({
    initializeSession: state.initializeSession,
    resetApp: state.resetApp,
    resetPartial: state.resetPartial,
  })
)

// Combined selectors
export const useIsWorking = () => useAppStore(
  state => state.upload.isUploading || state.memory.cleanupInProgress
)

export const useHasData = () => useAppStore(
  state => state.canvas.image !== null || state.upload.files.length > 0
)

// Selector with multiple values (optimized)
export const useAppState = () => useAppStore(
  (state) => ({
    hasImage: state.canvas.image !== null,
    isUploading: state.upload.isUploading,
    canUndo: state.history.canUndo,
    canRedo: state.history.canRedo,
    isDarkMode: state.ui.isDarkMode,
    memoryUsage: state.memory.current,
    memoryLimit: state.memory.limit,
  })
)

// Performance monitoring selector
export const usePerformanceMetrics = () => useAppStore(
  (state) => ({
    canvasZoom: state.canvas.viewport.zoom,
    uploadQueueSize: state.upload.queue.length,
    historySize: state.history.actions.length,
    notificationCount: state.ui.notifications.length,
    memoryPercentage: (state.memory.current / state.memory.limit) * 100,
  })
)