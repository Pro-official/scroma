# Routing

### Next.js 15 App Router Configuration

```typescript
// app/layout.tsx - Root layout with enhanced features
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { ErrorBoundary } from "@/components/error-boundary";
import { Providers } from "@/app/providers";
import { Analytics } from "@vercel/analytics/react";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Scroma - Screenshot Mockup Tool",
  description:
    "Create beautiful screenshot mockups with frames, backgrounds, and text overlays",
  keywords: ["screenshot", "mockup", "design", "editor"],
  authors: [{ name: "Scroma Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ErrorBoundary>
          <Providers>
            <AppShell>{children}</AppShell>
          </Providers>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
```

### Next.js 15 App Router Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx               # Home page (Welcome screen)
├── loading.tsx            # Global loading UI
├── error.tsx              # Global error UI
├── not-found.tsx          # 404 page
├── globals.css            # Global styles
├── providers.tsx          # App providers (state, theme)
├── editor/
│   ├── layout.tsx         # Editor-specific layout
│   ├── page.tsx          # Main editor canvas
│   ├── loading.tsx       # Editor loading state
│   ├── error.tsx         # Editor error boundary
│   └── [projectId]/
│       ├── page.tsx      # Project-specific editor
│       ├── loading.tsx   # Project loading
│       └── error.tsx     # Project error handling
├── templates/
│   ├── page.tsx          # Template gallery
│   ├── loading.tsx       # Template loading
│   └── [categoryId]/
│       └── page.tsx      # Category-specific templates
├── settings/
│   ├── page.tsx          # Settings page
│   └── layout.tsx        # Settings layout
└── api/                  # API routes
    ├── projects/
    │   ├── route.ts      # GET/POST /api/projects
    │   └── [id]/
    │       └── route.ts  # GET/PUT/DELETE /api/projects/[id]
    ├── export/
    │   └── route.ts      # POST /api/export
    ├── upload/
    │   └── route.ts      # POST /api/upload
    └── templates/
        └── route.ts      # GET /api/templates
```

### Modern Page Components with Next.js 15

```typescript
// app/page.tsx - Home/Welcome page
import { Suspense } from "react";
import { WelcomeScreen } from "@/components/welcome/welcome-screen";
import { RecentProjects } from "@/components/recent-projects";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Static metadata for SEO
export const metadata = {
  title: "Scroma - Create Beautiful Screenshot Mockups",
  description:
    "Transform your screenshots into professional mockups with frames, backgrounds, and text overlays",
};

// Home page with streaming content
export default async function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <WelcomeScreen />

      <Suspense fallback={<LoadingSpinner className="h-32" />}>
        <RecentProjects />
      </Suspense>
    </div>
  );
}
```

```typescript
// app/editor/page.tsx - Main editor page
import { Suspense } from "react";
import { EditorCanvas } from "@/components/canvas/editor-canvas";
import { CanvasToolbar } from "@/components/canvas/canvas-toolbar";
import { SidePanel } from "@/components/editor/side-panel";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const metadata = {
  title: "Editor - Scroma",
  description: "Canvas editor for creating screenshot mockups",
};

interface EditorPageProps {
  searchParams: { project?: string };
}

export default async function EditorPage({ searchParams }: EditorPageProps) {
  const projectId = searchParams.project;

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <CanvasToolbar />

        <div className="flex-1 relative">
          <Suspense
            fallback={
              <LoadingSpinner className="absolute inset-0 flex items-center justify-center" />
            }
          >
            <EditorCanvas projectId={projectId} />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<div className="w-80 bg-muted" />}>
        <SidePanel />
      </Suspense>
    </div>
  );
}
```

```typescript
// app/editor/[projectId]/page.tsx - Project-specific editor
import { notFound } from "next/navigation";
import { EditorCanvas } from "@/components/canvas/editor-canvas";
import { ProjectHeader } from "@/components/project/project-header";
import { loadProject, loadProjectHistory } from "@/lib/api/projects";

interface ProjectEditorPageProps {
  params: { projectId: string };
}

export async function generateMetadata({ params }: ProjectEditorPageProps) {
  const project = await loadProject(params.projectId);

  if (!project) {
    return {
      title: "Project Not Found - Scroma",
    };
  }

  return {
    title: `${project.name} - Scroma Editor`,
    description: project.description || "Edit your screenshot mockup project",
  };
}

export default async function ProjectEditorPage({
  params,
}: ProjectEditorPageProps) {
  const [project, projectHistory] = await Promise.all([
    loadProject(params.projectId),
    loadProjectHistory(params.projectId),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="h-screen flex flex-col">
      <ProjectHeader project={project} history={projectHistory} />

      <div className="flex-1">
        <EditorCanvas
          projectId={params.projectId}
          initialProject={project}
          initialHistory={projectHistory}
        />
      </div>
    </div>
  );
}
```

### API Routes with App Router

```typescript
// app/api/projects/route.ts - Projects API
import { NextRequest, NextResponse } from "next/server";
import { loadRecentProjects, createProject } from "@/lib/api/projects";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");

    const projects = await loadRecentProjects(limit);

    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const project = await createProject(body);

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/projects/[id]/route.ts - Individual project API
import { NextRequest, NextResponse } from "next/server";
import { loadProject, updateProject, deleteProject } from "@/lib/api/projects";

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const project = await loadProject(params.id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load project" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const project = await updateProject(params.id, body);

    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await deleteProject(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/export/route.ts - Export API
import { NextRequest, NextResponse } from "next/server";
import { exportCanvas } from "@/lib/canvas/export";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, format, quality, width, height } = body;

    const exportResult = await exportCanvas({
      projectId,
      format,
      quality: parseFloat(quality),
      width: parseInt(width),
      height: parseInt(height),
    });

    return NextResponse.json({
      success: true,
      exportUrl: exportResult.url,
      downloadUrl: exportResult.downloadUrl,
    });
  } catch (error) {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
```

### Modern Navigation with Next.js 15

```typescript
// components/navigation/app-navigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Edit, Layout, Settings } from "lucide-react";

const navigationItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/editor", label: "Editor", icon: Edit },
  { href: "/templates", label: "Templates", icon: Layout },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-4">
      {navigationItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              {
                "bg-primary text-primary-foreground": isActive,
                "text-muted-foreground hover:text-foreground": !isActive,
              }
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

// Smart link with prefetching
export function SmartLink({
  href,
  children,
  prefetch = true,
  className,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  prefetch?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={cn("text-primary hover:underline", className)}
      {...props}
    >
      {children}
    </Link>
  );
}
```

### Modern Forms with Server Actions

```typescript
// app/settings/page.tsx - Settings with Server Actions
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/settings/settings-form";
import { loadUserSettings, saveUserSettings } from "@/lib/api/settings";

async function updateSettings(formData: FormData) {
  "use server";

  const settings = {
    theme: formData.get("theme") as string,
    gridSize: parseInt(formData.get("gridSize") as string),
    autoSave: formData.get("autoSave") === "on",
    exportQuality: parseFloat(formData.get("exportQuality") as string),
  };

  try {
    await saveUserSettings(settings);
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    return { error: "Failed to save settings" };
  }
}

export default async function SettingsPage() {
  const userSettings = await loadUserSettings();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <SettingsForm initialSettings={userSettings} action={updateSettings} />
    </div>
  );
}
```

```typescript
// components/settings/settings-form.tsx
"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SettingsFormProps {
  initialSettings: UserSettings;
  action: (
    formData: FormData
  ) => Promise<{ success?: boolean; error?: string }>;
}

export function SettingsForm({ initialSettings, action }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="theme">Theme</Label>
          <Select name="theme" defaultValue={initialSettings.theme}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="gridSize">Grid Size</Label>
          <Input
            id="gridSize"
            name="gridSize"
            type="number"
            min="10"
            max="50"
            defaultValue={initialSettings.gridSize}
            disabled={isPending}
          />
        </div>

        <div>
          <Label htmlFor="exportQuality">Export Quality</Label>
          <Input
            id="exportQuality"
            name="exportQuality"
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            defaultValue={initialSettings.exportQuality}
            disabled={isPending}
          />
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Settings"}
      </Button>

      {state?.success && (
        <div className="text-green-600 text-sm">
          Settings saved successfully!
        </div>
      )}

      {state?.error && (
        <div className="text-red-600 text-sm">{state.error}</div>
      )}
    </form>
  );
}
```

### Error Handling and Loading States

```typescript
// app/error.tsx - Global error boundary
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Something went wrong!</h1>
        <p className="text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}

// app/loading.tsx - Global loading UI
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );
}

// app/not-found.tsx - 404 page
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you are looking for does not exist.
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
```

### Advanced Routing Patterns

```typescript
// app/editor/[projectId]/layout.tsx - Nested layouts
import { Suspense } from "react";
import { ProjectSidebar } from "@/components/project/project-sidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: { projectId: string };
}

export default function ProjectLayout({
  children,
  params,
}: ProjectLayoutProps) {
  return (
    <div className="flex h-screen">
      <Suspense fallback={<div className="w-64 bg-muted" />}>
        <ProjectSidebar projectId={params.projectId} />
      </Suspense>

      <main className="flex-1">{children}</main>
    </div>
  );
}

// app/editor/[projectId]/history/page.tsx - Project history
interface ProjectHistoryPageProps {
  params: { projectId: string };
}

export default async function ProjectHistoryPage({
  params,
}: ProjectHistoryPageProps) {
  const history = await loadProjectHistory(params.projectId);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Project History</h1>
      <ProjectHistoryList history={history} />
    </div>
  );
}
```

### Performance Optimization

```typescript
// app/templates/page.tsx - Optimized template gallery
import { Suspense } from "react";
import { TemplateGrid } from "@/components/templates/template-grid";
import { TemplateFilters } from "@/components/templates/template-filters";
import { loadTemplates, loadTemplateCategories } from "@/lib/api/templates";

interface TemplatesPageProps {
  searchParams: {
    category?: string;
    search?: string;
    page?: string;
  };
}

export async function generateStaticParams() {
  // Pre-generate popular template categories
  return [
    { category: "mobile" },
    { category: "desktop" },
    { category: "social" },
  ];
}

export default async function TemplatesPage({
  searchParams,
}: TemplatesPageProps) {
  const { category, search, page = "1" } = searchParams;

  // Parallel data fetching
  const [templates, categories] = await Promise.all([
    loadTemplates({
      category,
      search,
      page: parseInt(page),
      limit: 12,
    }),
    loadTemplateCategories(),
  ]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64">
          <TemplateFilters
            categories={categories}
            selectedCategory={category}
          />
        </aside>

        <main className="flex-1">
          <Suspense fallback={<TemplateGridSkeleton />}>
            <TemplateGrid templates={templates} currentPage={parseInt(page)} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
```

### Navigation Hooks and Utilities

```typescript
// lib/hooks/use-navigation.ts
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useAppNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigateToEditor = useCallback(
    (projectId?: string) => {
      const url = projectId ? `/editor/${projectId}` : "/editor";
      router.push(url);
    },
    [router]
  );

  const navigateToTemplate = useCallback(
    (templateId: string) => {
      router.push(`/editor?template=${templateId}`);
    },
    [router]
  );

  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const newUrl = `${pathname}?${params.toString()}`;
      router.push(newUrl);
    },
    [router, pathname, searchParams]
  );

  return {
    navigateToEditor,
    navigateToTemplate,
    updateSearchParams,
    currentPath: pathname,
    searchParams,
  };
}
```
