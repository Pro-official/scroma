'use client'

import { AppStore } from './index'
import { SliceCreator } from './types'

export interface ImageData {
  src: string | null
  originalWidth: number
  originalHeight: number
  fileName: string
  fileSize: number
  format: string
}

export interface CanvasState {
  canvas: {
    image: ImageData | null
    viewport: {
      width: number
      height: number
      zoom: number
      panX: number
      panY: number
      minZoom: number
      maxZoom: number
    }
    interaction: {
      isDragging: boolean
      isZooming: boolean
      dragStart: { x: number; y: number } | null
    }
  }
}

export interface CanvasActions {
  setImage: (imageData: ImageData) => void
  clearImage: () => void
  setZoom: (zoom: number) => void
  setPan: (x: number, y: number) => void
  setViewportSize: (width: number, height: number) => void
  resetCanvas: () => void
  startDrag: (x: number, y: number) => void
  updateDrag: (x: number, y: number) => void
  endDrag: () => void
  fitToScreen: () => void
  zoomIn: () => void
  zoomOut: () => void
}

export interface CanvasSlice extends CanvasState, CanvasActions {}

const initialCanvasState: CanvasState = {
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
}

export const createCanvasSlice: SliceCreator<AppStore, CanvasSlice> = (set, get) => ({
  ...initialCanvasState,

  setImage: (imageData) => {
    set((state) => {
      state.canvas.image = imageData
      state.canvas.viewport.zoom = 1
      state.canvas.viewport.panX = 0
      state.canvas.viewport.panY = 0
    })

    // Add to history after state update
    const store = get()
    if ('addAction' in store) {
      store.addAction({
        type: 'SET_IMAGE',
        data: { imageData },
        description: `Loaded image: ${imageData.fileName}`
      })
    }
  },

  clearImage: () => {
    const previousImage = get().canvas.image

    set((state) => {
      state.canvas.image = null
      state.canvas.viewport.zoom = 1
      state.canvas.viewport.panX = 0
      state.canvas.viewport.panY = 0
    })

    // Add to history after state update
    const store = get()
    if ('addAction' in store) {
      store.addAction({
        type: 'CLEAR_IMAGE',
        data: { previousImage },
        description: 'Cleared canvas image'
      })
    }
  },

  setZoom: (zoom) => {
    set((state) => {
      const clampedZoom = Math.max(
        state.canvas.viewport.minZoom,
        Math.min(state.canvas.viewport.maxZoom, zoom)
      )
      state.canvas.viewport.zoom = clampedZoom
    })
  },

  zoomIn: () => {
    const currentZoom = get().canvas.viewport.zoom
    get().setZoom(currentZoom * 1.2)
  },

  zoomOut: () => {
    const currentZoom = get().canvas.viewport.zoom
    get().setZoom(currentZoom / 1.2)
  },

  setPan: (x, y) => {
    set((state) => {
      state.canvas.viewport.panX = x
      state.canvas.viewport.panY = y
    })
  },

  setViewportSize: (width, height) => {
    set((state) => {
      state.canvas.viewport.width = width
      state.canvas.viewport.height = height
    })
  },

  resetCanvas: () => {
    set((state) => {
      state.canvas.viewport.zoom = 1
      state.canvas.viewport.panX = 0
      state.canvas.viewport.panY = 0
      state.canvas.interaction = initialCanvasState.canvas.interaction
    })
  },

  fitToScreen: () => {
    const { canvas } = get()
    if (!canvas.image) return

    const viewportAspect = canvas.viewport.width / canvas.viewport.height
    const imageAspect = canvas.image.originalWidth / canvas.image.originalHeight

    let newZoom = 1
    if (imageAspect > viewportAspect) {
      newZoom = canvas.viewport.width / canvas.image.originalWidth
    } else {
      newZoom = canvas.viewport.height / canvas.image.originalHeight
    }

    set((state) => {
      state.canvas.viewport.zoom = newZoom * 0.9
      state.canvas.viewport.panX = 0
      state.canvas.viewport.panY = 0
    })
  },

  startDrag: (x, y) => {
    set((state) => {
      state.canvas.interaction.isDragging = true
      state.canvas.interaction.dragStart = { x, y }
    })
  },

  updateDrag: (x, y) => {
    set((state) => {
      if (state.canvas.interaction.isDragging && state.canvas.interaction.dragStart) {
        const deltaX = x - state.canvas.interaction.dragStart.x
        const deltaY = y - state.canvas.interaction.dragStart.y
        state.canvas.viewport.panX += deltaX
        state.canvas.viewport.panY += deltaY
        state.canvas.interaction.dragStart = { x, y }
      }
    })
  },

  endDrag: () => {
    set((state) => {
      state.canvas.interaction.isDragging = false
      state.canvas.interaction.dragStart = null
    })
  },
})