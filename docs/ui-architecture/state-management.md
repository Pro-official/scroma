# State Management

### Next.js 15 + Zustand 5 Store Structure

```
stores/
├── canvas-store.ts          # Client-side canvas state and operations
├── frame-store.ts           # Frame library and application state
├── background-store.ts      # Background and gradient state
├── text-store.ts           # Text overlay management
├── export-store.ts         # Export settings and operations
├── app-store.ts            # Global app state (UI, preferences)
├── server-state/           # Server state management
│   ├── projects-store.ts   # Server-side project data
│   ├── templates-store.ts  # Template data from API
│   └── user-store.ts       # User preferences from server
├── slices/                 # Store slices for better organization
│   ├── canvas-slice.ts     # Canvas domain logic
│   ├── ui-slice.ts         # UI state slice
│   └── performance-slice.ts # Performance metrics slice
└── index.ts               # Store exports and middleware
```

### Next.js 15 Client-Side Store with Server Integration

```typescript
'use client'

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'

// Canvas slice optimized for Next.js client components
const createCanvasSlice = (set, get) => ({
  canvas: {
    width: 1200,
    height: 800,
    zoom: 1,
    panX: 0,
    panY: 0,
    backgroundColor: '#ffffff',
    elements: []
  },

  // Optimized actions with Immer for immutable updates
  updateCanvasElement: (id, updates) => set(
    immer((state) => {
      const element = state.canvas.elements.find(el => el.id === id)
      if (element) Object.assign(element, updates)
    }),
    false,
    'canvas/updateElement'
  ),

  // Server sync - synchronize with Next.js API routes
  syncCanvasWithServer: async (projectId) => {
    const currentState = get()

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          canvas: currentState.canvas,
          lastModified: Date.now()
        })
      })

      if (!response.ok) throw new Error('Failed to sync')

      const { project } = await response.json()

      // Update local state with server response
      set(
        immer((state) => {
          state.canvas = project.canvas
          state.lastSyncTime = Date.now()
        }),
        false,
        'canvas/serverSync'
      )
    } catch (error) {
      console.error('Canvas sync failed:', error)
      // Handle sync failure - could queue for retry
    }
  },

  // Optimistic update pattern with rollback capability
  optimisticElementUpdate: (id, updates) => {
    const currentState = get()
    const rollbackData = currentState.canvas.elements.find(el => el.id === id)

    // Apply optimistic update
    set(
      immer((state) => {
        const element = state.canvas.elements.find(el => el.id === id)
        if (element) Object.assign(element, updates)
      }),
      false,
      'canvas/optimisticUpdate'
    )

    // Return rollback function for error handling
    return () => set(
      immer((state) => {
        const element = state.canvas.elements.find(el => el.id === id)
        if (element && rollbackData) Object.assign(element, rollbackData)
      }),
      false,
      'canvas/rollback'
    )
  },

  // Batch operations for performance
  batchUpdateElements: (updates) => set(
    immer((state) => {
      updates.forEach(({ id, data }) => {
        const element = state.canvas.elements.find(el => el.id === id)
        if (element) Object.assign(element, data)
      })
    }),
    false,
    'canvas/batchUpdate'
  ),

  // Next.js specific - handle SSR/hydration
  hydrateFromServer: (serverData) => set(
    immer((state) => {
      if (serverData.canvas) {
        state.canvas = { ...state.canvas, ...serverData.canvas }
      }
      state.hydrated = true
    }),
    false,
    'canvas/hydrate'
  ),

  // Canvas viewport operations
  setZoom: (zoom) => set(
    immer((state) => {
      state.canvas.zoom = Math.max(0.1, Math.min(5.0, zoom))
    }),
    false,
    'canvas/setZoom'
  ),

  updatePan: (panX, panY) => set(
    immer((state) => {
      state.canvas.panX = panX
      state.canvas.panY = panY
    }),
    false,
    'canvas/updatePan'
  )
})

// UI slice for transient client state
const createUISlice = (set, get) => ({
  ui: {
    isLoading: false,
    isDragging: false,
    selectedElementIds: [],
    showGrid: false,
    snapToGrid: true,
    tool: 'select',
    panels: {
      frames: false,
      backgrounds: false,
      text: false,
      export: false
    },
    // Next.js specific UI state
    isHydrated: false,
    routeTransition: false
  },

  // UI actions
  setTool: (tool) => set(
    immer((state) => {
      state.ui.tool = tool
    }),
    false,
    'ui/setTool'
  ),

  togglePanel: (panel) => set(
    immer((state) => {
      state.ui.panels[panel] = !state.ui.panels[panel]
    }),
    false,
    'ui/togglePanel'
  ),

  setSelection: (elementIds) => set(
    immer((state) => {
      state.ui.selectedElementIds = elementIds
    }),
    false,
    'ui/setSelection'
  ),

  // Next.js route transition handling
  setRouteTransition: (isTransitioning) => set(
    immer((state) => {
      state.ui.routeTransition = isTransitioning
    }),
    false,
    'ui/routeTransition'
  )
})

// Combined store with slices
type CanvasStore = ReturnType<typeof createCanvasSlice> & ReturnType<typeof createUISlice>

// Create store with Next.js 15 patterns
export const useCanvasStore = create<CanvasStore>()(
  devtools(
    subscribeWithSelector(
      persist(
        immer((set, get) => ({
          ...createCanvasSlice(set, get),
          ...createUISlice(set, get)
        })),
        {
          name: 'shot-canvas-storage',
          version: 1,
          // Partialize for performance - only persist essential data
          partialize: (state) => ({
            canvas: {
              width: state.canvas.width,
              height: state.canvas.height,
              backgroundColor: state.canvas.backgroundColor,
              elements: state.canvas.elements
            },
            ui: {
              showGrid: state.ui.showGrid,
              snapToGrid: state.ui.snapToGrid,
              tool: state.ui.tool
            }
          }),
          // Skip persistence on server (SSR)
          skipHydration: typeof window === 'undefined',
          // Migration for version updates
          migrate: (persistedState, version) => {
            if (version === 0) {
              return {
                ...persistedState,
                ui: {
                  ...persistedState.ui,
                  isHydrated: false,
                  routeTransition: false
                }
              }
            }
            return persistedState
          }
        }
      )
    ),
    { name: 'CanvasStore' }
  )
)

// Optimized selectors to prevent unnecessary re-renders
export const canvasSelectors = {
  // Basic selectors
  canvas: (state: CanvasStore) => state.canvas,
  zoom: (state: CanvasStore) => state.canvas.zoom,
  elements: (state: CanvasStore) => state.canvas.elements,
  selectedTool: (state: CanvasStore) => state.ui.tool,
  isHydrated: (state: CanvasStore) => state.ui.isHydrated,

  // Memoized selectors for performance
  getElementById: (id: string) => (state: CanvasStore) =>
    state.canvas.elements.find(el => el.id === id),

  elementsByType: (type: string) => (state: CanvasStore) =>
    state.canvas.elements.filter(el => el.type === type),

  selectedElements: (state: CanvasStore) =>
    state.canvas.elements.filter(el =>
      state.ui.selectedElementIds.includes(el.id)
    ),

  // Next.js specific selectors
  needsServerSync: (state: CanvasStore) => {
    const lastUpdate = state.canvas.lastModified || 0
    const lastSync = state.lastSyncTime || 0
    return lastUpdate > lastSync
  },

  // Computed selectors
  canvasCenter: (state: CanvasStore) => ({
    x: state.canvas.width / 2,
    y: state.canvas.height / 2
  }),

  viewportBounds: (state: CanvasStore) => ({
    left: -state.canvas.panX / state.canvas.zoom,
    top: -state.canvas.panY / state.canvas.zoom,
    right: (state.canvas.width - state.canvas.panX) / state.canvas.zoom,
    bottom: (state.canvas.height - state.canvas.panY) / state.canvas.zoom
  })
}
```

### Server State Management with React Query + Next.js

```typescript
// lib/queries/projects.ts - Server state with React Query
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export interface Project {
  id: string
  name: string
  description?: string
  canvas: CanvasData
  createdAt: string
  updatedAt: string
}

// Project queries
export const useProjects = (limit = 10) => {
  return useQuery({
    queryKey: ['projects', { limit }],
    queryFn: async () => {
      const response = await fetch(`/api/projects?limit=${limit}`)
      if (!response.ok) throw new Error('Failed to fetch projects')
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useProject = (projectId: string | null) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId) return null
      const response = await fetch(`/api/projects/${projectId}`)
      if (!response.ok) throw new Error('Failed to fetch project')
      return response.json()
    },
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Project mutations with optimistic updates
export const useCreateProject = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (projectData: Partial<Project>) => {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      })
      if (!response.ok) throw new Error('Failed to create project')
      return response.json()
    },
    onSuccess: (data) => {
      // Invalidate and refetch projects
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      // Navigate to new project
      router.push(`/editor/${data.project.id}`)
    },
  })
}

export const useUpdateProject = (projectId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: Partial<Project>) => {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      if (!response.ok) throw new Error('Failed to update project')
      return response.json()
    },
    // Optimistic update
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['project', projectId] })

      const previousProject = queryClient.getQueryData(['project', projectId])

      queryClient.setQueryData(['project', projectId], (old: any) => ({
        ...old,
        project: { ...old?.project, ...newData }
      }))

      return { previousProject }
    },
    onError: (err, newData, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ['project', projectId],
        context?.previousProject
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
    },
  })
}
```

### Next.js App Providers Setup

```typescript
// app/providers.tsx - Combined providers for Next.js
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from 'next-themes'
import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors
              if (error instanceof Response && error.status < 500) {
                return false
              }
              return failureCount < 3
            },
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### Server-Side State Hydration

```typescript
// app/editor/[projectId]/page.tsx - Server state hydration
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { EditorCanvas } from '@/components/canvas/editor-canvas'
import { loadProject, loadProjectHistory } from '@/lib/api/projects'

interface ProjectEditorPageProps {
  params: { projectId: string }
}

export default async function ProjectEditorPage({ params }: ProjectEditorPageProps) {
  const queryClient = new QueryClient()

  // Pre-fetch data on the server
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['project', params.projectId],
      queryFn: () => loadProject(params.projectId),
    }),
    queryClient.prefetchQuery({
      queryKey: ['projectHistory', params.projectId],
      queryFn: () => loadProjectHistory(params.projectId),
    }),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditorCanvas projectId={params.projectId} />
    </HydrationBoundary>
  )
}
```

### Client-Server State Synchronization

```typescript
// hooks/use-canvas-sync.ts - Sync client state with server
'use client'

import { useEffect, useCallback } from 'react'
import { useCanvasStore, canvasSelectors } from '@/stores/canvas-store'
import { useUpdateProject } from '@/lib/queries/projects'
import { useDebouncedCallback } from 'use-debounce'

export function useCanvasSync(projectId: string | null) {
  const canvas = useCanvasStore(canvasSelectors.canvas)
  const needsSync = useCanvasStore(canvasSelectors.needsServerSync)
  const updateProject = useUpdateProject(projectId!)

  // Debounced sync to prevent excessive API calls
  const debouncedSync = useDebouncedCallback(
    useCallback(async () => {
      if (!projectId || !needsSync) return

      try {
        await updateProject.mutateAsync({
          canvas,
          lastModified: Date.now()
        })
      } catch (error) {
        console.error('Failed to sync canvas:', error)
      }
    }, [projectId, needsSync, canvas, updateProject]),
    2000 // 2 second debounce
  )

  // Auto-sync when canvas changes
  useEffect(() => {
    if (needsSync) {
      debouncedSync()
    }
  }, [needsSync, debouncedSync])

  // Manual sync function
  const manualSync = useCallback(async () => {
    if (!projectId) return

    return updateProject.mutateAsync({
      canvas,
      lastModified: Date.now()
    })
  }, [projectId, canvas, updateProject])

  return {
    issyncing: updateProject.isPending,
    syncError: updateProject.error,
    manualSync,
    needsSync
  }
}
```

### Usage Examples with Next.js Patterns

```typescript
// components/canvas/editor-canvas.tsx - Client component with state
'use client'

import { useEffect } from 'react'
import { useCanvasStore, canvasSelectors } from '@/stores/canvas-store'
import { useProject } from '@/lib/queries/projects'
import { useCanvasSync } from '@/hooks/use-canvas-sync'

interface EditorCanvasProps {
  projectId?: string
  initialProject?: Project
}

export function EditorCanvas({ projectId, initialProject }: EditorCanvasProps) {
  const canvas = useCanvasStore(canvasSelectors.canvas)
  const hydrateFromServer = useCanvasStore(state => state.hydrateFromServer)
  const setHydrated = useCanvasStore(state => state.setHydrated)

  // Fetch project data with React Query
  const { data: projectData, isLoading } = useProject(projectId)

  // Sync canvas with server
  const { issyncing, syncError, needsSync } = useCanvasSync(projectId)

  // Hydrate store from server data
  useEffect(() => {
    const serverData = initialProject || projectData?.project
    if (serverData && !isLoading) {
      hydrateFromServer(serverData)
      setHydrated(true)
    }
  }, [initialProject, projectData, isLoading, hydrateFromServer, setHydrated])

  if (isLoading) {
    return <div>Loading canvas...</div>
  }

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={canvas.width}
        height={canvas.height}
        className="border"
      />

      {needsSync && (
        <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
          {issyncing ? 'Syncing...' : 'Changes not saved'}
        </div>
      )}

      {syncError && (
        <div className="absolute top-2 right-2 bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
          Sync failed
        </div>
      )}
    </div>
  )
}

// Server component that passes initial data
// app/editor/[projectId]/page.tsx
export default async function ProjectEditorPage({ params }: ProjectEditorPageProps) {
  const project = await loadProject(params.projectId)

  return (
    <EditorCanvas
      projectId={params.projectId}
      initialProject={project}
    />
  )
}
```

### Performance Optimizations for Next.js

```typescript
// stores/performance-store.ts - Performance monitoring store
'use client'

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface PerformanceStore {
  metrics: {
    renderTime: number
    fps: number
    memoryUsage: number
    serverRequests: number
    cacheHits: number
    lastUpdate: number
  }
  updateMetrics: (metrics: Partial<PerformanceStore['metrics']>) => void
  resetMetrics: () => void
}

export const usePerformanceStore = create<PerformanceStore>()(
  subscribeWithSelector((set) => ({
    metrics: {
      renderTime: 0,
      fps: 60,
      memoryUsage: 0,
      serverRequests: 0,
      cacheHits: 0,
      lastUpdate: Date.now()
    },

    updateMetrics: (newMetrics) => set((state) => ({
      metrics: {
        ...state.metrics,
        ...newMetrics,
        lastUpdate: Date.now()
      }
    })),

    resetMetrics: () => set({
      metrics: {
        renderTime: 0,
        fps: 60,
        memoryUsage: 0,
        serverRequests: 0,
        cacheHits: 0,
        lastUpdate: Date.now()
      }
    })
  }))
)

// Performance monitoring hook
export function usePerformanceMonitor() {
  const updateMetrics = usePerformanceStore(state => state.updateMetrics)

  useEffect(() => {
    let frameId: number
    let lastTime = performance.now()
    let frames = 0

    const measureFPS = (currentTime: number) => {
      frames++
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime))
        updateMetrics({ fps })
        frames = 0
        lastTime = currentTime
      }
      frameId = requestAnimationFrame(measureFPS)
    }

    frameId = requestAnimationFrame(measureFPS)

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [updateMetrics])
}
```

### Store Actions for Next.js Integration

```typescript
// stores/canvas-actions.ts - Actions optimized for Next.js
export const canvasActions = {
  // Action with server sync
  updateElementWithSync: (id: string, updates: any, projectId?: string) => {
    const store = useCanvasStore.getState()

    // Update local state immediately
    store.updateCanvasElement(id, updates)

    // Trigger server sync if project exists
    if (projectId) {
      store.syncCanvasWithServer(projectId)
    }
  },

  // Batch action for performance
  batchUpdateWithSync: (updates: Array<{id: string, data: any}>, projectId?: string) => {
    const store = useCanvasStore.getState()

    store.batchUpdateElements(updates)

    if (projectId) {
      store.syncCanvasWithServer(projectId)
    }
  },

  // Reset canvas for new project
  resetCanvasForNewProject: () => {
    useCanvasStore.setState({
      canvas: {
        width: 1200,
        height: 800,
        zoom: 1,
        panX: 0,
        panY: 0,
        backgroundColor: '#ffffff',
        elements: []
      }
    })
  },

  // Export state for server action
  exportCanvasState: () => {
    const state = useCanvasStore.getState()
    return {
      canvas: state.canvas,
      exportedAt: Date.now()
    }
  }
}
```

### State Management Best Practices for Next.js 15

**1. Client-Server State Separation**
- Use Zustand for client-side UI and canvas state
- Use React Query for server state and API data
- Clearly separate what needs to persist vs. what's transient

**2. SSR/Hydration Considerations**
- Skip persistence during SSR with `skipHydration`
- Hydrate client stores from server data after initial render
- Handle hydration mismatches gracefully

**3. Performance Optimizations**
- Use selective subscriptions to prevent unnecessary re-renders
- Implement debounced server sync to reduce API calls
- Monitor performance metrics in development

**4. Error Handling**
- Implement optimistic updates with rollback capabilities
- Handle network failures gracefully with retry logic
- Provide user feedback for sync states and errors

**5. Type Safety**
- Use TypeScript interfaces for all state shapes
- Type selectors and actions properly
- Ensure server/client state type compatibility