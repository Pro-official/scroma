# Project Structure

```
scroma/
├── public/
│   ├── frames/                    # Static frame assets (SVG, PNG)
│   ├── backgrounds/               # Background preset images
│   └── favicon.ico
├── app/                           # Next.js App Router structure
│   ├── api/                       # API routes for AI integration
│   │   ├── ai/
│   │   │   ├── remove-background/
│   │   │   │   └── route.ts
│   │   │   ├── smart-crop/
│   │   │   │   └── route.ts
│   │   │   └── enhance/
│   │   │       └── route.ts
│   │   └── health/
│   │       └── route.ts
│   ├── globals.css                # Global styles & Tailwind imports
│   ├── layout.tsx                 # Root layout component
│   ├── page.tsx                   # Main editor page
│   ├── loading.tsx                # Loading UI
│   └── error.tsx                  # Error UI
├── components/
│   ├── ui/                        # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── slider.tsx
│   │   └── index.ts
│   ├── canvas/                    # Canvas-specific components
│   │   ├── canvas-toolbar.tsx
│   │   ├── canvas-viewport.tsx
│   │   ├── zoom-controls.tsx
│   │   └── element-handlers/
│   │       ├── frame-handler.tsx
│   │       ├── text-handler.tsx
│   │       └── background-handler.tsx
│   ├── panels/                    # Tool panels and dialogs
│   │   ├── frame-library/
│   │   │   ├── frame-grid.tsx
│   │   │   ├── frame-preview.tsx
│   │   │   └── frame-properties.tsx
│   │   ├── background-studio/
│   │   │   ├── gradient-builder.tsx
│   │   │   ├── preset-library.tsx
│   │   │   └── color-picker.tsx
│   │   ├── text-tools/
│   │   │   ├── typography-controls.tsx
│   │   │   ├── text-positioning.tsx
│   │   │   └── text-presets.tsx
│   │   └── export-modal/
│   │       ├── format-selector.tsx
│   │       ├── quality-controls.tsx
│   │       └── download-manager.tsx
│   ├── layout/
│   │   ├── app-shell.tsx
│   │   ├── header.tsx
│   │   └── floating-toolbar.tsx
│   └── upload/
│       ├── upload-zone.tsx
│       ├── file-processor.tsx
│       └── drag-drop-handler.tsx
├── hooks/                         # Custom React hooks
│   ├── use-canvas-state.ts
│   ├── use-file-upload.ts
│   ├── use-keyboard-shortcuts.ts
│   ├── use-undo-redo.ts
│   ├── use-export.ts
│   └── use-ai-services.ts         # AI integration hooks
├── stores/                        # Zustand state management
│   ├── canvas-store.ts
│   ├── frame-store.ts
│   ├── background-store.ts
│   ├── text-store.ts
│   ├── ai-store.ts                # AI services state
│   └── app-store.ts
├── lib/                           # Utility libraries
│   ├── canvas/
│   │   ├── canvas-renderer.ts
│   │   ├── frame-applier.ts
│   │   ├── text-renderer.ts
│   │   └── export-engine.ts
│   ├── ai/                        # AI service integrations
│   │   ├── openai-client.ts
│   │   ├── anthropic-client.ts
│   │   └── ai-utils.ts
│   ├── utils/
│   │   ├── file-utils.ts
│   │   ├── image-utils.ts
│   │   ├── color-utils.ts
│   │   └── validation.ts
│   ├── constants/
│   │   ├── frames.ts
│   │   ├── backgrounds.ts
│   │   └── export-formats.ts
│   └── shadcn-utils.ts            # shadcn/ui utilities
├── types/                         # TypeScript definitions
│   ├── canvas.ts
│   ├── frame.ts
│   ├── background.ts
│   ├── text.ts
│   ├── ai.ts                      # AI service types
│   └── export.ts
├── tests/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── api/                       # API route tests
│   └── setup.ts
├── docs/
│   ├── ui-architecture.md         # This document
│   ├── prd.md
│   └── front-end-spec.md
├── .bmad-core/                    # BMAD framework files
├── components.json                # shadcn/ui configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── next.config.js                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── eslint.config.js               # ESLint flat config
├── prettier.config.js             # Prettier configuration
├── vitest.config.ts               # Vitest configuration (for components)
└── package.json
```

**Key Structure Decisions:**

**Next.js App Router Organization:** Uses Next.js 15 App Router structure with `app/` directory for routing, layouts, and API routes, providing better SSG performance and AI integration capabilities.

**API Routes for AI Integration:** Dedicated `/api/ai/` routes for background removal, smart cropping, and image enhancement, ready for OpenAI, Anthropic, and other AI service integrations.

**Canvas-Centric Organization:** Components are organized around canvas functionality rather than technical layers, making it easier for developers to locate canvas-specific code.

**Panel Modularity:** Each tool panel (frames, backgrounds, text, export) has its own directory with sub-components, allowing for independent development and testing.

**Zustand Store Separation:** State is split by domain (canvas, frames, backgrounds, text, AI, app) rather than one monolithic store, improving performance and maintainability.

**lib/ Directory:** Separates pure business logic from React components, with dedicated AI service integrations, making testing easier and code more reusable.

**Next.js 15 Optimizations:** Structure supports SSG with automatic code splitting, image optimization via next/image, and Turbopack's fast build times.

**shadcn/ui Integration:** UI components are separated from business components, making it easy to update the design system independently while maintaining Next.js compatibility.

**AI-Ready Architecture:** Dedicated AI service utilities, types, and state management prepare the application for seamless AI feature integration.
