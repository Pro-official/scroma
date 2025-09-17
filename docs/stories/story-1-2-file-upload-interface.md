# Story 1.2: File Upload Interface

## Story Overview

**Epic:** Epic 1 - Foundation & Core Upload System
**Story ID:** 1.2
**Priority:** High
**Status:** Ready for Development
**Estimated Effort:** 8 Story Points
**Sprint Assignment:** Sprint 1
**Dependencies:** Story 1.1 (Project Setup)

## User Story

**As a** user,
**I want to** upload screenshot images through multiple methods using Next.js 15 optimization,
**So that I can** quickly get my images into the editor with sub-1s loading performance.

## Business Value

- Provides immediate user value through core functionality with Next.js 15 SSG performance
- Supports multiple user preferences for file input (drag-drop, browse, paste)
- Establishes foundation for all subsequent editing features
- Enables achievement of "under 2 minutes" mockup creation goal
- Leverages Next.js client-side optimization for smooth upload experience

## Acceptance Criteria

### Upload Methods
1. **Drag-and-Drop Interface**
   - Prominent drop zone visible on main page with clear visual hierarchy
   - Hover states provide immediate feedback with color/border changes
   - Drop zone highlights when files dragged over the application
   - Visual indicators show supported file types and size limits
   - Upload zone optimized for Next.js client-side rendering

2. **File Browser Selection**
   - Click-to-browse functionality triggers native file dialog
   - File dialog filtered to show only PNG, JPG, and WebP formats
   - Multiple file selection supported for sequential editing workflow
   - File dialog opens with appropriate default directory
   - File selection optimized for Next.js client performance

3. **Clipboard Paste**
   - Paste from clipboard (Ctrl/Cmd+V) works from anywhere on the page
   - Supports images copied from screenshots, browsers, and other applications
   - Visual feedback indicates successful paste detection
   - Focus state doesn't interfere with paste functionality
   - Paste handling optimized for Next.js client-side processing

### File Validation
4. **Format Support**
   - Accepts PNG, JPG/JPEG, and WebP image formats
   - Clear error messages for unsupported formats with format recommendations
   - File type detection based on content, not just extension
   - Graceful handling of corrupted or invalid image files

5. **Size Validation**
   - 10MB maximum file size limit enforced with user-friendly error messaging
   - File size validation occurs before processing to prevent performance issues
   - Large file warning appears at 5MB with optimization suggestions
   - Clear indication of file size limits in upload interface

6. **Upload Progress**
   - Progress indicator appears for files over 1MB showing upload/processing status
   - Percentage complete and estimated time remaining for large files
   - Cancel option available during upload process
   - Success/error states clearly communicated to user
   - Progress tracking optimized for Next.js client performance

### User Experience
7. **Upload Instructions**
   - Supported format list clearly displayed (PNG, JPG, WebP)
   - File size limits prominently shown (max 10MB)
   - Visual examples of drag-drop, click, and paste methods
   - Helpful tips for best results (recommended resolution, file types)

## Technical Implementation

### Next.js 15 Component Architecture
```
components/upload/
├── upload-zone.tsx              # Main drag-drop interface with Next.js client optimization
├── file-browser.tsx             # Click-to-browse functionality
├── paste-handler.tsx            # Clipboard paste detection
├── file-validator.tsx           # File type and size validation
├── upload-progress.tsx          # Progress indicator component
└── upload-instructions.tsx      # User guidance and tips

lib/upload/
├── file-upload-service.ts       # File processing optimized for Next.js
├── file-validation.ts           # Validation logic
└── upload-utils.ts              # Upload utilities
```

### File Processing Pipeline (Next.js Optimized)
```typescript
interface FileUploadState {
  isDragging: boolean
  isUploading: boolean
  uploadProgress: number
  error: string | null
  supportedFormats: string[]
  maxFileSize: number
}

interface FileValidationResult {
  isValid: boolean
  error?: string
  file?: ProcessedFile
}

interface ProcessedFile {
  file: File
  src: string
  dimensions: { width: number; height: number }
  size: number
  format: string
  name: string
}

// Next.js 15 optimized file upload service
export class FileUploadService {
  static readonly SUPPORTED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  static readonly MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

  static async validateFile(file: File): Promise<FileValidationResult> {
    // File type validation
    if (!this.SUPPORTED_FORMATS.includes(file.type)) {
      return {
        isValid: false,
        error: `Unsupported format. Please use PNG, JPG, or WebP files.`
      }
    }

    // File size validation
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File too large. Maximum size is ${this.MAX_FILE_SIZE / 1024 / 1024}MB.`
      }
    }

    // Process file with Next.js optimization
    try {
      const processedFile = await this.processFile(file)
      return { isValid: true, file: processedFile }
    } catch (error) {
      return {
        isValid: false,
        error: 'Failed to process image. Please try a different file.'
      }
    }
  }

  static async processFile(file: File): Promise<ProcessedFile> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        const src = event.target?.result as string
        const img = new Image()

        img.onload = () => {
          resolve({
            file,
            src,
            dimensions: { width: img.width, height: img.height },
            size: file.size,
            format: file.type,
            name: file.name
          })
        }

        img.onerror = () => reject(new Error('Invalid image file'))
        img.src = src
      }

      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }
}
```

### Next.js 15 Drag and Drop Implementation
```typescript
'use client'

import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await handleFileUpload(files[0])
    }
  }, [])

  const handleFileSelect = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await handleFileUpload(files[0])
    }
  }, [])

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="space-y-4">
        <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground" />
        <div>
          <p className="text-lg font-medium">
            Drag and drop your screenshot here
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            or{" "}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-primary hover:underline"
            >
              browse files
            </button>{" "}
            or paste (Ctrl+V)
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          Supports PNG, JPG, WebP • Max 10MB
        </div>
      </div>
    </div>
  )
}
```

## Definition of Done

### Functional Requirements
- [ ] All three upload methods (drag-drop, browse, paste) working correctly
- [ ] File validation prevents invalid uploads with clear error messages
- [ ] Upload progress shown for files over 1MB with accurate timing
- [ ] Multiple file handling queues images for sequential processing
- [ ] Error states provide actionable feedback to users
- [ ] Next.js client optimization ensures smooth upload experience

### Performance Requirements
- [ ] File validation completes within 500ms for typical files using Next.js client optimization
- [ ] Upload progress updates smoothly without UI blocking via Next.js patterns
- [ ] Large file processing (up to 10MB) completes within 30 seconds
- [ ] Memory usage efficient for multiple file uploads with Next.js client-side management
- [ ] SSG optimization ensures instant upload interface loading

### User Experience Requirements
- [ ] Upload interface intuitive for first-time users
- [ ] Visual feedback immediate for all user interactions
- [ ] Error messages helpful and actionable
- [ ] Upload success clearly indicated with next steps
- [ ] Next.js client optimization provides smooth interactions

### Accessibility Requirements
- [ ] Keyboard navigation supports all upload methods
- [ ] Screen readers announce upload states and progress
- [ ] Focus indicators visible for interactive elements
- [ ] Error messages accessible to assistive technologies

## Testing Strategy

### Unit Tests
- File validation logic with various file types and sizes
- Upload progress calculation accuracy
- Error message generation for different failure scenarios
- File processing pipeline with mock file objects
- Next.js client component functionality

### Integration Tests
- End-to-end upload flow from selection to processing
- Browser compatibility for drag-drop and paste functionality
- File dialog integration across different operating systems
- Upload cancellation and error recovery workflows
- Next.js client-side optimization performance

### User Acceptance Tests
- First-time user can successfully upload image within 30 seconds
- Power users can efficiently upload multiple images
- Error scenarios handled gracefully with clear recovery paths
- Upload interface responsive across different screen sizes

## Success Metrics

### User Engagement
- **Target:** 95% of visitors attempt file upload within first session
- **Measurement:** Analytics tracking upload zone interactions

### Upload Success Rate
- **Target:** 90% of valid uploads complete successfully
- **Measurement:** Success/failure ratio of upload attempts

### User Experience (Next.js 15 Optimized)
- **Target:** Average time to first successful upload under 15 seconds
- **Measurement:** Time tracking from page load to upload completion
- **Next.js Target:** Upload interface loads instantly via SSG optimization

### Error Handling
- **Target:** <5% of users encounter upload errors
- **Measurement:** Error rate tracking and user feedback

## Risk Assessment

### Primary Risk: Browser Compatibility Issues
**Mitigation:**
- Progressive enhancement for advanced features
- Fallback methods for unsupported browsers
- Comprehensive testing across target browser matrix
- Next.js client-side optimization handles browser differences

### Secondary Risk: Large File Performance
**Mitigation:**
- File size warnings and optimization suggestions
- Progressive loading and processing via Next.js patterns
- Memory management for large uploads

### Rollback Plan
- Feature flags for individual upload methods
- Graceful degradation to basic file input if advanced features fail
- Alternative upload flow for problematic browsers
- Next.js static regeneration for upload component updates

---

**Story Owner:** Development Team
**Technical Lead:** Frontend Developer
**Timeline:** Sprint 1 - Week 2
**Dependencies:** Next.js 15 project setup (Story 1.1)
**Next.js 15 Migration:** Complete client-side optimization for upload functionality