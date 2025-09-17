# Scroma Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- Enable users to create professional screenshot mockups in under 2 minutes without design expertise
- Provide specialized tool for screenshot enhancement that's faster and simpler than general design software
- Achieve 1,000 active users within 6 months with 5% freemium-to-paid conversion
- Deliver consistent branding capabilities for teams and individuals
- Support batch processing to handle multiple screenshots efficiently
- Generate $5K MRR within 6 months scaling to $25K MRR within 12 months

### Background Context

Scroma addresses the significant productivity gap in screenshot presentation workflows where content creators, developers, and marketers currently spend 3-5 hours weekly using complex design tools for simple mockup tasks. With the 300% increase in demand for professional screenshot presentations driven by micro SaaS growth and social media marketing, Scroma provides a browser-based specialized solution that reduces mockup creation time from 30+ minutes to under 2 minutes per image.

The tool focuses exclusively on screenshot enhancement rather than general design, offering drag-and-drop simplicity with powerful customization options, pre-designed templates, and real-time preview capabilities. This specialization allows users to achieve professional results without the learning curve of Photoshop or Figma, at a fraction of the cost of existing specialized tools.

### Change Log

| Date       | Version | Description                                            | Author    |
| ---------- | ------- | ------------------------------------------------------ | --------- |
| 2025-01-17 | 1.0     | Initial PRD creation from Project Brief                | PM        |
| 2025-09-18 | 2.0     | Updated for Next.js 15 architecture and AI integration | Architect |

## Requirements

### Functional

- FR1: The system shall accept image uploads via drag-and-drop, paste from clipboard, and file selection for PNG, JPG, and WebP formats up to 10MB
- FR2: The frame library shall provide at least 10 pre-designed frames including browser mockups (Chrome, Safari, generic), device frames (iPhone, Android, tablet), and customizable colored borders
- FR3: The background system shall offer gradient builder with 20+ presets, custom gradient creation with 2-5 color stops, and solid color selection from color picker or hex input
- FR4: Text overlay tools shall support adding multiple text layers with controls for font selection (minimum 10 web fonts), size adjustment (8px-200px), color selection, positioning via drag or coordinates, and text alignment options
- FR5: The canvas shall provide real-time visual feedback for all editing actions with less than 50ms latency for user interactions
- FR6: Resize and positioning shall include drag-to-resize with corner and edge handles, smart snapping to canvas edges and other elements, aspect ratio lock toggle, and pixel-precise positioning inputs
- FR7: Export functionality shall support PNG and JPG formats with quality settings (1x, 2x, 3x resolution), transparent background option for PNG, and direct download to user's device
- FR8: The system shall maintain undo/redo history for at least 50 actions during a session
- FR9: Preset management shall allow users to save and apply custom frame/background combinations
- FR10: The editor shall auto-save work to browser storage every 30 seconds to prevent data loss
- FR11: API routes shall provide endpoints for future AI features including background removal, smart cropping, and design suggestions

### Non Functional

- NFR1: The application shall load completely within 1 second on standard broadband connection (10Mbps+) via SSG optimization
- NFR2: Canvas interactions shall maintain 60fps performance for smooth user experience
- NFR3: The tool shall support Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+ browsers
- NFR4: All UI elements shall meet WCAG AA accessibility standards for contrast and keyboard navigation
- NFR5: The system shall process and render images up to 4K resolution (3840x2160) without crashes
- NFR6: Export quality shall maintain original image clarity with no visible compression artifacts at highest quality setting
- NFR7: The application shall function fully offline after initial SSG load, using browser-based processing
- NFR8: Memory usage shall not exceed 500MB for typical editing sessions with 5 images
- NFR9: The UI shall be responsive and functional on screens from 1024px width and above
- NFR10: All user actions shall provide visual or textual feedback within 200ms
- NFR11: SSG builds shall complete within 30 seconds for rapid deployment iterations

## User Interface Design Goals

### Overall UX Vision

The interface embodies "professional simplicity" - a clean, uncluttered workspace that reveals complexity only when needed. Users should feel immediate confidence through familiar patterns (drag-drop, click-to-select) while discovering powerful features naturally through exploration. The design prioritizes the canvas as the hero element with tools appearing contextually.

### Key Interaction Paradigms

- **Direct Manipulation**: All elements respond to direct drag, resize, and rotation without mode switching
- **Immediate Preview**: Every action shows real-time results without apply/cancel workflows
- **Progressive Disclosure**: Basic tools visible by default, advanced options revealed on demand
- **Contextual Controls**: Properties panel updates based on selected element (frame, text, background)
- **Smart Defaults**: Pre-selected options that produce good results without adjustment

### Core Screens and Views

- **Main Editor Canvas**: Central workspace with zoom controls and rulers
- **Frame Selector Panel**: Visual grid of frame options with search and filter
- **Background Studio**: Gradient builder and color selection interface
- **Text Properties Panel**: Typography controls appearing when text is selected
- **Export Modal**: Quality settings, format selection, and download options
- **Welcome Screen**: Quick tutorial and template selection for first-time users
- **Preset Manager**: Save and organize custom styles and combinations

### Accessibility: WCAG AA

All interactive elements meet WCAG AA standards with proper contrast ratios, keyboard navigation support, screen reader compatibility, and focus indicators. Alternative input methods provided for all mouse-based interactions.

### Branding

Clean, modern aesthetic with subtle gradients and soft shadows. Primary palette uses blues and purples to convey professionalism and creativity. Typography combines sans-serif for UI (Inter or similar) with diverse options for user text. Smooth micro-animations enhance perceived performance without distraction.

### Target Device and Platforms: Web Responsive

Primary focus on desktop browsers (1920x1080 and above) with responsive scaling down to 1024px width. Tablet support for viewing and basic editing. Mobile devices show read-only preview with export capabilities. Future consideration for dedicated tablet experience.

## Technical Assumptions

### Repository Structure: Monorepo

Single repository containing web application with potential for future mobile apps and backend services. Organized with app/ directory for Next.js app router structure and shared components for future service modules.

### Service Architecture

Next.js Static Site Generation (SSG) with API routes for future AI features. All image processing happens in browser using Canvas API and Web Workers for optimal performance. SSG provides sub-1s load times via CDN. API routes enable seamless integration of AI services (background removal, smart cropping) and user features in Phase 2.

### Testing Requirements

- Unit tests for all utility functions and canvas manipulation logic (target 80% coverage)
- Integration tests for critical user workflows (upload → edit → export)
- Visual regression tests for frame rendering consistency
- Performance benchmarks for canvas operations
- Manual testing checklist for browser compatibility
- Accessibility testing with screen readers and keyboard navigation
- API route testing for future AI integration endpoints

### Additional Technical Assumptions and Requests

- **Frontend Framework**: Next.js 15 with TypeScript for SSG performance, AI integration readiness, and better developer experience
- **UI Framework**: Next.js 15 with automatic compiler optimizations for canvas operations
- **Styling Solution**: Tailwind CSS for rapid UI development with custom design tokens
- **Canvas Library**: Fabric.js for robust canvas manipulation with fallback to native Canvas API
- **State Management**: Zustand for lightweight app state with persistence to localStorage
- **Build Tool**: Next.js 15 with Turbopack for lightning-fast development and optimized SSG builds
- **Image Processing**: Browser-native APIs with WebAssembly modules for performance-critical operations
- **Development Tools**: ESLint, Prettier, and Husky for code quality enforcement
- **Deployment**: Vercel deployment with SSG optimization and automatic preview deployments, API routes ready for AI services
- **Analytics**: Privacy-focused analytics (Plausible or Umami) for usage insights
- **Error Tracking**: Sentry integration for production error monitoring
- **AI Integration**: API routes structured for OpenAI, Anthropic, and other AI service integration

## Epic List

- **Epic 1: Foundation & Core Upload System** - Establish Next.js 15 project infrastructure, implement file upload system, and display images on canvas with basic zoom/pan controls
- **Epic 2: Frame System & Application** - Build complete frame library with browser/device mockups, implement frame application logic, and enable frame customization
- **Epic 3: Background & Canvas Styling** - Create gradient builder, implement background presets, and add canvas enhancement options
- **Epic 4: Text Overlays & Annotations** - Develop text tool with full typography controls, positioning system, and multi-layer support
- **Epic 5: Export & Quality Settings** - Build export pipeline with format options, quality controls, and batch processing preparation
- **Epic 6: AI Integration Foundation** - Establish API routes and infrastructure for future AI features

## Epic 1: Foundation & Core Upload System

**Goal**: Establish the Next.js 15 technical foundation and core infrastructure while delivering immediate value through a functional image upload and display system. Users will be able to upload screenshots and view them on an interactive canvas, providing the essential groundwork for all enhancement features.

### Story 1.1: Project Setup & Infrastructure

As a developer,
I want to establish the project foundation with proper tooling and structure,
so that the codebase is maintainable and development is efficient.

**Acceptance Criteria:**

1. Next.js 15 project initialized with TypeScript and App Router configuration
2. Tailwind CSS integrated with custom design tokens for colors and spacing
3. ESLint and Prettier configured with Next.js 15 best practices
4. Git repository initialized with proper .gitignore and branching strategy
5. Basic folder structure created (app/, components/, hooks/, utils/, types/, lib/)
6. Development and build scripts functional with Turbopack hot-reload working
7. Basic health check page displays "Scroma - Screenshot Mockup Tool"
8. next.config.js configured for SSG export and Fabric.js compatibility

### Story 1.2: File Upload Interface

As a user,
I want to upload screenshot images through multiple methods,
so that I can quickly get my images into the editor.

**Acceptance Criteria:**

1. Drag-and-drop zone clearly visible on main page with hover states
2. Click-to-browse file selection supports PNG, JPG, and WebP formats
3. Paste from clipboard (Ctrl/Cmd+V) functionality works anywhere on page
4. File size validation prevents uploads over 10MB with user-friendly error message
5. Upload progress indicator shows for files over 1MB
6. Multiple file selection queues images for sequential editing
7. Supported format instructions clearly displayed in upload area

### Story 1.3: Canvas Display System

As a user,
I want to see my uploaded image on an interactive canvas,
so that I can view and prepare it for enhancement.

**Acceptance Criteria:**

1. Uploaded image displays centered on canvas with appropriate initial zoom
2. Canvas dimensions adjust to viewport while maintaining aspect ratio
3. Zoom controls (+/-, slider, fit-to-screen) functional with 10-500% range
4. Pan functionality via drag when zoomed in beyond viewport
5. Image metadata (dimensions, file size) displayed in status bar
6. Canvas has subtle background pattern to indicate transparent areas
7. Reset view button returns to initial centered state

### Story 1.4: State Management Foundation

As a developer,
I want a robust state management system,
so that user actions are tracked and the app remains responsive.

**Acceptance Criteria:**

1. Zustand store configured with TypeScript interfaces for type safety
2. Image data, canvas state, and zoom level persisted in store
3. Undo/redo system initialized with action history tracking
4. LocalStorage persistence saves current session on change
5. State updates trigger appropriate component re-renders
6. Performance monitoring shows no unnecessary re-renders
7. Clear state action available for starting fresh

## Epic 2: Frame System & Application

**Goal**: Deliver the core frame functionality that transforms plain screenshots into professional mockups. Users will be able to select from various device and browser frames, apply them to their images, and customize frame properties for their specific needs.

### Story 2.1: Frame Library Component

As a user,
I want to browse and select from available frames,
so that I can choose the perfect frame for my screenshot.

**Acceptance Criteria:**

1. Frame selector panel displays grid of frame thumbnails with labels
2. Minimum 10 frames available (Chrome, Safari, generic browser, iPhone, Android, tablet, window, custom borders)
3. Frame preview on hover shows larger view with example
4. Search/filter functionality allows finding frames by type or name
5. Selected frame highlighted with clear visual indicator
6. Frame categories (Browser, Mobile, Desktop, Custom) for organization
7. Smooth animation when opening/closing frame selector panel

### Story 2.2: Frame Application Logic

As a user,
I want to apply frames to my screenshot with proper scaling,
so that my image fits perfectly within the chosen frame.

**Acceptance Criteria:**

1. Selected frame applies immediately to canvas with real-time preview
2. Image automatically scales to fit within frame boundaries
3. Aspect ratio preserved with letterboxing/pillarboxing if needed
4. Frame renders at correct resolution relative to image
5. Multi-layer rendering keeps frame above image but below text overlays
6. Frame change maintains image position and zoom level
7. Remove frame option returns to plain image view

### Story 2.3: Frame Customization Controls

As a user,
I want to customize frame properties,
so that I can match my brand or design preferences.

**Acceptance Criteria:**

1. Color customization available for applicable frames (borders, browser chrome)
2. Frame opacity adjustment with slider (50-100% range)
3. Shadow toggle adds/removes drop shadow from frame
4. Padding adjustment controls space between image and frame (0-100px)
5. Corner radius adjustment for custom border frames (0-50px)
6. Settings persist when switching between similar frame types
7. Reset button returns frame to default settings

### Story 2.4: Frame Rendering Optimization

As a developer,
I want optimized frame rendering performance,
so that users experience smooth interactions even with complex frames.

**Acceptance Criteria:**

1. Frames load asynchronously without blocking UI interaction
2. Frame assets cached after first load for instant switching
3. SVG frames scale without quality loss at any zoom level
4. Rendering uses requestAnimationFrame for smooth updates
5. Memory-efficient frame swapping without leaks
6. Performance maintains 60fps during frame changes
7. Fallback to simple frames if performance degrades

## Epic 3: Background & Canvas Styling

**Goal**: Provide sophisticated background options that elevate the visual appeal of mockups. Users will create stunning gradient backgrounds, apply preset styles, and enhance the overall canvas presentation to achieve professional results.

### Story 3.1: Gradient Builder Interface

As a user,
I want to create custom gradient backgrounds,
so that I can design unique and appealing mockup presentations.

**Acceptance Criteria:**

1. Gradient editor with visual preview updates in real-time
2. Support for 2-5 color stops with add/remove functionality
3. Color picker for each stop with hex input option
4. Gradient angle adjustment via slider (0-360°) or direct input
5. Linear and radial gradient type toggle
6. Gradient preview shows on both thumbnail and main canvas
7. Copy gradient code feature for reuse in other tools

### Story 3.2: Background Preset Library

As a user,
I want to choose from preset backgrounds,
so that I can quickly apply professional-looking styles.

**Acceptance Criteria:**

1. Minimum 20 preset gradients covering popular styles
2. Preset categories (Subtle, Vibrant, Dark, Light, Brand Colors)
3. One-click application with instant canvas update
4. Preset thumbnails show accurate preview of gradient
5. Favorite system allows marking frequently used presets
6. Recently used section shows last 5 applied backgrounds
7. Search functionality finds presets by name or color

### Story 3.3: Solid Colors & Patterns

As a user,
I want solid color and pattern options,
so that I have alternatives to gradient backgrounds.

**Acceptance Criteria:**

1. Solid color picker with common color swatches
2. Hex, RGB, and HSL input methods supported
3. Basic patterns available (dots, lines, grid) with color customization
4. Pattern density/size adjustment controls
5. Transparency option for no background (checkerboard preview)
6. Background blur option for subtle depth effect
7. Quick access to white, black, and transparent backgrounds

### Story 3.4: Canvas Enhancement Options

As a user,
I want additional canvas styling options,
so that my mockups have professional finishing touches.

**Acceptance Criteria:**

1. Canvas padding adjustment changes space around frame (0-200px)
2. Rounded corners option for entire composition (0-50px)
3. Shadow settings for lifted/floating appearance
4. Reflection effect toggle with intensity control
5. Vignette option with customizable intensity
6. Canvas size presets for common social media dimensions
7. Background position adjustment for gradient centering

## Epic 4: Text Overlays & Annotations

**Goal**: Enable users to add informative and stylistic text elements to their mockups. This includes titles, descriptions, annotations, and watermarks with full typography control and positioning flexibility.

### Story 4.1: Text Tool Foundation

As a user,
I want to add text layers to my mockup,
so that I can include titles, descriptions, and annotations.

**Acceptance Criteria:**

1. Add text button creates new text layer with default content
2. Click on canvas places text at that location
3. Text editing mode activates on double-click or selection
4. Support for multiple independent text layers
5. Text bounding box shows during selection with resize handles
6. Escape key or clicking outside exits text editing mode
7. Delete key removes selected text layer with confirmation

### Story 4.2: Typography Controls

As a user,
I want complete control over text appearance,
so that I can match my design requirements.

**Acceptance Criteria:**

1. Font selection from minimum 10 web fonts (sans-serif and serif options)
2. Size adjustment via slider (8px-200px) or direct input
3. Color picker with opacity control for text
4. Bold, italic, underline formatting toggles
5. Text alignment options (left, center, right, justify)
6. Line height and letter spacing adjustments
7. Text shadow option with offset and blur controls

### Story 4.3: Text Positioning & Layering

As a user,
I want precise control over text placement,
so that I can position text exactly where needed.

**Acceptance Criteria:**

1. Drag to move text anywhere on canvas
2. Smart guides show alignment with other elements
3. Keyboard arrow keys allow pixel-precise positioning
4. Layer order controls (bring forward, send back, etc.)
5. Rotation handle allows text angle adjustment
6. Snap-to-grid option for consistent alignment
7. Position coordinates display with manual input option

### Story 4.4: Text Presets & Templates

As a user,
I want text style presets and templates,
so that I can quickly apply consistent text styling.

**Acceptance Criteria:**

1. Save current text style as reusable preset
2. Pre-built presets for common uses (title, subtitle, watermark, caption)
3. Apply preset to existing or new text layers
4. Text templates include positioned multi-layer text groups
5. Custom preset management with naming and deletion
6. Import/export presets for team sharing (JSON format)
7. Preview shows preset style before application

## Epic 5: Export & Quality Settings

**Goal**: Deliver high-quality export functionality that preserves mockup quality while providing flexibility in format and resolution. Users will have full control over output settings to match their specific use cases.

### Story 5.1: Export Modal & Basic Options

As a user,
I want to export my completed mockup with format options,
so that I can use it in my intended application.

**Acceptance Criteria:**

1. Export button opens modal with preview of final output
2. Format selection between PNG and JPG with clear descriptions
3. Filename input with automatic suggestion based on upload name
4. Export button triggers download to default download folder
5. Export completion shows success message with file size
6. Cancel option closes modal without exporting
7. Keyboard shortcut (Ctrl/Cmd+E) opens export modal

### Story 5.2: Quality & Resolution Controls

As a user,
I want to control export quality and resolution,
so that I can balance file size with image quality.

**Acceptance Criteria:**

1. Resolution multiplier options (1x, 2x, 3x) with pixel dimension display
2. Quality slider for JPG (60-100%) with file size estimate
3. PNG options include transparency preservation toggle
4. Actual dimensions shown in pixels (e.g., "1920x1080")
5. File size estimate updates as settings change
6. Maximum dimension validation prevents crashes (8K limit)
7. Preset buttons for common uses (Web, Print, Social Media)

### Story 5.3: Advanced Export Features

As a user,
I want advanced export options,
so that I can optimize output for specific platforms.

**Acceptance Criteria:**

1. Crop to content option removes excess transparent/background area
2. Social media size presets (Instagram, Twitter, LinkedIn, etc.)
3. Watermark toggle adds customizable text/logo
4. Metadata preservation option for JPG files
5. Color profile selection (sRGB, Display P3)
6. Export progress bar for large files
7. Copy to clipboard option for quick sharing

### Story 5.4: Batch Export Preparation

As a developer,
I want to establish batch export infrastructure,
so that future batch processing features can be added easily.

**Acceptance Criteria:**

1. Export settings object structured for reuse across multiple images
2. Export queue system handles multiple files sequentially
3. Template system saves export configurations
4. Export history tracks recent exports with settings
5. API structure supports future backend processing
6. Performance optimized for multiple large exports
7. Memory cleanup after each export prevents leaks

## Epic 6: AI Integration Foundation

**Goal**: Establish the technical infrastructure for future AI features through Next.js API routes and service integration patterns. This foundation enables seamless addition of AI-powered background removal, smart cropping, and design suggestions.

### Story 6.1: API Routes Infrastructure

As a developer,
I want to establish API routes for AI services,
so that future AI features can be integrated seamlessly.

**Acceptance Criteria:**

1. API route structure created in app/api/ directory
2. Authentication middleware ready for AI service API keys
3. Rate limiting implemented for AI service calls
4. Error handling patterns established for external service failures
5. Request/response validation with TypeScript schemas
6. Logging and monitoring hooks for API route usage
7. Cost tracking mechanisms for AI service usage

### Story 6.2: AI Service Integration Patterns

As a developer,
I want standardized patterns for AI service integration,
so that multiple AI providers can be supported efficiently.

**Acceptance Criteria:**

1. Abstract AI service interface for multiple providers
2. Configuration system for AI service API keys and endpoints
3. Retry logic and fallback mechanisms for service failures
4. Image preprocessing pipeline for AI service requirements
5. Response caching strategy for similar requests
6. Usage analytics and cost monitoring
7. Provider-specific adapters for OpenAI, Anthropic, etc.

## Checklist Results Report

### Product Requirements Completeness

✅ Goals clearly defined with measurable success metrics
✅ Functional requirements cover all core features from brief with expansion for advanced capabilities
✅ Non-functional requirements address performance and compatibility for Next.js SSG
✅ UI/UX goals align with target user needs
✅ Technical assumptions documented with Next.js 15 rationale
✅ Epic structure follows logical progression with AI foundation
✅ Stories sized appropriately for AI agent execution
✅ Acceptance criteria specific and testable

### Agile Best Practices Validation

✅ Epic 1 establishes Next.js foundation with immediate value delivery
✅ Each epic delivers deployable increment
✅ Stories follow user story format
✅ Vertical slices prioritized over technical layers
✅ Dependencies properly sequenced
✅ Cross-cutting concerns integrated throughout
✅ AI integration planned as foundation for future features

### Technical Feasibility Check

✅ Next.js SSG approach validated for performance requirements
✅ Tech stack components proven and compatible
✅ State management approach scales with features
✅ Export functionality achievable with Canvas API
✅ Frame rendering optimized for performance
✅ API routes ready for AI service integration

### Risk Mitigation Coverage

✅ Performance constraints addressed with SSG optimization stories
✅ Browser compatibility explicitly tested
✅ Progressive enhancement approach for advanced features
✅ Fallback options for degraded performance
✅ Error handling included in acceptance criteria
✅ AI service failures handled gracefully

## Next Steps

### UX Expert Prompt

"Please review the Scroma PRD and create detailed UX specifications for Next.js 15 architecture. Focus on the editor canvas layout, frame selector interface, and gradient builder components. Provide wireframes for the core screens identified in the PRD, ensuring the 'professional simplicity' vision is achieved with SSG performance in mind. Use docs/prd.md as your primary input."

### Architect Prompt

"Please create the technical architecture document for Scroma using the updated PRD at docs/prd.md. Design a scalable Next.js 15 application with Fabric.js canvas manipulation, focusing on SSG performance optimization and AI integration readiness. Include component hierarchy, state management patterns, and build configuration for the Next.js SSG architecture with API routes specified in the requirements."
