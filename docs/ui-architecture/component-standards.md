# Component Standards

### Next.js 15 Server Component Template

```typescript
// components/templates/template-card.tsx - Server Component
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    description?: string;
    thumbnailUrl: string;
    category: string;
    isPremium: boolean;
  };
  className?: string;
  priority?: boolean; // For LCP optimization
}

// Server Component - renders on server by default
export async function TemplateCard({
  template,
  className,
  priority = false,
}: TemplateCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={template.thumbnailUrl}
          alt={template.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {template.isPremium && (
          <Badge className="absolute top-2 right-2" variant="secondary">
            Premium
          </Badge>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">
          {template.name}
        </h3>

        {template.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {template.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {template.category}
          </Badge>

          <Button asChild size="sm">
            <Link href={`/editor?template=${template.id}`}>Use Template</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### Next.js 15 Client Component Template

```typescript
"use client";

import { forwardRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCanvasStore } from "@/stores/canvas-store";

// Define component props interface
interface CanvasToolbarProps {
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "compact" | "floating";
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  onToolChange?: (tool: string) => void;
  // Server Actions
  saveAction?: (
    formData: FormData
  ) => Promise<{ success?: boolean; error?: string }>;
  exportAction?: (
    formData: FormData
  ) => Promise<{ success?: boolean; error?: string }>;
}

// Define component state interface
interface ToolbarState {
  isActive: boolean;
  loading: boolean;
  selectedTool: string;
}

// Next.js 15 Client Component with React Compiler optimization
const CanvasToolbar = forwardRef<HTMLDivElement, CanvasToolbarProps>(
  (
    {
      className,
      children,
      variant = "default",
      canvasRef,
      onToolChange,
      saveAction,
      exportAction,
      ...props
    },
    ref
  ) => {
    const router = useRouter();

    // Zustand state with selective subscriptions
    const selectedTool = useCanvasStore((state) => state.ui.tool);
    const setTool = useCanvasStore((state) => state.setTool);
    const zoom = useCanvasStore((state) => state.canvas.zoom);
    const setZoom = useCanvasStore((state) => state.setZoom);

    // Local component state - React Compiler handles optimization
    const [state, setState] = useState<ToolbarState>({
      isActive: false,
      loading: false,
      selectedTool: "select",
    });

    // Event handlers - no manual useCallback needed with React Compiler
    const handleToolSelect = (tool: string) => {
      setTool(tool);
      onToolChange?.(tool);
      setState((prev) => ({ ...prev, selectedTool: tool }));
    };

    const handleZoomIn = () => {
      const newZoom = Math.min(zoom * 1.2, 5.0);
      setZoom(newZoom);

      // Canvas interaction with modern patterns
      if (canvasRef?.current) {
        requestAnimationFrame(() => {
          // Smooth zoom animation logic here
        });
      }
    };

    const handleZoomOut = () => {
      const newZoom = Math.max(zoom / 1.2, 0.1);
      setZoom(newZoom);
    };

    // Navigation with Next.js router
    const handleTemplatesClick = () => {
      router.push("/templates");
    };

    const handleSettingsClick = () => {
      router.push("/settings");
    };

    // Computed classes using Tailwind CSS 4 patterns
    const toolbarClasses = cn(
      // Base styles with modern CSS features
      "flex items-center gap-2 p-2 bg-background border rounded-lg shadow-sm",
      "transition-all duration-[var(--animate-duration-normal)] ease-in-out",
      {
        "h-12": variant === "compact",
        "h-16": variant === "default",
        "fixed top-4 left-1/2 -translate-x-1/2 z-50": variant === "floating",
        "shadow-lg": variant === "floating",
      },
      className
    );

    const tools = [
      { id: "select", label: "Select", icon: "↖️", shortcut: "V" },
      { id: "frame", label: "Add Frame", icon: "🖼️", shortcut: "F" },
      { id: "text", label: "Add Text", icon: "📝", shortcut: "T" },
      { id: "background", label: "Background", icon: "🎨", shortcut: "B" },
    ];

    return (
      <div
        ref={ref}
        className={toolbarClasses}
        role="toolbar"
        aria-label="Canvas editing tools"
        {...props}
      >
        {/* Tool Selection */}
        <div className="flex items-center gap-1">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "default" : "ghost"}
              size="sm"
              onClick={() => handleToolSelect(tool.id)}
              aria-label={tool.label}
              title={`${tool.label} (${tool.shortcut})`}
              className="relative"
            >
              <span className="text-lg">{tool.icon}</span>
              {variant !== "compact" && (
                <span className="hidden sm:inline ml-1">{tool.label}</span>
              )}
            </Button>
          ))}
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            aria-label="Zoom out"
            disabled={zoom <= 0.1}
          >
            🔍-
          </Button>

          <span className="text-sm font-mono min-w-[4rem] text-center">
            {Math.round(zoom * 100)}%
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            aria-label="Zoom in"
            disabled={zoom >= 5.0}
          >
            🔍+
          </Button>
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTemplatesClick}
            aria-label="Browse templates"
          >
            📚
            {variant !== "compact" && (
              <span className="hidden sm:inline ml-1">Templates</span>
            )}
          </Button>

          {/* Server Action Form - Save */}
          {saveAction && (
            <form action={saveAction}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                disabled={state.loading}
              >
                💾
                {variant !== "compact" && (
                  <span className="hidden sm:inline ml-1">
                    {state.loading ? "Saving..." : "Save"}
                  </span>
                )}
              </Button>
            </form>
          )}

          {/* Server Action Form - Export */}
          {exportAction && (
            <form action={exportAction}>
              <input type="hidden" name="format" value="png" />
              <input type="hidden" name="quality" value="0.9" />
              <Button
                type="submit"
                variant="default"
                size="sm"
                disabled={state.loading}
              >
                📤
                {variant !== "compact" && (
                  <span className="hidden sm:inline ml-1">Export</span>
                )}
              </Button>
            </form>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSettingsClick}
            aria-label="Settings"
          >
            ⚙️
          </Button>
        </div>

        {children}
      </div>
    );
  }
);

CanvasToolbar.displayName = "CanvasToolbar";

export { CanvasToolbar, type CanvasToolbarProps };
```

### Next.js 15 with Server Actions Pattern

```typescript
"use client";

import { useActionState, useOptimistic, startTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface FileUploadProps {
  onFileProcessed?: (file: ProcessedFile) => void;
  className?: string;
  // Server Action
  uploadAction: (formData: FormData) => Promise<{
    success?: boolean;
    error?: string;
    file?: ProcessedFile;
  }>;
}

interface ProcessedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  pending?: boolean;
}

// Canvas file upload with Next.js 15 Server Actions
export function CanvasFileUpload({
  onFileProcessed,
  className,
  uploadAction,
}: FileUploadProps) {
  const router = useRouter();
  const [files, setFiles] = useState<ProcessedFile[]>([]);

  // Optimistic updates for immediate UI feedback
  const [optimisticFiles, addOptimisticFile] = useOptimistic(
    files,
    (state, newFile: ProcessedFile) => [...state, newFile]
  );

  // Server Action state
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      try {
        const result = await uploadAction(formData);

        if (result.success && result.file) {
          // Update actual file list
          setFiles((prev) => [...prev, result.file!]);
          onFileProcessed?.(result.file);

          // Show success toast
          toast.success("File uploaded successfully!");

          // Navigate to editor with new file
          router.push(`/editor?file=${result.file.id}`);
        }

        return result;
      } catch (error) {
        toast.error("Upload failed. Please try again.");
        return { error: "Upload failed" };
      }
    },
    null
  );

  const handleFileSelect = (file: File) => {
    // Optimistic update for immediate UI feedback
    const tempFile: ProcessedFile = {
      id: Date.now().toString(),
      name: file.name,
      url: "",
      size: file.size,
      pending: true,
    };

    startTransition(() => {
      addOptimisticFile(tempFile);
    });

    // Submit form with file
    const formData = new FormData();
    formData.append("file", file);
    formAction(formData);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* File Input */}
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center transition-colors hover:border-muted-foreground/50">
        <form action={formAction}>
          <Label htmlFor="file-upload" className="cursor-pointer block">
            <div className="space-y-2">
              <div className="text-4xl">📁</div>
              <div className="text-lg font-medium">Upload an image</div>
              <div className="text-sm text-muted-foreground">
                Drag & drop or click to select
              </div>
            </div>

            <Input
              id="file-upload"
              name="file"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
              disabled={isPending}
              className="sr-only"
            />
          </Label>
        </form>

        {isPending && (
          <div className="mt-4">
            <div className="animate-pulse text-sm text-muted-foreground">
              Uploading...
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {state?.error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
          <div className="text-destructive text-sm">{state.error}</div>
        </div>
      )}

      {/* File List with Optimistic Updates */}
      {optimisticFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploaded Files</h4>
          <div className="grid gap-2">
            {optimisticFiles.map((file) => (
              <div
                key={file.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-md border bg-card",
                  file.pending && "opacity-50 animate-pulse"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🖼️</div>
                  <div>
                    <div className="font-medium text-sm">{file.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {file.pending ? (
                    <span className="text-xs text-muted-foreground">
                      Processing...
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/editor?file=${file.id}`)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Next.js 15 Page Component Pattern

```typescript
// app/editor/page.tsx - Page component with metadata
import { Metadata } from "next";
import { Suspense } from "react";
import { EditorLayout } from "@/components/editor/editor-layout";
import { CanvasArea } from "@/components/canvas/canvas-area";
import { Sidebar } from "@/components/editor/sidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Static metadata
export const metadata: Metadata = {
  title: "Canvas Editor - Scroma",
  description: "Create beautiful screenshot mockups with our canvas editor",
  keywords: ["editor", "canvas", "mockup", "screenshot"],
  openGraph: {
    title: "Canvas Editor - Scroma",
    description: "Create beautiful screenshot mockups",
    type: "website",
  },
};

interface EditorPageProps {
  searchParams: {
    project?: string;
    template?: string;
    file?: string;
  };
}

// Page component with proper loading states
export default function EditorPage({ searchParams }: EditorPageProps) {
  const { project, template, file } = searchParams;

  return (
    <EditorLayout>
      <div className="flex h-screen">
        {/* Main Canvas Area */}
        <main className="flex-1 relative">
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-lg">Loading canvas...</span>
              </div>
            }
          >
            <CanvasArea
              projectId={project}
              templateId={template}
              fileId={file}
            />
          </Suspense>
        </main>

        {/* Sidebar */}
        <aside className="w-80 border-l bg-card">
          <Suspense
            fallback={
              <div className="p-4">
                <LoadingSpinner />
              </div>
            }
          >
            <Sidebar />
          </Suspense>
        </aside>
      </div>
    </EditorLayout>
  );
}
```

### Advanced Component Patterns for Next.js

```typescript
// components/canvas/canvas-element.tsx - Polymorphic component
import { forwardRef, ElementType, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

// Polymorphic component props
type CanvasElementOwnProps<E extends ElementType = ElementType> = {
  as?: E;
  className?: string;
  elementData: CanvasElementData;
  isSelected?: boolean;
  onSelect?: () => void;
  onUpdate?: (data: Partial<CanvasElementData>) => void;
};

type CanvasElementProps<E extends ElementType> = CanvasElementOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof CanvasElementOwnProps>;

// Polymorphic ref type
type CanvasElementRef<E extends ElementType> =
  ComponentPropsWithoutRef<E>["ref"];

// Polymorphic component implementation
const CanvasElement = forwardRef(
  <E extends ElementType = "div">(
    {
      as,
      className,
      elementData,
      isSelected = false,
      onSelect,
      onUpdate,
      ...props
    }: CanvasElementProps<E>,
    ref: CanvasElementRef<E>
  ) => {
    const Component = as || "div";

    const elementClasses = cn(
      "absolute transition-all duration-200 cursor-pointer",
      "hover:shadow-md",
      {
        "ring-2 ring-primary": isSelected,
        "opacity-50": elementData.hidden,
      },
      className
    );

    const style = {
      left: elementData.x,
      top: elementData.y,
      width: elementData.width,
      height: elementData.height,
      transform: `rotate(${elementData.rotation || 0}deg)`,
      zIndex: elementData.zIndex || 1,
    };

    return (
      <Component
        ref={ref}
        className={elementClasses}
        style={style}
        onClick={onSelect}
        data-element-id={elementData.id}
        data-element-type={elementData.type}
        {...props}
      >
        {renderElementContent(elementData)}
      </Component>
    );
  }
);

CanvasElement.displayName = "CanvasElement";

// Helper function to render different element types
function renderElementContent(data: CanvasElementData) {
  switch (data.type) {
    case "text":
      return (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            fontSize: data.fontSize,
            color: data.color,
            fontFamily: data.fontFamily,
            fontWeight: data.fontWeight,
            textAlign: data.textAlign,
          }}
        >
          {data.content}
        </div>
      );

    case "image":
      return (
        <img
          src={data.src}
          alt={data.alt || ""}
          className="w-full h-full object-cover rounded"
          draggable={false}
        />
      );

    case "frame":
      return (
        <div
          className="w-full h-full border rounded"
          style={{
            borderColor: data.borderColor,
            borderWidth: data.borderWidth,
            borderRadius: data.borderRadius,
            backgroundColor: data.backgroundColor,
          }}
        />
      );

    default:
      return null;
  }
}

export { CanvasElement, type CanvasElementProps };
```

### Naming Conventions for Next.js 15

**Files and Directories:**

- Pages: `page.tsx` (Next.js App Router convention)
- Layouts: `layout.tsx` (Next.js App Router convention)
- Loading: `loading.tsx` (Next.js App Router convention)
- Error: `error.tsx` (Next.js App Router convention)
- Not Found: `not-found.tsx` (Next.js App Router convention)
- Components: `kebab-case.tsx` (e.g., `canvas-toolbar.tsx`)
- Server Components: `component-name.tsx` (no 'use client')
- Client Components: `component-name.tsx` (with 'use client')
- API Routes: `route.ts` (Next.js App Router convention)

**Component Names:**

- Server Components: `PascalCase` (e.g., `TemplateCard`, `ProjectList`)
- Client Components: `PascalCase` (e.g., `CanvasToolbar`, `DragHandler`)
- Page Components: `PascalCase` + `Page` (e.g., `EditorPage`, `SettingsPage`)
- Layout Components: `PascalCase` + `Layout` (e.g., `EditorLayout`)
- Component props interfaces: `ComponentNameProps`
- Server Action types: `ComponentNameAction`

**Next.js Specific Naming:**

- Server Actions: `actionName` (e.g., `saveProject`, `uploadFile`)
- API Route handlers: `GET`, `POST`, `PUT`, `DELETE` (Next.js convention)
- Metadata exports: `metadata`, `generateMetadata`
- Static params: `generateStaticParams`
- Route params: `params`, `searchParams`

**Canvas-Specific Naming (Updated for Next.js):**

- Canvas Server Components: `Canvas[Element]` (e.g., `CanvasBackground`)
- Canvas Client Components: `Canvas[Element]` with 'use client'
- Canvas API Routes: `/api/canvas/[operation]/route.ts`
- Canvas Server Actions: `canvas[Action]` (e.g., `canvasSave`, `canvasExport`)
- Canvas state: `[element]State` (e.g., `canvasState`, `elementState`)

**Modern CSS and Styling:**

- CSS Modules: `component-name.module.css`
- Tailwind classes: Use utility-first approach with `cn()` utility
- CSS Custom Properties: `--shot-[property]` (e.g., `--shot-canvas-width`)
- Data attributes: `data-[attribute]` (e.g., `data-selected`, `data-tool`)

### Component Architecture Best Practices

**1. Server vs Client Components**

- Default to Server Components for better performance
- Use Client Components only when needed (interactivity, browser APIs)
- Clearly mark Client Components with 'use client' directive
- Pass server data to client components via props

**2. Props and TypeScript**

- Define strict TypeScript interfaces for all props
- Use generic types for reusable components
- Implement proper component composition patterns
- Support polymorphic components where appropriate

**3. Performance Optimization**

- Use React.memo() selectively for expensive components
- Implement proper key props for list rendering
- Use Suspense boundaries for code splitting
- Optimize images with Next.js Image component

**4. Accessibility**

- Include proper ARIA attributes
- Implement keyboard navigation
- Use semantic HTML elements
- Ensure proper color contrast and focus management

**5. Error Handling**

- Implement Error Boundaries for component trees
- Handle async operations gracefully
- Provide meaningful error messages
- Use Next.js error.tsx for route-level errors
