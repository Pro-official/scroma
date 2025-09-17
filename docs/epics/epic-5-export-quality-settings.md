# Epic 5: Export & Quality Settings

## Epic Goal

Deliver high-quality export functionality that preserves mockup quality while providing flexibility in format and resolution using Next.js 15 optimization. Users will have full control over output settings to match their specific use cases with sub-1s export preparation performance.

## Epic Description

### Purpose

This epic completes the core Scroma workflow by providing professional-grade export capabilities optimized for Next.js 15 architecture. Users can optimize their mockups for different platforms, maintain quality standards, and efficiently deliver final assets. The export system serves as the foundation for sharing features and batch processing capabilities, all with SSG performance benefits.

### Business Value

- Enables professional workflow completion with publication-ready outputs
- Supports diverse use cases from social media to print materials
- Provides quality control that matches expensive design software
- Creates foundation for premium features like batch export and cloud storage
- Leverages Next.js 15 SSG for instant export preset loading and smooth operations

### Technical Implementation

- Multi-format export engine with quality optimization using Next.js client-side processing
- Real-time preview and size estimation for informed decisions
- Efficient canvas rendering pipeline for large exports optimized for Next.js performance
- Extensible architecture supporting future format additions via Next.js modularity
- Export presets and configurations served via SSG for instant access

## User Stories

### Story 5.1: Export Modal & Basic Options

**Goal:** Provide intuitive export interface with essential format options using Next.js client optimization
**Effort:** 8 story points
**Dependencies:** Epic 4 (Text system for complete mockup export)

**Acceptance Criteria:**

1. Export button opens modal with preview of final output using Next.js client-side rendering
2. Format selection between PNG and JPG with clear descriptions
3. Filename input with automatic suggestion based on upload name
4. Export button triggers download to default download folder
5. Export completion shows success message with file size
6. Cancel option closes modal without exporting
7. Keyboard shortcut (Ctrl/Cmd+E) opens export modal
8. Export modal operations optimized for Next.js client performance

### Story 5.2: Quality & Resolution Controls

**Goal:** Enable precise control over export quality and dimensions with Next.js optimization
**Effort:** 8 story points
**Dependencies:** Story 5.1

**Acceptance Criteria:**

1. Resolution multiplier options (1x, 2x, 3x) with pixel dimension display
2. Quality slider for JPG (60-100%) with file size estimate using Next.js client-side calculation
3. PNG options include transparency preservation toggle
4. Actual dimensions shown in pixels (e.g., "1920x1080")
5. File size estimate updates as settings change in real-time
6. Maximum dimension validation prevents crashes (8K limit)
7. Preset buttons for common uses (Web, Print, Social Media) served via SSG
8. Quality controls optimized for smooth interaction with Next.js client patterns

### Story 5.3: Advanced Export Features

**Goal:** Provide specialized export options for power users with Next.js performance optimization
**Effort:** 13 story points
**Dependencies:** Story 5.2

**Acceptance Criteria:**

1. Crop to content option removes excess transparent/background area using Next.js client-side processing
2. Social media size presets (Instagram, Twitter, LinkedIn, etc.) pre-loaded via SSG
3. Watermark toggle adds customizable text/logo
4. Metadata preservation option for JPG files
5. Color profile selection (sRGB, Display P3)
6. Export progress bar for large files with Next.js client optimization
7. Copy to clipboard option for quick sharing
8. Advanced features leverage Next.js client-side capabilities for smooth operation

### Story 5.4: Batch Export Preparation

**Goal:** Establish infrastructure for future batch processing features with Next.js architecture
**Effort:** 5 story points
**Dependencies:** Story 5.3

**Acceptance Criteria:**

1. Export settings object structured for reuse across multiple images
2. Export queue system handles multiple files sequentially using Next.js client optimization
3. Template system saves export configurations with localStorage persistence
4. Export history tracks recent exports with settings
5. API structure supports future backend processing via Next.js API routes
6. Performance optimized for multiple large exports with Next.js patterns
7. Memory cleanup after each export prevents leaks
8. Batch infrastructure ready for Next.js API route integration

## Technical Architecture

### Next.js 15 Export Engine Structure

```
lib/export/
├── export-engine.ts           # Core export processing optimized for Next.js
├── format-handlers/
│   ├── png-exporter.ts        # PNG format handling with Next.js optimization
│   ├── jpg-exporter.ts        # JPG format handling
│   └── webp-exporter.ts       # WebP format (future)
├── quality-optimizer.ts       # Quality and compression with Next.js client processing
├── canvas-renderer.ts         # High-resolution rendering optimized for Next.js
├── metadata-manager.ts        # File metadata handling
└── export-utils.ts           # Utility functions

components/export-modal/
├── export-modal.tsx           # Main export interface with Next.js optimization
├── format-selector.tsx        # Format and quality controls
├── resolution-controls.tsx    # Size and resolution options
├── preview-panel.tsx          # Export preview display using Next.js Image
├── advanced-options.tsx       # Advanced export features
├── export-progress.tsx        # Progress and completion
└── export-history.tsx        # Recent exports management with SSG data
```

### State Management Extensions (Zustand + Next.js)

```typescript
interface ExportState {
  // Export configuration
  exportConfig: ExportConfig;
  isExporting: boolean;
  exportProgress: number;

  // Preview and estimation (Next.js optimized)
  previewUrl: string | null;
  estimatedFileSize: number;
  actualDimensions: { width: number; height: number };

  // History and presets (SSG optimized)
  exportHistory: ExportHistoryItem[];
  exportPresets: ExportPreset[];
  recentSettings: ExportConfig[];
  nextjsPresetCache: Map<string, ExportPreset>;

  // UI state
  showAdvancedOptions: boolean;
  showPreview: boolean;
  exportError: string | null;
}

interface ExportConfig {
  // Basic settings
  format: "png" | "jpg" | "webp";
  quality: number; // 0.1-1.0 for JPG/WebP
  filename: string;

  // Resolution settings
  resolutionMultiplier: 1 | 2 | 3 | 4;
  customDimensions?: { width: number; height: number };
  maintainAspectRatio: boolean;

  // PNG specific
  preserveTransparency: boolean;
  compressionLevel: number; // 0-9

  // JPG specific
  progressive: boolean;
  optimizeHuffman: boolean;

  // Advanced options
  cropToContent: boolean;
  includeMetadata: boolean;
  colorProfile: "sRGB" | "Display-P3" | "Adobe-RGB";
  watermark?: WatermarkConfig;

  // Social media presets (SSG loaded)
  socialPreset?: SocialMediaPreset;
}

interface ExportPreset {
  id: string;
  name: string;
  description: string;
  config: ExportConfig;
  category: "web" | "print" | "social" | "presentation" | "custom";
  icon: string;
  nextjsIcon: string; // Optimized for Next.js Image
}
```

### Next.js 15 Social Media Presets (SSG)

```typescript
// SSG data loading for export presets
export async function getStaticProps() {
  const exportPresets = await loadExportPresets();
  const socialMediaPresets = await loadSocialMediaPresets();

  return {
    props: {
      exportPresets,
      socialMediaPresets,
    },
    revalidate: false, // Static presets don't change
  };
}

const SOCIAL_MEDIA_PRESETS: ExportPreset[] = [
  {
    id: "instagram-post",
    name: "Instagram Post",
    description: "1080x1080 square format",
    category: "social",
    nextjsIcon: "/icons/instagram.svg",
    config: {
      format: "jpg",
      quality: 0.9,
      customDimensions: { width: 1080, height: 1080 },
      colorProfile: "sRGB",
      cropToContent: false,
    },
  },
  {
    id: "twitter-post",
    name: "Twitter Post",
    description: "1200x675 landscape format",
    category: "social",
    nextjsIcon: "/icons/twitter.svg",
    config: {
      format: "jpg",
      quality: 0.85,
      customDimensions: { width: 1200, height: 675 },
      colorProfile: "sRGB",
      cropToContent: false,
    },
  },
  {
    id: "linkedin-post",
    name: "LinkedIn Post",
    description: "1200x627 professional format",
    category: "social",
    nextjsIcon: "/icons/linkedin.svg",
    config: {
      format: "jpg",
      quality: 0.9,
      customDimensions: { width: 1200, height: 627 },
      colorProfile: "sRGB",
      includeMetadata: true,
    },
  },
  // ... additional presets
];
```

## Next.js 15 Export Quality Pipeline

### High-Resolution Rendering with Next.js Optimization

```typescript
class HighResolutionExporter {
  async exportCanvas(
    canvasData: CanvasData,
    config: ExportConfig
  ): Promise<Blob> {
    // Create high-resolution canvas with Next.js optimization
    const exportCanvas = this.createExportCanvas(canvasData, config);

    // Render all layers at high resolution using Next.js client patterns
    await this.renderAllLayers(exportCanvas, canvasData, config);

    // Apply post-processing effects optimized for Next.js
    await this.applyPostProcessing(exportCanvas, config);

    // Export to desired format with Next.js client-side processing
    return this.generateBlob(exportCanvas, config);
  }

  private createExportCanvas(
    canvasData: CanvasData,
    config: ExportConfig
  ): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    const multiplier = config.resolutionMultiplier;

    canvas.width = canvasData.width * multiplier;
    canvas.height = canvasData.height * multiplier;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(multiplier, multiplier);

    return canvas;
  }

  private async renderAllLayers(
    canvas: HTMLCanvasElement,
    canvasData: CanvasData,
    config: ExportConfig
  ): Promise<void> {
    const ctx = canvas.getContext("2d")!;

    // Render background with Next.js optimization
    await this.renderBackground(ctx, canvasData.background);

    // Render main image with Next.js client processing
    await this.renderImage(ctx, canvasData.image);

    // Render frame with Next.js optimization
    if (canvasData.frame) {
      await this.renderFrame(ctx, canvasData.frame);
    }

    // Render text layers with Next.js font optimization
    for (const textLayer of canvasData.textLayers) {
      await this.renderTextLayer(ctx, textLayer);
    }

    // Apply watermark if configured
    if (config.watermark) {
      await this.renderWatermark(ctx, config.watermark);
    }
  }
}

// Next.js client-side file size estimation
export function useFileSizeEstimator() {
  const estimateFileSize = useCallback(
    (canvasData: CanvasData, config: ExportConfig) => {
      // Optimized estimation logic for Next.js client
      const pixels =
        canvasData.width * canvasData.height * config.resolutionMultiplier ** 2;

      if (config.format === "png") {
        return pixels * 3 * (1 - config.compressionLevel / 10); // Rough PNG estimation
      } else {
        return pixels * config.quality * 2; // Rough JPG estimation
      }
    },
    []
  );

  return { estimateFileSize };
}
```

## Definition of Done

### Functional Requirements

- [ ] All user stories completed with acceptance criteria met
- [ ] Export supports PNG and JPG formats with quality control
- [ ] Resolution scaling up to 4x maintains visual quality
- [ ] Social media presets cover major platforms via SSG
- [ ] Advanced options provide professional-level control
- [ ] Next.js SSG delivers instant export preset loading

### Performance Requirements

- [ ] Export processing completes within 10 seconds for 4K outputs with Next.js optimization
- [ ] File size estimation accuracy within 10% of actual size using Next.js client calculation
- [ ] Memory usage remains under 500MB during large exports
- [ ] Export operations don't block UI interactions via Next.js client patterns
- [ ] SSG pre-loading eliminates export preset loading delays

### Quality Requirements

- [ ] Exported images maintain visual fidelity at all resolutions
- [ ] Color accuracy preserved across different export formats
- [ ] Text rendering sharp and clear at high resolutions using Next.js font optimization
- [ ] Frame and background quality preserved in exports
- [ ] Next.js client optimization ensures smooth export workflow

### User Experience Requirements

- [ ] Export workflow intuitive for non-technical users
- [ ] Real-time preview updates provide immediate feedback via Next.js client rendering
- [ ] Export progress clearly communicated to users
- [ ] Error handling graceful with clear recovery options
- [ ] SSG optimization ensures sub-1s export modal loading

## Success Metrics

### Feature Usage

- **Target:** 95% of users who create mockups proceed to export
- **Measurement:** Analytics tracking export modal opens and completions

### Quality Satisfaction

- **Target:** 90% of exported images meet user quality expectations
- **Measurement:** User surveys and quality feedback collection

### Performance Metrics (Next.js 15 Optimized)

- **Target:** Export completion time under 5 seconds for standard resolution
- **Measurement:** Performance monitoring of export processing time
- **Next.js Target:** Export presets load instantly via SSG

### Format Adoption

- **Target:** 60% PNG, 35% JPG, 5% other formats based on use case
- **Measurement:** Analytics tracking format selection patterns

## Risk Assessment

### Primary Risk: Export Performance and Memory Usage

**Mitigation:**

- Efficient canvas rendering with memory management using Next.js optimization
- Progressive export for very large files via Next.js client patterns
- Performance monitoring with automatic quality degradation
- SSG pre-loading eliminates runtime performance bottlenecks

### Secondary Risk: Browser Compatibility for Large Exports

**Mitigation:**

- Browser capability detection and limits
- Graceful fallback to lower resolutions via Next.js client detection
- Clear communication of browser limitations
- Next.js client-side optimization handles browser differences

### Tertiary Risk: File Size and Quality Balance

**Mitigation:**

- Smart default settings for each format via SSG presets
- Real-time file size estimation using Next.js client calculation
- Visual quality preview for informed decisions

### Rollback Plan

- Feature flags for individual export formats
- Fallback to basic PNG export if advanced features fail
- Export preset versioning for quick rollback
- Next.js static regeneration for export configuration updates

## Integration Points

### Upstream Dependencies

- Epic 1: Canvas system for data serialization with Next.js optimization
- Epic 2: Frame system for high-resolution frame rendering
- Epic 3: Background system for gradient export
- Epic 4: Text system for typography preservation using Next.js font optimization

### Downstream Dependencies

- Epic 6: AI Integration will provide smart export suggestions via API routes
- Future batch processing features will build on export infrastructure
- Future cloud storage integration will use export pipeline via Next.js API routes

### Next.js 15 Integration Points

- **SSG Optimization:** Export presets and social media configurations pre-loaded
- **Client Optimization:** Real-time export processing and preview generation
- **Bundle Optimization:** Export code split for optimal loading
- **Static Generation:** Export presets and configurations generate at build time
- **API Routes:** Future cloud export and batch processing integration

### External Integrations

- Browser File System API for download handling
- Canvas API for high-resolution rendering with Next.js optimization
- Next.js Analytics for export usage tracking
- Future: Next.js API routes for cloud storage integration

## Export Format Specifications

### PNG Export (Next.js Optimized)

- **Compression:** Lossless with configurable compression level (0-9)
- **Transparency:** Full alpha channel support
- **Color Depth:** 24-bit RGB or 32-bit RGBA
- **Maximum Resolution:** 8192x8192 pixels
- **Metadata:** Optional PNG text chunks for attribution
- **Next.js Optimization:** Client-side processing for optimal performance

### JPG Export (Next.js Optimized)

- **Compression:** Lossy with quality range 60-100%
- **Color Space:** sRGB, Display P3, or Adobe RGB
- **Progressive:** Optional progressive encoding
- **Maximum Resolution:** 8192x8192 pixels
- **Metadata:** EXIF data preservation option
- **Next.js Optimization:** Client-side quality processing

### Quality Optimization (SSG Presets)

```typescript
interface QualityProfile {
  web: { png: 6; jpg: 0.85 }; // Balanced for web delivery
  print: { png: 3; jpg: 0.95 }; // High quality for print
  social: { png: 6; jpg: 0.8 }; // Optimized for social media
  archive: { png: 0; jpg: 1.0 }; // Maximum quality preservation
}
```

## Future Enhancements (Out of Scope)

### Additional Formats

- WebP export for modern browsers
- SVG export for vector-based mockups
- PDF export for presentations
- Animated GIF export for interactive demos

### Advanced Features (Next.js API Routes)

- Batch export of multiple mockups via API routes
- Cloud storage integration (Google Drive, Dropbox) using Next.js API
- API export for automated workflows
- Print optimization with CMYK color profiles

### Performance Optimizations

- Web Worker processing for background exports
- Streaming export for very large files
- Client-side compression algorithms via Next.js optimization
- Progressive download for shared exports

---

**Epic Owner:** Winston (Architect)
**Technical Lead:** Development Team
**Business Stakeholder:** Product Manager
**Timeline:** Sprint 9-10 (4 weeks)
**Priority:** P1 - Core workflow completion
**Next.js 15 Migration:** Complete architecture update for SSG optimization
