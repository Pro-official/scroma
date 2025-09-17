# Frontend Developer Standards

### Critical Coding Rules - Next.js 15 Edition

**Next.js 15 Framework Rules:**

1. **Default to Server Components** - Use Server Components by default, add 'use client' only when needed for interactivity
2. **Leverage App Router file conventions** - Use page.tsx, layout.tsx, loading.tsx, error.tsx, and not-found.tsx appropriately
3. **Implement Server Actions for mutations** - Use Next.js Server Actions for form submissions and data mutations
4. **Optimize with Turbopack in development** - Leverage Turbopack's enhanced dev performance and module federation
5. **Use streaming and Suspense boundaries** - Implement progressive loading with React Suspense and Next.js streaming

**React 19 Integration Rules:** 6. **Use React 19 optimizations** - Leverage automatic batching, concurrent features, React Compiler optimizations, and enhanced Suspense for better performance 7. **Use Suspense for async loading** - Leverage React 19's enhanced async handling and React Compiler optimizations for canvas image loading 8. **Implement optimistic updates** - Use state patterns with automatic pending states for canvas operations 9. **Design for automatic batching** - React 19's automatic batching works across all state updates, including canvas operations, with React Compiler optimizations 10. **Use optimistic updates for canvas** - Immediate UI feedback with automatic rollback on errors

**Canvas Performance Rules:** 11. **Batch canvas operations with `requestAnimationFrame`** - Use render queues to prevent main thread blocking 12. **Pool canvas contexts to prevent memory leaks** - Reuse canvas elements and contexts across operations 13. **Use Web Workers for heavy processing** - Keep canvas operations responsive with background threads 14. **Monitor performance metrics in development** - Track FPS, frame time, and memory usage with built-in hooks 15. **Clean up resources aggressively** - Canvas contexts, blob URLs, and event listeners must be properly disposed

**Next.js 15 Performance Rules:** 16. **Configure Turbopack optimally** - Use experimental Turbopack features for maximum development speed 17. **Implement ISR for static template content** - Use Incremental Static Regeneration for template galleries 18. **Leverage Next.js Image optimization** - Use next/image for all canvas thumbnails and previews 19. **Use Server Components for static content** - Render template cards, navigation, and static UI on server 20. **Implement parallel routes for complex layouts** - Use parallel and intercepting routes for modal overlays

**State Management Rules with Next.js:** 21. **Separate server and client state clearly** - Use Server Components for server state, Zustand for client state 22. **Implement optimistic updates with rollback** - Update UI immediately, provide rollback functions for errors 23. **Use React Query for server state caching** - Cache API responses and synchronize with Server Components 24. **Handle SSR/hydration mismatches** - Properly initialize client state after server rendering

**Tailwind CSS 4 Rules:** 25. **Use CSS-first configuration** - Configure themes in CSS files, not JavaScript config files 26. **Leverage cascade layers for organization** - Organize styles with `@layer base`, `@layer components`, `@layer utilities` 27. **Use modern CSS features** - Implement `color-mix()`, custom properties with `@property`, and container queries 28. **Optimize with data-slot attributes** - Use shadcn/ui's data-slot pattern for better style targeting

**shadcn/ui Integration Rules:** 29. **Extend components with canvas-specific features** - Build canvas components on shadcn/ui foundation 30. **Implement accessibility-first patterns** - Use ARIA attributes, keyboard navigation, and focus management 31. **Use data-slot for component styling** - Leverage new data-slot attributes for better CSS organization

**Next.js 15 Testing Rules:** 32. **Test Server Components with proper mocking** - Mock Next.js APIs and test server-side rendering behavior 33. **Test Server Actions in isolation** - Unit test Server Actions separately from component integration 34. **Mock Next.js router consistently** - Use standardized Next.js navigation mocks across all tests 35. **Test accessibility features** - Verify keyboard navigation, ARIA attributes, and screen reader compatibility

**Security & Validation Rules:** 36. **Validate Server Action inputs with Zod** - Implement strict input validation for all Server Actions 37. **Use Content Security Policy headers** - Configure CSP headers in next.config.js for production deployments 38. **Sanitize user inputs before canvas rendering** - Prevent XSS attacks through canvas text overlays 39. **Environment variables follow Next.js patterns** - Use NEXT*PUBLIC* prefix for client-side variables only

**Development Quality Rules:** 40. **Monitor Core Web Vitals** - Track LCP, INP, and CLS metrics for canvas application performance 41. **Implement progressive enhancement** - Ensure basic functionality works without JavaScript 42. **Use TypeScript strict mode** - Enable all strict compiler options for Next.js and canvas operation type safety 43. **Follow WCAG 2.1 AA guidelines** - Ensure full accessibility compliance for all canvas interactions

### Quick Reference

**Essential Commands:**

```bash
npm run dev              # Start dev server (Next.js 15 + Turbopack)
npm run build           # Production build with optimization
npm run start           # Start production server
npm run test            # Run tests (Vitest integration)
npm run type-check      # TypeScript checking
npm run lint            # ESLint 9.x with Next.js rules
npm run format          # Prettier 3.x
```

**Key Import Patterns:**

```typescript
// Next.js imports
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { redirect, notFound } from "next/navigation";

// Component imports (unchanged)
import { Button } from "@/components/ui/button";
import { CanvasToolbar } from "@/components/canvas/canvas-toolbar";

// Store imports (client-side only)
import { useCanvasStore } from "@/stores/canvas-store";
import { canvasSelectors } from "@/stores/canvas-store";

// Utility imports
import { cn } from "@/lib/utils";
import { config } from "@/lib/config";

// Type imports
import type { CanvasElement, FrameConfig } from "@/types/canvas";
import type { Metadata } from "next";
```

**Next.js 15 Specific Patterns:**

```typescript
// Server Component with metadata
export const metadata: Metadata = {
  title: "Canvas Editor",
  description: "Create beautiful screenshot mockups",
};

export default async function EditorPage() {
  const projects = await loadProjects(); // Server-side data fetching
  return <EditorLayout projects={projects} />;
}

// Client Component with canvas interaction
("use client");

export function CanvasEditor() {
  const selectedElement = useCanvasStore(canvasSelectors.selectedElement);

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const canvasX = (event.clientX - rect.left) / zoom;
      const canvasY = (event.clientY - rect.top) / zoom;

      // Canvas coordinate logic here
    },
    [zoom]
  );

  return <canvas ref={canvasRef} onClick={handleCanvasClick} />;
}

// Server Action pattern
async function saveCanvas(formData: FormData) {
  "use server";

  const canvasData = JSON.parse(formData.get("canvasData") as string);

  try {
    const result = await saveCanvasToDatabase(canvasData);
    revalidatePath("/editor");
    return { success: true, id: result.id };
  } catch (error) {
    return { error: "Failed to save canvas" };
  }
}

// API Route pattern
// app/api/canvas/export/route.ts
export async function POST(request: Request) {
  const { canvasData, format } = await request.json();

  try {
    const exportUrl = await exportCanvas(canvasData, format);
    return Response.json({ exportUrl });
  } catch (error) {
    return Response.json({ error: "Export failed" }, { status: 500 });
  }
}
```

**Canvas-Specific Patterns with Next.js:**

```typescript
// Server Component for canvas template
export async function CanvasTemplate({ templateId }: { templateId: string }) {
  const template = await loadTemplate(templateId); // Server-side

  return (
    <div className="template-card">
      <Image
        src={template.thumbnailUrl}
        alt={template.name}
        width={300}
        height={200}
        priority={template.featured}
      />
      <h3>{template.name}</h3>
    </div>
  );
}

// Client Component for canvas interaction
("use client");

export function InteractiveCanvas({
  initialData,
}: {
  initialData: CanvasData;
}) {
  const [canvasData, setCanvasData] = useState(initialData);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderFrame = () => {
      // Canvas rendering logic with requestAnimationFrame
    };

    requestAnimationFrame(renderFrame);
  }, [canvasData]);

  return <canvas ref={canvasRef} />;
}

// Hybrid approach - Server Component wrapping Client Component
export default async function CanvasEditorPage({
  params,
}: {
  params: { id: string };
}) {
  const projectData = await loadProject(params.id); // Server-side

  return (
    <div>
      <ProjectHeader project={projectData} /> {/* Server Component */}
      <InteractiveCanvas initialData={projectData.canvas} /> {/* Client Component */}
    </div>
  );
}
```

### Next.js 15 Configuration

**next.config.js - Optimized for Canvas Application:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features
  experimental: {
    // Turbopack for faster development builds
    turbo: {
      rules: {
        // SVG handling with Next.js built-in SVGR support
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
        // Shader file support for canvas operations
        "*.glsl": {
          loaders: ["raw-loader"],
          as: "*.js",
        },
        "*.vs": {
          loaders: ["raw-loader"],
          as: "*.js",
        },
        "*.fs": {
          loaders: ["raw-loader"],
          as: "*.js",
        },
        "*.vert": {
          loaders: ["raw-loader"],
          as: "*.js",
        },
        "*.frag": {
          loaders: ["raw-loader"],
          as: "*.js",
        },
      },
      resolveAlias: {
        // Handle canvas libraries that don't work in SSR
        canvas: false,
        fs: false,
        path: false,
        os: false,
      },
      // External packages for server-side rendering
      moduleIdStrategy: "deterministic",
      memoryLimit: 4096,
    },
    // Server Components logging
    logging: {
      level: "verbose",
    },
    // Optimize for canvas operations with Turbopack
    optimizePackageImports: [
      "fabric",
      "konva",
      "react-konva",
      "three",
      "@react-three/fiber",
    ],
  },

  // Image optimization for canvas thumbnails
  images: {
    domains: ["your-canvas-cdn.com"],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1 week
  },

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; worker-src 'self' blob:;",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },

  // Bundle analyzer
  ...(process.env.ANALYZE === "true" && {
    experimental: {
      bundlePagesRouterDependencies: true,
    },
  }),

  // Canvas-specific configuration for Turbopack and fallback webpack
  webpack: (config, { dev, isServer }) => {
    // Handle canvas libraries that don't work in SSR
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        canvas: false,
      };
    }

    // External libraries for server-side rendering
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push("canvas", "sharp", "utf-8-validate", "bufferutil");
    }

    return config;
  },
};

module.exports = nextConfig;
```

**TypeScript Configuration for Next.js 15:**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/app/*": ["./app/*"],
      "@/lib/*": ["./lib/*"],
      "@/stores/*": ["./stores/*"],
      "@/types/*": ["./types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Tailwind Configuration for Next.js:**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Canvas-specific utilities
      animation: {
        "canvas-pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "zoom-in": "zoom-in 0.2s ease-out",
        "zoom-out": "zoom-out 0.2s ease-out",
      },
      keyframes: {
        "zoom-in": {
          "0%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
        "zoom-out": {
          "0%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
      },
      // Canvas grid utilities
      backgroundImage: {
        "canvas-grid": "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-sm": "20px 20px",
        "grid-md": "40px 40px",
        "grid-lg": "60px 60px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
```

---

## Summary

This Next.js 15 frontend architecture document provides a comprehensive foundation for building Scroma - Screenshot Mockup Tool using the latest 2025 technologies with Next.js App Router. The architecture prioritizes:

- **Next.js 15 Performance**: Turbopack development, Server Components, and App Router optimization
- **Canvas Performance**: 60fps interactions with optimized state management and Web Workers
- **Developer Experience**: Type-safe patterns with modern Next.js tooling and Server Actions
- **User Experience**: Sub-2-second page loads with streaming and progressive enhancement
- **SEO Optimization**: Server-side rendering with proper metadata and structured data
- **Scalability**: Clean architecture supporting future features with Server/Client component separation
- **Accessibility**: WCAG AA compliance built into the Next.js foundation

The document serves as the definitive guide for Next.js 15 frontend development, ensuring consistency, performance, and quality across all implementation phases while leveraging the full power of the App Router architecture.
