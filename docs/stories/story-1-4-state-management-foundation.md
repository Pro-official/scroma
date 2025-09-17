# Story 1.4: State Management Foundation

## Story Overview

**Epic:** Epic 1 - Foundation & Core Upload System
**Story ID:** 1.4
**Priority:** High
**Status:** Ready for Development
**Estimated Effort:** 8 Story Points
**Sprint Assignment:** Sprint 2
**Dependencies:** Story 1.3 (Canvas Display System)

## User Story

**As a** developer,
**I want to** implement robust state management for the Next.js application,
**So that** user actions are tracked and the app remains responsive and scalable with SSG optimization.

## Business Value

- Establishes scalable Next.js architecture foundation for all future features with SSG performance benefits
- Enables undo/redo functionality critical for creative tools with client-side state management
- Provides data persistence for improved user experience leveraging Next.js client/server patterns
- Creates performance-optimized state management supporting 60fps canvas operations with Next.js optimizations

## Acceptance Criteria

### Zustand Store Configuration
1. **Store Architecture**
   - Zustand store configured with TypeScript interfaces for complete type safety in Next.js app
   - Store organized by domain slices (canvas, upload, ui, history) compatible with Next.js patterns
   - Each slice properly typed with state and action interfaces using Next.js client components
   - Store middleware configured for development debugging with Next.js DevTools integration

2. **Type Safety Implementation**
   - All state properties and actions fully typed with TypeScript in Next.js environment
   - No `any` types used in store definitions following Next.js best practices
   - Store selectors properly typed for Next.js client component consumption
   - Action payloads validated with TypeScript constraints for server/client compatibility

### State Persistence
3. **Browser Storage Integration**
   - Current session state automatically saved to localStorage on changes with Next.js client-side hydration
   - State restoration on application reload preserves user work in Next.js SSG environment
   - Sensitive data excluded from persistence (temporary files, errors) following Next.js security patterns
   - Storage size optimization prevents browser quota issues with Next.js static optimization

4. **Data Serialization**
   - Complex state objects (images, canvas data) properly serialized for Next.js hydration
   - Deserialization handles corrupted or incompatible stored data in Next.js client components
   - Version management for state schema updates compatible with Next.js app versioning
   - Graceful fallback when localStorage unavailable in Next.js SSR/SSG scenarios

### Undo/Redo System
5. **History Tracking**
   - Action history automatically tracked for undoable operations in Next.js client components
   - Minimum 50 actions stored in history buffer optimized for Next.js performance
   - Non-undoable actions (UI state, temporary values) excluded from history following Next.js patterns
   - History memory management prevents unlimited growth with Next.js optimization techniques

6. **Undo/Redo Operations**
   - Undo (Ctrl/Cmd+Z) and Redo (Ctrl/Cmd+Shift+Z) keyboard shortcuts in Next.js client components
   - History navigation maintains application state consistency in Next.js app router
   - UI indicators show undo/redo availability with Next.js optimized rendering
   - History cleared appropriately on major state changes (new image upload) following Next.js patterns

### Performance Optimization
7. **Re-render Prevention**
   - State updates trigger only necessary component re-renders optimized for Next.js
   - Selector functions prevent unnecessary recalculations in Next.js client components
   - Expensive computations memoized where appropriate using Next.js optimization patterns
   - Performance monitoring shows no unnecessary render cycles with Next.js DevTools

8. **State Reset Functionality**
   - Clear state action available for starting fresh projects in Next.js app
   - Partial state reset for specific domains (clear canvas, reset upload) using Next.js patterns
   - Confirmation dialogs for destructive reset operations in Next.js client components
   - Reset operations properly clean up event listeners and subscriptions in Next.js

### Memory Management Integration (NFR8 Compliance)
9. **Memory Usage Monitoring**
   - Memory monitoring store slice tracks application memory usage in Next.js environment
   - Real-time memory usage data available to all Next.js client components
   - Memory usage history maintained for debugging and optimization with Next.js patterns
   - Memory warning system integrated with state management in Next.js app

10. **Memory-Aware State Management**
    - State updates consider memory impact before execution in Next.js client components
    - Automatic cleanup of unused state data when memory usage high using Next.js optimization
    - Memory usage tracking for stored images, canvas data, and history in Next.js app
    - Memory limit enforcement (500MB NFR8) integrated into store actions with Next.js patterns

## Memory Management Store Implementation

```typescript
// Memory monitoring slice for Next.js
interface MemorySlice {
  memoryUsage: {
    current: number          // Current usage in MB
    limit: number           // 500MB limit
    warningThreshold: number // 400MB (80% of limit)
    history: Array<{ timestamp: number; usage: number }>
    lastCleanup: number
  }

  memoryActions: {
    updateMemoryUsage: (usage: number) => void
    triggerMemoryWarning: () => void
    performMemoryCleanup: () => Promise<void>
    addMemoryHistoryEntry: (usage: number) => void
    resetMemoryTracking: () => void
  }
}

// Integration with main store for Next.js
interface AppStore extends CanvasSlice, UploadSlice, UISlice, HistorySlice, MemorySlice {
  // Cross-slice memory management for Next.js
  checkMemoryBeforeAction: (actionName: string) => boolean
  cleanupMemoryIfNeeded: () => Promise<void>
}
```

## Technical Implementation

### Store Architecture
```typescript
// stores/index.ts (Next.js App Router)
'use client'

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'

// Store slices for Next.js
import { createCanvasSlice, CanvasSlice } from './canvas-slice'
import { createUploadSlice, UploadSlice } from './upload-slice'
import { createHistorySlice, HistorySlice } from './history-slice'
import { createUISlice, UISlice } from './ui-slice'

// Combined store type for Next.js
export interface AppStore extends CanvasSlice, UploadSlice, HistorySlice, UISlice {}

// Create store with middleware optimized for Next.js
export const useAppStore = create<AppStore>()(
  devtools(
    subscribeWithSelector(
      persist(
        immer((set, get, api) => ({
          ...createCanvasSlice(set, get, api),
          ...createUploadSlice(set, get, api),
          ...createHistorySlice(set, get, api),
          ...createUISlice(set, get, api),
        })),
        {
          name: 'scroma-app-storage',
          version: 1,
          partialize: (state) => ({
            canvas: state.canvas,
            upload: {
              recentFiles: state.upload.recentFiles,
              settings: state.upload.settings,
            },
            ui: {
              preferences: state.ui.preferences,
              panelStates: state.ui.panelStates,
            },
            // Exclude history and temporary state from persistence for Next.js SSG
          }),
          onRehydrateStorage: () => (state) => {
            // Initialize non-persisted state after rehydration in Next.js
            state?.initializeSession()
          },
        }
      )
    ),
    { name: 'Scroma App Store - Next.js' }
  )
)

// Selectors for optimized Next.js component subscriptions
export const appSelectors = {
  // Canvas selectors for Next.js components
  canvasImage: (state: AppStore) => state.canvas.image,
  canvasViewport: (state: AppStore) => state.canvas.viewport,
  canvasZoom: (state: AppStore) => state.canvas.viewport.zoom,

  // Upload selectors for Next.js components
  uploadState: (state: AppStore) => state.upload,
  isUploading: (state: AppStore) => state.upload.isUploading,
  uploadProgress: (state: AppStore) => state.upload.uploadProgress,

  // History selectors for Next.js components
  canUndo: (state: AppStore) => state.history.canUndo,
  canRedo: (state: AppStore) => state.history.canRedo,
  historyLength: (state: AppStore) => state.history.actions.length,

  // UI selectors for Next.js components
  activePanel: (state: AppStore) => state.ui.activePanel,
  preferences: (state: AppStore) => state.ui.preferences,
}
```

### Canvas Slice Implementation
```typescript
// stores/canvas-slice.ts (Next.js App Router)
'use client'

import { StateCreator } from 'zustand'
import { AppStore } from './index'

export interface CanvasState {
  image: {
    src: string | null
    originalWidth: number
    originalHeight: number
    fileName: string
    fileSize: number
    format: string
  } | null

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
}

export interface CanvasSlice extends CanvasState, CanvasActions {}

const initialCanvasState: CanvasState = {
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

export const createCanvasSlice: StateCreator<
  AppStore,
  [["zustand/immer", never]],
  [],
  CanvasSlice
> = (set, get) => ({
  ...initialCanvasState,

  setImage: (imageData) =>
    set((state) => {
      state.canvas.image = imageData
      // Record action in history for Next.js
      state.history.addAction({
        type: 'SET_IMAGE',
        timestamp: Date.now(),
        data: { imageData },
      })
    }),

  clearImage: () =>
    set((state) => {
      state.canvas.image = null
      state.canvas.viewport.zoom = 1
      state.canvas.viewport.panX = 0
      state.canvas.viewport.panY = 0
      // Record action in history for Next.js
      state.history.addAction({
        type: 'CLEAR_IMAGE',
        timestamp: Date.now(),
        data: {},
      })
    }),

  setZoom: (zoom) =>
    set((state) => {
      const clampedZoom = Math.max(
        state.canvas.viewport.minZoom,
        Math.min(state.canvas.viewport.maxZoom, zoom)
      )
      state.canvas.viewport.zoom = clampedZoom
    }),

  setPan: (x, y) =>
    set((state) => {
      state.canvas.viewport.panX = x
      state.canvas.viewport.panY = y
    }),

  setViewportSize: (width, height) =>
    set((state) => {
      state.canvas.viewport.width = width
      state.canvas.viewport.height = height
    }),

  resetCanvas: () =>
    set((state) => {
      state.canvas.viewport.zoom = 1
      state.canvas.viewport.panX = 0
      state.canvas.viewport.panY = 0
      state.canvas.interaction = initialCanvasState.interaction
    }),

  startDrag: (x, y) =>
    set((state) => {
      state.canvas.interaction.isDragging = true
      state.canvas.interaction.dragStart = { x, y }
    }),

  updateDrag: (x, y) =>
    set((state) => {
      if (state.canvas.interaction.isDragging && state.canvas.interaction.dragStart) {
        const deltaX = x - state.canvas.interaction.dragStart.x
        const deltaY = y - state.canvas.interaction.dragStart.y
        state.canvas.viewport.panX += deltaX
        state.canvas.viewport.panY += deltaY
        state.canvas.interaction.dragStart = { x, y }
      }
    }),

  endDrag: () =>
    set((state) => {
      state.canvas.interaction.isDragging = false
      state.canvas.interaction.dragStart = null
    }),
})
```

### History Management Implementation
```typescript
// stores/history-slice.ts (Next.js App Router)
'use client'

import { StateCreator } from 'zustand'
import { AppStore } from './index'

export interface HistoryAction {
  type: string
  timestamp: number
  data: any
  description?: string
}

export interface HistoryState {
  actions: HistoryAction[]
  currentIndex: number
  maxSize: number
  canUndo: boolean
  canRedo: boolean
}

export interface HistoryActions {
  addAction: (action: HistoryAction) => void
  undo: () => void
  redo: () => void
  clearHistory: () => void
  canPerformUndo: () => boolean
  canPerformRedo: () => boolean
}

export interface HistorySlice extends HistoryState, HistoryActions {}

const initialHistoryState: HistoryState = {
  actions: [],
  currentIndex: -1,
  maxSize: 50,
  canUndo: false,
  canRedo: false,
}

export const createHistorySlice: StateCreator<
  AppStore,
  [["zustand/immer", never]],
  [],
  HistorySlice
> = (set, get) => ({
  ...initialHistoryState,

  addAction: (action) =>
    set((state) => {
      // Remove any actions after current index (if we're in middle of history)
      state.history.actions = state.history.actions.slice(0, state.history.currentIndex + 1)

      // Add new action
      state.history.actions.push(action)
      state.history.currentIndex = state.history.actions.length - 1

      // Trim history if it exceeds max size (Next.js memory optimization)
      if (state.history.actions.length > state.history.maxSize) {
        state.history.actions = state.history.actions.slice(-state.history.maxSize)
        state.history.currentIndex = state.history.actions.length - 1
      }

      // Update undo/redo flags for Next.js components
      state.history.canUndo = state.history.currentIndex >= 0
      state.history.canRedo = state.history.currentIndex < state.history.actions.length - 1
    }),

  undo: () =>
    set((state) => {
      if (state.history.currentIndex >= 0) {
        const action = state.history.actions[state.history.currentIndex]

        // Apply undo logic based on action type for Next.js
        switch (action.type) {
          case 'SET_IMAGE':
            state.canvas.image = null
            break
          case 'CLEAR_IMAGE':
            state.canvas.image = action.data.previousImage
            break
          // Add more undo cases as needed for Next.js
        }

        state.history.currentIndex -= 1
        state.history.canUndo = state.history.currentIndex >= 0
        state.history.canRedo = true
      }
    }),

  redo: () =>
    set((state) => {
      if (state.history.currentIndex < state.history.actions.length - 1) {
        state.history.currentIndex += 1
        const action = state.history.actions[state.history.currentIndex]

        // Apply redo logic based on action type for Next.js
        switch (action.type) {
          case 'SET_IMAGE':
            state.canvas.image = action.data.imageData
            break
          case 'CLEAR_IMAGE':
            state.canvas.image = null
            break
          // Add more redo cases as needed for Next.js
        }

        state.history.canRedo = state.history.currentIndex < state.history.actions.length - 1
        state.history.canUndo = true
      }
    }),

  clearHistory: () =>
    set((state) => {
      state.history.actions = []
      state.history.currentIndex = -1
      state.history.canUndo = false
      state.history.canRedo = false
    }),

  canPerformUndo: () => get().history.canUndo,
  canPerformRedo: () => get().history.canRedo,
})
```

## Definition of Done

### Technical Requirements
- [ ] Zustand store configured with TypeScript for all state slices in Next.js App Router
- [ ] State persistence working with localStorage integration optimized for Next.js SSG
- [ ] Undo/redo system functional with 50-action history buffer in Next.js client components
- [ ] Performance monitoring shows no unnecessary re-renders with Next.js optimization
- [ ] All state operations properly typed and validated for Next.js environment

### Functionality Requirements
- [ ] State updates trigger appropriate component re-renders only in Next.js components
- [ ] Browser refresh preserves user session state with Next.js SSG hydration
- [ ] Undo/redo operations maintain application consistency in Next.js app router
- [ ] Clear state functionality works for fresh project starts in Next.js
- [ ] History management prevents memory leaks with large datasets using Next.js patterns

### Performance Requirements
- [ ] State operations complete within 10ms for responsive UI in Next.js
- [ ] Memory usage optimized for history storage with Next.js performance patterns
- [ ] No performance degradation with maximum history size in Next.js app
- [ ] Component subscriptions optimized with proper selectors for Next.js

## Success Metrics

### Performance Metrics
- **Target:** State operations maintain <10ms response time in Next.js environment
- **Measurement:** Performance monitoring of state update duration with Next.js DevTools

### User Experience
- **Target:** Zero data loss events during user sessions in Next.js app
- **Measurement:** Error tracking and user feedback on state persistence with Next.js

### Developer Experience
- **Target:** 100% TypeScript coverage for store operations in Next.js
- **Measurement:** TypeScript compilation success and type coverage reports for Next.js

## Risk Assessment

### Primary Risk: State Performance Impact in Next.js
**Mitigation:**
- Selector optimization for Next.js component subscriptions
- History size management and memory cleanup with Next.js patterns
- Performance monitoring and automatic optimization for Next.js

### Secondary Risk: localStorage Quota Limitations in Next.js SSG
**Mitigation:**
- Storage size monitoring and cleanup optimized for Next.js
- Graceful degradation when storage unavailable in Next.js SSR/SSG
- Compression of stored state data for Next.js optimization

### Rollback Plan
- Feature flags for individual state management features in Next.js
- Fallback to in-memory state if persistence fails in Next.js environment
- Manual state reset functionality for corrupted data in Next.js app