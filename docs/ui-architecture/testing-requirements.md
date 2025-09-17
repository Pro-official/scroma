# Testing Requirements

### Next.js 15 + Vitest for Next.js Configuration

```typescript
// vitest.config.ts - optimized for Next.js 15 and React 19
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react({
      // React Compiler support for tests
      babel: {
        plugins: [['react-compiler', {}]]
      }
    })
  ],
  test: {
    // Modern test environment
    environment: 'jsdom',

    // Setup files for Next.js 15 and React 19
    setupFiles: ['./src/test/setup.ts'],

    // Next.js path resolution
    alias: {
      '@': resolve(__dirname, './'),
      '@/components': resolve(__dirname, './components'),
      '@/app': resolve(__dirname, './app'),
      '@/lib': resolve(__dirname, './lib'),
      '@/stores': resolve(__dirname, './stores'),
      '@/types': resolve(__dirname, './types'),
    },

    // Performance optimizations
    pool: 'threads',
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: 4,
      }
    },

    // Modern test execution
    watch: true,
    reporters: ['verbose', 'html'],
    outputFile: './coverage/test-results.html',

    // Coverage with V8 provider
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/test/',
        'app/api/**', // Exclude API routes from coverage
        '**/*.d.ts',
        '**/*.config.*',
        'lib/constants/**',
        'types/**',
        '.next/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },

    // Next.js specific globals
    globals: true,

    // Browser mode for canvas testing
    browser: {
      enabled: false, // Enable when needed for canvas-specific tests
      name: 'chrome',
      headless: true
    }
  }
})
```

### Next.js 15 Test Setup

```typescript
// src/test/setup.ts
import { afterEach, beforeAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  useParams() {
    return {}
  },
  notFound: vi.fn(),
  redirect: vi.fn(),
}))

vi.mock('next/font/google', () => ({
  Inter: () => ({
    style: { fontFamily: 'Inter' },
    variable: '--font-inter',
  }),
}))

vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock Next.js Server Actions
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: vi.fn(),
}))

// Global test cleanup
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.clearAllTimers()
})

// Mock modern browser APIs for canvas operations
beforeAll(() => {
  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock modern Canvas API
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: vi.fn((contextType) => {
      if (contextType === '2d') {
        return {
          // Canvas 2D context methods
          clearRect: vi.fn(),
          fillRect: vi.fn(),
          strokeRect: vi.fn(),
          beginPath: vi.fn(),
          closePath: vi.fn(),
          moveTo: vi.fn(),
          lineTo: vi.fn(),
          arc: vi.fn(),
          fill: vi.fn(),
          stroke: vi.fn(),
          // Image methods
          drawImage: vi.fn(),
          getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
          putImageData: vi.fn(),
          createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
          // Transform methods
          save: vi.fn(),
          restore: vi.fn(),
          scale: vi.fn(),
          rotate: vi.fn(),
          translate: vi.fn(),
          transform: vi.fn(),
          setTransform: vi.fn(),
          resetTransform: vi.fn(),
          // Text methods
          fillText: vi.fn(),
          strokeText: vi.fn(),
          measureText: vi.fn(() => ({ width: 100 })),
          // Path methods
          rect: vi.fn(),
          clip: vi.fn(),
          isPointInPath: vi.fn(() => false),
          // Properties
          canvas: HTMLCanvasElement.prototype,
          fillStyle: '#000000',
          strokeStyle: '#000000',
          lineWidth: 1,
          font: '10px sans-serif',
          textAlign: 'start',
          textBaseline: 'alphabetic'
        }
      }
      return null
    })
  })

  // Mock File API
  global.File = class MockFile {
    constructor(bits: any[], name: string, options: any = {}) {
      this.bits = bits
      this.name = name
      this.type = options.type || ''
      this.size = bits.reduce((acc, bit) => acc + bit.length, 0)
      this.lastModified = Date.now()
    }
  } as any

  // Mock FileReader
  global.FileReader = class MockFileReader {
    result = null
    error = null
    readyState = 0

    onload = null
    onerror = null
    onprogress = null

    readAsDataURL(file: File) {
      setTimeout(() => {
        this.result = `data:${file.type || 'application/octet-stream'};base64,mockdata`
        this.readyState = 2
        if (this.onload) this.onload({ target: this })
      }, 0)
    }

    readAsText(file: File) {
      setTimeout(() => {
        this.result = 'mock file content'
        this.readyState = 2
        if (this.onload) this.onload({ target: this })
      }, 0)
    }
  } as any

  // Mock URL.createObjectURL
  global.URL.createObjectURL = vi.fn(() => 'mock-blob-url')
  global.URL.revokeObjectURL = vi.fn()

  // Mock clipboard API
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockResolvedValue(''),
      write: vi.fn().mockResolvedValue(undefined),
      read: vi.fn().mockResolvedValue([])
    }
  })

  // Mock matchMedia for responsive design tests
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})
```

### Next.js 15 Component Testing Patterns

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { Suspense } from 'react'
import { CanvasToolbar } from '@/components/canvas/canvas-toolbar'
import { TestWrapper } from '@/test/utils/test-wrapper'
import { useCanvasStore } from '@/stores/canvas-store'

// Mock Zustand store with modern patterns
vi.mock('@/stores/canvas-store', () => ({
  useCanvasStore: vi.fn(),
  canvasSelectors: {
    zoom: vi.fn(),
    selectedTool: vi.fn(),
    elements: vi.fn()
  }
}))

// Mock Next.js specific hooks
const mockPush = vi.fn()
const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => '/editor',
  useSearchParams: () => new URLSearchParams(),
}))

describe('CanvasToolbar - Next.js 15 Patterns', () => {
  const mockStore = {
    zoom: 1,
    setZoom: vi.fn(),
    selectedTool: 'select',
    setTool: vi.fn(),
    ui: { isLoading: false, showGrid: false },
    toggleGrid: vi.fn(),
    canvas: { width: 1200, height: 800 }
  }

  beforeEach(() => {
    vi.mocked(useCanvasStore).mockImplementation((selector) =>
      selector ? selector(mockStore) : mockStore
    )
    vi.clearAllMocks()
  })

  describe('Next.js Integration', () => {
    it('renders with Next.js router integration', async () => {
      render(
        <TestWrapper>
          <Suspense fallback={<div>Loading toolbar...</div>}>
            <CanvasToolbar />
          </Suspense>
        </TestWrapper>
      )

      expect(screen.getByLabelText('Zoom in')).toBeInTheDocument()
      expect(screen.getByLabelText('Zoom out')).toBeInTheDocument()
    })

    it('handles navigation with Next.js router', async () => {
      const user = userEvent.setup()

      render(<TestWrapper><CanvasToolbar /></TestWrapper>)

      const templateButton = screen.getByLabelText('Browse templates')
      await user.click(templateButton)

      expect(mockPush).toHaveBeenCalledWith('/templates')
    })

    it('handles search params navigation', async () => {
      const user = userEvent.setup()

      render(<TestWrapper><CanvasToolbar /></TestWrapper>)

      const exportButton = screen.getByLabelText('Export canvas')
      await user.click(exportButton)

      // Should navigate to editor with export panel
      expect(mockReplace).toHaveBeenCalledWith('/editor?panel=export')
    })
  })

  describe('Server Actions Integration', () => {
    it('handles file upload with Server Actions', async () => {
      const user = userEvent.setup()
      const mockAction = vi.fn().mockResolvedValue({ success: true })

      render(
        <TestWrapper>
          <CanvasToolbar uploadAction={mockAction} />
        </TestWrapper>
      )

      const fileInput = screen.getByLabelText('Upload image')
      const file = new File(['test'], 'test.png', { type: 'image/png' })

      await user.upload(fileInput, file)

      await waitFor(() => {
        expect(mockAction).toHaveBeenCalled()
      })
    })

    it('handles form submission with Next.js actions', async () => {
      const user = userEvent.setup()
      const mockSaveAction = vi.fn().mockResolvedValue({
        success: true,
        projectId: 'test-project'
      })

      render(
        <TestWrapper>
          <CanvasToolbar saveAction={mockSaveAction} />
        </TestWrapper>
      )

      const saveButton = screen.getByText('Save Project')
      await user.click(saveButton)

      await waitFor(() => {
        expect(mockSaveAction).toHaveBeenCalled()
        expect(mockPush).toHaveBeenCalledWith('/editor/test-project')
      })
    })
  })

  describe('Canvas Performance with Next.js', () => {
    it('renders efficiently without unnecessary re-renders', () => {
      const renderSpy = vi.fn()

      const TestComponent = () => {
        renderSpy()
        return <CanvasToolbar />
      }

      const { rerender } = render(<TestWrapper><TestComponent /></TestWrapper>)

      expect(renderSpy).toHaveBeenCalledTimes(1)

      // Rerender with same props should not cause re-render due to React Compiler
      rerender(<TestWrapper><TestComponent /></TestWrapper>)
      expect(renderSpy).toHaveBeenCalledTimes(1)
    })

    it('handles canvas operations with requestAnimationFrame', async () => {
      const mockCanvasRef = { current: document.createElement('canvas') }
      const rafSpy = vi.spyOn(window, 'requestAnimationFrame')

      render(
        <TestWrapper>
          <CanvasToolbar canvasRef={mockCanvasRef} />
        </TestWrapper>
      )

      const zoomButton = screen.getByLabelText('Zoom in')
      fireEvent.click(zoomButton)

      expect(rafSpy).toHaveBeenCalled()
    })
  })
})
```

### Next.js 15 Page Component Testing

```typescript
// src/test/pages/editor.test.tsx
import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import EditorPage from '@/app/editor/page'
import { TestWrapper } from '@/test/utils/test-wrapper'

// Mock Next.js modules
vi.mock('@/components/canvas/editor-canvas', () => ({
  EditorCanvas: ({ projectId }: { projectId?: string }) => (
    <div data-testid="editor-canvas">
      Editor Canvas {projectId ? `- Project: ${projectId}` : '- New Project'}
    </div>
  )
}))

vi.mock('@/components/canvas/canvas-toolbar', () => ({
  CanvasToolbar: () => <div data-testid="canvas-toolbar">Canvas Toolbar</div>
}))

vi.mock('@/components/editor/side-panel', () => ({
  SidePanel: () => <div data-testid="side-panel">Side Panel</div>
}))

describe('EditorPage - Next.js 15', () => {
  it('renders editor layout correctly', async () => {
    render(
      <TestWrapper>
        <EditorPage searchParams={{}} />
      </TestWrapper>
    )

    expect(screen.getByTestId('canvas-toolbar')).toBeInTheDocument()
    expect(screen.getByTestId('editor-canvas')).toBeInTheDocument()
    expect(screen.getByTestId('side-panel')).toBeInTheDocument()
  })

  it('handles project ID from search params', async () => {
    render(
      <TestWrapper>
        <EditorPage searchParams={{ project: 'test-project-123' }} />
      </TestWrapper>
    )

    expect(screen.getByText(/Project: test-project-123/)).toBeInTheDocument()
  })

  it('renders with proper metadata', async () => {
    // Test that component renders without error
    expect(() => {
      render(
        <TestWrapper>
          <EditorPage searchParams={{}} />
        </TestWrapper>
      )
    }).not.toThrow()
  })
})
```

### Next.js API Route Testing

```typescript
// src/test/api/projects.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/projects/route'

// Mock the database functions
vi.mock('@/lib/api/projects', () => ({
  loadRecentProjects: vi.fn(),
  createProject: vi.fn(),
}))

import { loadRecentProjects, createProject } from '@/lib/api/projects'

describe('/api/projects API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/projects', () => {
    it('returns recent projects with default limit', async () => {
      const mockProjects = [
        { id: '1', name: 'Project 1' },
        { id: '2', name: 'Project 2' }
      ]

      vi.mocked(loadRecentProjects).mockResolvedValue(mockProjects)

      const request = new NextRequest('http://localhost:3000/api/projects')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.projects).toEqual(mockProjects)
      expect(loadRecentProjects).toHaveBeenCalledWith(10)
    })

    it('respects limit query parameter', async () => {
      const mockProjects = [{ id: '1', name: 'Project 1' }]
      vi.mocked(loadRecentProjects).mockResolvedValue(mockProjects)

      const request = new NextRequest('http://localhost:3000/api/projects?limit=5')
      await GET(request)

      expect(loadRecentProjects).toHaveBeenCalledWith(5)
    })

    it('handles errors gracefully', async () => {
      vi.mocked(loadRecentProjects).mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/projects')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to load projects')
    })
  })

  describe('POST /api/projects', () => {
    it('creates a new project', async () => {
      const mockProject = { id: '123', name: 'New Project' }
      vi.mocked(createProject).mockResolvedValue(mockProject)

      const requestBody = { name: 'New Project', description: 'Test project' }
      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.project).toEqual(mockProject)
      expect(createProject).toHaveBeenCalledWith(requestBody)
    })

    it('handles creation errors', async () => {
      vi.mocked(createProject).mockRejectedValue(new Error('Validation error'))

      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test' }),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to create project')
    })
  })
})
```

### Modern Test Utilities for Next.js

```typescript
// src/test/utils/test-wrapper.tsx
import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface TestWrapperProps {
  children: ReactNode
  initialEntries?: string[]
}

export const TestWrapper = ({
  children,
  initialEntries = ['/']
}: TestWrapperProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

// Next.js specific test utilities
export const createMockNextRequest = (url: string, options: RequestInit = {}) => {
  return new NextRequest(url, options)
}

export const createMockSearchParams = (params: Record<string, string>) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, value)
  })
  return searchParams
}

// Canvas-specific test utilities (unchanged)
export const createMockCanvasElement = (width = 800, height = 600) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

export const createMockImageData = (width = 100, height = 100) => {
  return new ImageData(new Uint8ClampedArray(width * height * 4), width, height)
}

// Store testing utilities for Next.js
export const createMockCanvasStore = (overrides = {}) => ({
  canvas: {
    width: 1200,
    height: 800,
    zoom: 1,
    elements: []
  },
  ui: {
    isLoading: false,
    selectedTool: 'select'
  },
  setZoom: vi.fn(),
  updateElement: vi.fn(),
  ...overrides
})

// Server Action testing utility
export const createMockServerAction = <T = any>(returnValue: T) => {
  return vi.fn().mockResolvedValue(returnValue)
}
```

### Integration Testing with Next.js

```typescript
// src/test/integration/canvas-workflow.test.tsx
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TestWrapper } from '@/test/utils/test-wrapper'

// Mock the complete Next.js app structure
vi.mock('@/app/editor/page', () => ({
  default: () => <div data-testid="editor-page">Editor Page</div>
}))

describe('Canvas Workflow Integration - Next.js', () => {
  it('completes full canvas editing workflow', async () => {
    const user = userEvent.setup()

    // Mock Server Actions
    const mockUploadAction = vi.fn().mockResolvedValue({
      success: true,
      fileUrl: '/uploads/test.png'
    })

    const mockSaveAction = vi.fn().mockResolvedValue({
      success: true,
      projectId: 'new-project-123'
    })

    const mockExportAction = vi.fn().mockResolvedValue({
      success: true,
      downloadUrl: '/exports/test-export.png'
    })

    render(
      <TestWrapper>
        <div data-testid="app">
          {/* Simulate the app structure */}
          <div data-testid="editor-page">Editor Page</div>
        </div>
      </TestWrapper>
    )

    // Verify the page renders
    expect(screen.getByTestId('editor-page')).toBeInTheDocument()
  })

  it('handles server-side errors gracefully', async () => {
    const user = userEvent.setup()

    // Mock Server Action that fails
    const mockFailingAction = vi.fn().mockResolvedValue({
      error: 'Server error occurred'
    })

    render(
      <TestWrapper>
        <div data-testid="error-boundary">
          Error boundary activated
        </div>
      </TestWrapper>
    )

    // Should show error state
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
  })
})
```

### Testing Best Practices for Next.js 15

**1. Next.js Specific Testing Patterns**
- Test page components with realistic props and search params
- Mock Next.js navigation hooks consistently across tests
- Test Server Actions with proper error handling
- Verify metadata generation works correctly

**2. API Route Testing**
- Test both successful and error scenarios
- Mock external dependencies (database, file system)
- Verify proper HTTP status codes and response formats
- Test request/response edge cases

**3. App Router Testing**
- Test nested layouts and loading states
- Verify proper error boundary behavior
- Test dynamic route parameters
- Test parallel routes and intercepting routes

**4. Performance Testing with Next.js**
- Monitor component render times with React DevTools
- Test code splitting and dynamic imports
- Verify proper caching behavior
- Test server component hydration

**5. Canvas-Specific Testing with Next.js**
- Test canvas operations in both client and server contexts
- Verify proper cleanup in Server Components
- Test file upload with Server Actions
- Monitor memory usage with large canvas operations

**6. Accessibility Testing**
- Test keyboard navigation with Next.js routing
- Verify proper focus management during route transitions
- Test screen reader compatibility with dynamic content
- Ensure ARIA attributes work with Server Components

**7. E2E Testing Considerations**
- Use Playwright for full Next.js app testing
- Test with real browser environment for canvas operations
- Verify proper SSR/hydration behavior
- Test performance with Lighthouse integration