# Frontend Tech Stack

| Category           | Technology               | Version        | Purpose                      | Rationale                                                                                                    |
| ------------------ | ------------------------ | -------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Framework          | Next.js                  | 15.0.0         | Full-stack React framework   | Latest stable with App Router, SSG, Turbopack, and API routes - perfect for AI integration                   |
| UI Framework       | React                    | 19.1.0         | Core UI framework            | Latest stable with React Compiler optimizations and enhanced hooks - perfect for complex canvas interactions |
| UI Library         | shadcn/ui                | CLI 3.0        | Component foundation         | Latest major release with namespaced registries, faster performance, and Tailwind v4 support                 |
| State Management   | Zustand                  | 5.0.8          | Lightweight app state        | Latest version with smaller bundle size, React 19+ optimized, and excellent localStorage persistence         |
| Routing            | Next.js App Router       | 15.0.0         | File-based routing           | Built-in routing with layouts, parallel routes, and SSG optimization                                         |
| Build Tool         | Next.js + Turbopack      | 15.0.0         | Development & bundling       | Next.js built-in with Turbopack for lightning-fast builds and SSG optimization                               |
| Styling            | Tailwind CSS             | 4.1.13         | Utility-first CSS            | Latest v4 with 5x faster builds, cascade layers, and advanced CSS features                                   |
| Testing            | Vitest for Next.js + RTL | 3.2.4 + 16.3.0 | Unit/integration testing     | Latest Vitest optimized for Next.js with browser mode improvements and RTL with React 19 compatibility       |
| Component Library  | Custom + shadcn          | CLI 3.0        | UI components                | Extended shadcn components optimized for canvas interactions and creative tools                              |
| Form Handling      | React Hook Form          | 7.62.0         | Form state management        | Latest lightweight version (8.6kB) with zero dependencies and React 19 compatibility                         |
| Animation          | Framer Motion            | 12.23.13       | Smooth animations            | Latest Motion with improved layout animations and performance for 60fps canvas operations                    |
| Dev Tools          | ESLint + Prettier        | 9.35.0 + 3.6.2 | Code quality                 | Latest ESLint with flat config and Prettier with experimental fast CLI                                       |
| Image Optimization | next/image               | 15.0.0         | Automatic image optimization | Built-in WebP/AVIF conversion, responsive images, and lazy loading                                           |
| Font Optimization  | next/font                | 15.0.0         | Web font optimization        | Automatic font optimization with zero layout shift                                                           |
| API Routes         | Next.js API Routes       | 15.0.0         | Backend endpoints            | Built-in API routes for AI service integration and future backend features                                   |

**Updated Rationale for Latest Versions with 2025 Best Practices:**

**Next.js 15.0.0:** Features App Router with file-based routing, Static Site Generation (SSG) for sub-1s load times, API routes for AI integration, Turbopack for lightning-fast builds, automatic image optimization, and built-in performance optimizations. Perfect foundation for AI-powered features.

**React 19.1.0:** Features React Compiler for automatic optimizations, enhanced automatic batching, improved concurrent features, advanced Suspense capabilities, and React.lazy with better performance - all optimized for canvas state management performance.

**Turbopack:** Next.js 15's built-in bundler delivers 5x faster builds than Webpack, with incremental compilation, advanced caching, and optimized bundle splitting for SSG. Eliminates the need for separate build tools while providing superior performance.

**Tailwind CSS 4.1.13:** Revolutionary rewrite with 5x faster builds and microsecond incremental builds, built on modern CSS features (cascade layers, `@property`, `color-mix()`), simplified setup with single `@import "tailwindcss"` line, CSS-first configuration (no more `tailwind.config.js`), and automatic content detection.

**Zustand 5.0.8:** Lightweight state management with slice-based organization, direct store access without providers, vanilla store API for non-React usage, excellent performance with selector patterns and equality functions, and seamless React 19 integration with auto-memoization support and React Compiler compatibility.

**Next.js App Router:** File-based routing with automatic code splitting, layout routes for shared layouts, parallel routes for complex UI patterns, built-in loading and error states, streaming for optimal performance, and SEO-optimized server-side rendering capabilities.

**Next.js API Routes:** Built-in backend capabilities enable seamless AI service integration, user authentication, and cloud storage features without separate backend infrastructure. Ready for OpenAI, Anthropic, and other AI service integrations.

All versions leverage cutting-edge 2025 best practices optimized for high-performance canvas applications like Scroma, with automatic optimizations, lightning-fast builds, SSG performance, and AI integration readiness.
