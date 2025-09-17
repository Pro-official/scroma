# Story 5.1: Export Modal & Basic Options

## Epic
Epic 5: Export & Quality Settings

## User Story
As a user,
I want to export my completed mockup with format options,
so that I can use it in my intended application.

## Story Context

**Cross-Epic Dependencies:**
- **CRITICAL DEPENDENCY:** Requires Frame interface and FrameLibraryState from Story 2.1
- **CRITICAL DEPENDENCY:** Requires selectedFrameId and frame properties for export rendering
- **CRITICAL DEPENDENCY:** Requires Background/Gradient data structures from Epic 3 stories
- **CRITICAL DEPENDENCY:** Requires TextLayer interface from Epic 4 stories

**Existing System Integration:**
- Integrates with: Canvas rendering system, frame state management, background state, text layers, file download functionality
- Technology: Next.js 15 with App Router, HTML Canvas API, browser File API, shadcn/ui modal components
- Follows pattern: Modal dialog pattern established in existing UI components with Next.js client components
- Touch points: Canvas export engine, frame rendering system, background renderer, text renderer, main toolbar, keyboard shortcut system, Next.js client-side processing

## Acceptance Criteria

**Functional Requirements:**
1. Export button opens modal with preview of final output using Next.js Image optimization
2. Format selection between PNG and JPG with clear descriptions and use case guidance
3. Filename input with automatic suggestion based on original upload name

**Export Process Requirements:**
4. Export button triggers client-side processing and download using Next.js optimization
5. Export completion shows success message with file size information
6. Cancel option closes modal without exporting
7. Keyboard shortcut (Ctrl/Cmd+E) opens export modal from anywhere in app

**Integration Requirements:**
8. Existing canvas rendering functionality continues to work unchanged
9. New export system integrates with current canvas state management using Zustand + Next.js patterns
10. Integration with file download follows browser security best practices and Next.js client-side patterns

**Quality Requirements:**
11. Export functionality is covered by appropriate tests using Next.js testing patterns
12. File download works across all supported browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
13. No regression in existing canvas functionality verified with Next.js optimization

## Technical Notes

**Required Dependencies from Other Epics:**
```typescript
'use client'

// From Story 2.1 - Frame Library Component
import { Frame, FrameLibraryState } from '@/stores/frame-store'

// From Epic 3 - Background System
import { BackgroundConfig, GradientConfig } from '@/stores/background-store'

// From Epic 4 - Text Overlays
import { TextLayer } from '@/stores/text-store'

// Next.js specific imports
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// Export data structure must include all applied elements
interface ExportCanvasData {
  image: ImageData
  frame: Frame | null
  background: BackgroundConfig | null
  textLayers: TextLayer[]
  canvas: CanvasConfig
}
```

**Next.js 15 Implementation Patterns:**
```typescript
'use client'

import { useState, useCallback } from 'react'
import { useStore } from '@/stores/export-store'
import Image from 'next/image'

export default function ExportModal() {
  const [isExporting, setIsExporting] = useState(false)
  const [exportPreview, setExportPreview] = useState<string | null>(null)

  const handleExport = useCallback(async () => {
    setIsExporting(true)
    try {
      // Client-side processing with Next.js optimization
      const blob = await generateExportBlob()
      const url = URL.createObjectURL(blob)

      // Trigger download
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } finally {
      setIsExporting(false)
    }
  }, [filename])

  return (
    <div className="export-modal">
      {exportPreview && (
        <Image
          src={exportPreview}
          alt="Export preview"
          width={400}
          height={300}
          priority
          className="rounded-lg"
        />
      )}
      {/* Modal content */}
    </div>
  )
}
```

- **Integration Approach:** Creates new export service that renders complete canvas composition (image + frame + background + text) to blob and triggers download using Next.js client-side processing
- **Existing Pattern Reference:** Follow modal patterns from shadcn/ui components for consistent UX with Next.js App Router structure
- **Key Constraints:** Must work entirely client-side without server dependency, handle large image exports gracefully with Next.js optimization
- **Memory Management:** Implement memory usage monitoring per NFR requirement (max 500MB) with Next.js performance monitoring

**Component Structure (Next.js App Router):**
```
components/
├── export/
│   ├── export-modal.tsx              # Main export modal (use client)
│   ├── export-preview.tsx            # Preview with Next.js Image
│   ├── format-selector.tsx           # PNG/JPG selection
│   └── export-progress.tsx           # Progress indicator
```

## Definition of Done

- [ ] Export button accessible from main interface opens modal
- [ ] Modal displays accurate preview of final export output using Next.js Image optimization
- [ ] Format selection (PNG/JPG) works with clear explanations
- [ ] Filename input suggests appropriate name based on original file
- [ ] Export process completes successfully with client-side file download using Next.js patterns
- [ ] Success message displays with accurate file size
- [ ] Cancel functionality works without side effects
- [ ] Ctrl/Cmd+E keyboard shortcut opens modal globally
- [ ] Existing canvas and rendering functionality regression tested
- [ ] Code follows established modal and service patterns with Next.js client components
- [ ] Tests pass (existing and new export tests) using Next.js testing framework
- [ ] Cross-browser compatibility verified for file downloads
- [ ] Documentation updated for export workflow with Next.js patterns

## Business Value & Performance

**Next.js 15 Optimizations:**
- Client-side export processing eliminates server round trips
- Next.js Image component provides optimized preview rendering
- App Router enables better code splitting and performance
- Built-in performance monitoring tracks export completion times
- Memory management enhanced with Next.js optimization patterns

**User Experience Improvements:**
- Faster export previews with Next.js Image optimization
- Smoother interaction with client-side processing
- Better error handling with Next.js error boundaries
- Progressive enhancement for slower devices

## Risk Assessment

**Primary Risk:** Large canvas exports may cause browser memory issues or performance problems
**Mitigation:** Implement export size validation and progressive rendering for large files using Next.js optimization patterns
**Rollback:** Disable export functionality while maintaining canvas editing capabilities

**Next.js Specific Considerations:**
- Ensure client-side only functionality with 'use client' directive
- Monitor memory usage during large exports
- Implement proper cleanup of blob URLs and canvas contexts

## Compatibility Check

- [ ] No breaking changes to existing canvas rendering APIs
- [ ] Export additions are isolated and don't affect core canvas functionality
- [ ] UI changes follow existing design patterns from other modals with Next.js components
- [ ] File download works reliably across all target browsers with Next.js client-side patterns
- [ ] Performance impact is acceptable for typical export sizes (up to 4K resolution) with Next.js optimization