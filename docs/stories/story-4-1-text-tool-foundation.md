# Story 4.1: Text Tool Foundation

## Story Overview

**Epic:** Epic 4 - Text Overlays & Annotations
**Story ID:** 4.1
**Priority:** High
**Status:** Ready for Development
**Estimated Effort:** 8 Story Points
**Sprint Assignment:** Sprint 7
**Dependencies:** Epic 3 (Background system for visual context)

## User Story

**As a** user,
**I want to** add text layers to my mockup using Next.js 15 optimization,
**So that I can** include titles, descriptions, and annotations with smooth performance.

## Business Value

- Completes the core mockup creation workflow enabling comprehensive documentation and presentation
- Provides text annotation capabilities essential for developer and marketing use cases
- Establishes foundation for advanced typography features and team collaboration tools
- Differentiates Scroma from basic screenshot tools through professional text capabilities
- Leverages Next.js 15 font optimization for instant web font loading and smooth text rendering

## Acceptance Criteria

### Text Layer Creation

1. **Add Text Functionality**

   - "Add Text" button in main toolbar creates new text layer with default content ("Your text here")
   - Click anywhere on canvas places new text layer at clicked location
   - Text layers appear with reasonable default styling (readable font, appropriate size)
   - Multiple independent text layers supported with unique identifiers
   - Text creation optimized for Next.js client-side performance

2. **Text Layer Management**

   - Each text layer displays with visible bounding box when selected
   - Text bounding box includes resize handles for visual size adjustment
   - Text layers can be selected by clicking directly on text content
   - Only one text layer selected at a time with clear visual indication
   - Text layer management optimized for Next.js client-side rendering

3. **Text Editing Mode**
   - Double-click on text layer activates inline editing mode
   - Single click on selected text layer also activates editing mode
   - Text cursor appears for character-level editing within text content
   - Editing mode shows text formatting toolbar contextually
   - Text editing uses Next.js client optimization for smooth interactions

### Text Interaction Controls

4. **Text Selection System**

   - Click outside text area or press Escape key exits editing mode
   - Tab key cycles through text layers for keyboard navigation
   - Selected text layer highlighted with distinctive visual styling
   - Multiple text layers managed efficiently without performance impact
   - Selection system optimized for Next.js client-side processing

5. **Text Deletion**

   - Delete key removes selected text layer with undo capability
   - Confirmation dialog prevents accidental text deletion
   - Deleted text layers removed from canvas and state management
   - Text deletion integrates with Next.js state management patterns

6. **Keyboard Shortcuts**
   - Ctrl/Cmd+T creates new text layer at canvas center
   - Enter key activates editing mode for selected text layer
   - Escape key exits editing mode and deselects text layers
   - Standard text editing shortcuts (Ctrl/Cmd+A, Ctrl/Cmd+C, etc.) work within editing mode
   - Keyboard shortcuts optimized for Next.js client-side handling

## Technical Implementation

### Next.js 15 Component Architecture

```
components/text-tools/
├── text-editor.tsx             # Main text editing interface with Next.js optimization
├── text-layer.tsx              # Individual text layer component
├── text-toolbar.tsx            # Text formatting controls
├── text-selector.tsx           # Text selection management
├── text-creator.tsx            # New text layer creation
└── text-bounding-box.tsx       # Text selection and resize handles

lib/text/
├── text-manager.ts             # Text layer state management optimized for Next.js
├── text-editor-service.ts      # Text editing operations
├── text-selection-service.ts   # Text selection logic
└── text-utils.ts               # Text utility functions
```

### Next.js 15 Text State Management (Zustand)

```typescript
"use client";

interface TextState {
  // Text layers
  textLayers: TextLayer[];
  selectedLayerId: string | null;
  editingLayerId: string | null;

  // Text creation
  isCreatingText: boolean;
  defaultTextStyle: TextStyle;

  // Editing state
  isEditing: boolean;
  editingContent: string;
  cursorPosition: number;

  // Next.js optimization
  textRenderCache: Map<string, HTMLElement>;
  fontLoadingStatus: Map<string, "loading" | "loaded" | "error">;
}

interface TextLayer {
  id: string;
  content: string;
  position: { x: number; y: number };
  style: TextStyle;
  boundingBox: BoundingBox;
  isSelected: boolean;
  isEditing: boolean;
  zIndex: number;
}

interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  textAlign: "left" | "center" | "right";
  lineHeight: number;
}

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}
```

### Next.js 15 Text Layer Component

```typescript
"use client";

import { useState, useRef, useEffect } from "react";
import { useTextStore } from "@/stores/text-store";
import { cn } from "@/lib/utils";

export function TextLayer({ layerId }: { layerId: string }) {
  const textRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    textLayers,
    selectedLayerId,
    editingLayerId,
    updateTextContent,
    selectTextLayer,
    startEditing,
    stopEditing,
  } = useTextStore();

  const textLayer = textLayers.find((layer) => layer.id === layerId);
  if (!textLayer) return null;

  const isSelected = selectedLayerId === layerId;
  const isEditingMode = editingLayerId === layerId;

  const handleClick = () => {
    selectTextLayer(layerId);
  };

  const handleDoubleClick = () => {
    startEditing(layerId);
    setIsEditing(true);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    updateTextContent(layerId, e.target.textContent || "");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      stopEditing();
      setIsEditing(false);
    }
  };

  return (
    <div
      className={cn(
        "absolute cursor-pointer",
        isSelected && "ring-2 ring-blue-500 ring-offset-2"
      )}
      style={{
        left: textLayer.position.x,
        top: textLayer.position.y,
        zIndex: textLayer.zIndex,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div
        ref={textRef}
        contentEditable={isEditingMode}
        suppressContentEditableWarning
        className={cn("outline-none", isEditingMode && "ring-1 ring-blue-300")}
        style={{
          fontFamily: textLayer.style.fontFamily,
          fontSize: `${textLayer.style.fontSize}px`,
          fontWeight: textLayer.style.fontWeight,
          color: textLayer.style.color,
          textAlign: textLayer.style.textAlign,
          lineHeight: textLayer.style.lineHeight,
          minWidth: "20px",
          minHeight: "20px",
        }}
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
      >
        {textLayer.content}
      </div>

      {isSelected && !isEditingMode && <TextBoundingBox layerId={layerId} />}
    </div>
  );
}
```

### Text Creation Service (Next.js Optimized)

```typescript
"use client";

export class TextCreationService {
  static createTextLayer(position: { x: number; y: number }): TextLayer {
    return {
      id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: "Your text here",
      position,
      style: {
        fontFamily: "Inter",
        fontSize: 24,
        fontWeight: 400,
        color: "#000000",
        textAlign: "left",
        lineHeight: 1.4,
      },
      boundingBox: {
        x: position.x,
        y: position.y,
        width: 150,
        height: 32,
      },
      isSelected: false,
      isEditing: false,
      zIndex: 100,
    };
  }

  static getDefaultTextStyle(): TextStyle {
    return {
      fontFamily: "Inter",
      fontSize: 24,
      fontWeight: 400,
      color: "#000000",
      textAlign: "left",
      lineHeight: 1.4,
    };
  }
}
```

### Next.js 15 Text Toolbar Component

```typescript
"use client";

import { Bold, Italic, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTextStore } from "@/stores/text-store";

export function TextToolbar() {
  const { selectedLayerId, addTextLayer } = useTextStore();

  const handleAddText = () => {
    // Add text at canvas center
    const canvasCenter = { x: 400, y: 300 };
    addTextLayer(canvasCenter);
  };

  return (
    <div className="text-toolbar flex items-center gap-2 p-2 bg-white rounded-lg shadow">
      <Button
        variant="outline"
        size="sm"
        onClick={handleAddText}
        className="flex items-center gap-1"
      >
        <Type className="w-4 h-4" />
        Add Text
      </Button>

      {selectedLayerId && (
        <>
          <div className="w-px h-6 bg-gray-300" />
          <Button variant="outline" size="sm">
            <Bold className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Italic className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  );
}
```

## Definition of Done

### Functional Requirements

- [ ] Text layers can be created via button click or canvas click
- [ ] Text editing mode activates on double-click with inline editing
- [ ] Text selection system works intuitively with visual feedback
- [ ] Multiple text layers supported with proper state management
- [ ] Text deletion works with confirmation and undo capability
- [ ] Next.js client optimization ensures smooth text interactions

### Performance Requirements

- [ ] Text layer creation completes within 100ms using Next.js optimization
- [ ] Text editing mode activates instantly without lag
- [ ] Multiple text layers (10+) render smoothly at 60fps
- [ ] Text selection and manipulation responsive on all devices
- [ ] Font loading optimized via Next.js font system

### User Experience Requirements

- [ ] Text tool discoverable and easy to use for first-time users
- [ ] Text editing feels natural with standard keyboard shortcuts
- [ ] Visual feedback clear for all text layer states (selected, editing, normal)
- [ ] Text layers integrate seamlessly with existing canvas interactions
- [ ] Next.js client optimization provides smooth interactions

### Accessibility Requirements

- [ ] Text editing accessible via keyboard navigation
- [ ] Screen readers announce text layer creation and selection
- [ ] High contrast mode support for text layer boundaries
- [ ] Text content accessible to assistive technologies

## Testing Strategy

### Unit Tests

- Text layer creation and state management
- Text editing functionality and content updates
- Text selection logic and visual feedback
- Keyboard shortcut handling and text navigation
- Next.js client component functionality

### Integration Tests

- Text layer integration with canvas system
- Text tool integration with toolbar and UI components
- Text state persistence and undo/redo functionality
- Performance testing with multiple text layers
- Next.js optimization performance validation

### User Acceptance Tests

- First-time users can create and edit text within 30 seconds
- Power users can efficiently manage multiple text layers
- Text editing workflow feels natural and responsive
- Mobile users can effectively create and edit text via touch

## Success Metrics

### Feature Adoption

- **Target:** 80% of users who create mockups add at least one text layer
- **Measurement:** Analytics tracking text tool usage and layer creation

### User Experience (Next.js 15 Optimized)

- **Target:** Text editing mode activates within 50ms of double-click
- **Measurement:** Performance monitoring of text interaction responsiveness
- **Next.js Target:** Text components load instantly via client optimization

### Text Usage Patterns

- **Target:** Average of 2.5 text layers per mockup
- **Measurement:** Text layer analytics and usage statistics

## Risk Assessment

### Primary Risk: Text Editing Performance Impact

**Mitigation:**

- Efficient text rendering with Next.js client optimization
- Debounced text updates to prevent excessive re-renders
- Virtualization for large numbers of text layers
- Performance monitoring with automatic optimization

### Secondary Risk: Text Input Compatibility Issues

**Mitigation:**

- Cross-browser testing for contentEditable behavior
- Fallback text input methods for problematic browsers
- Progressive enhancement for advanced text features
- Next.js client-side optimization handles browser differences

### Rollback Plan

- Feature flags for text tool functionality
- Graceful degradation to basic text display if editing fails
- Alternative text input modal if inline editing fails
- Next.js static regeneration for text component updates

---

**Story Owner:** Development Team
**Technical Lead:** Frontend Developer
**Timeline:** Sprint 7 - Week 1
**Dependencies:** Next.js 15 project setup, Background system (Epic 3)
**Next.js 15 Migration:** Complete client-side optimization for text layer functionality
