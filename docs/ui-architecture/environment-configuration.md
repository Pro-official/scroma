# Environment Configuration

### Next.js 15 Environment Configuration

#### Development Environment (.env.local)

```bash
# Next.js Configuration
NEXT_PUBLIC_APP_NAME="Scroma - Screenshot Mockup Tool"
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database Configuration (Server-side only)
DATABASE_URL=postgresql://username:password@localhost:5432/shot_dev
REDIS_URL=redis://localhost:6379

# Authentication (Server-side only)
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# File Storage Configuration
NEXT_PUBLIC_STORAGE_PROVIDER=local
STORAGE_BUCKET_NAME=shot-dev-uploads
STORAGE_ACCESS_KEY=your-access-key
STORAGE_SECRET_KEY=your-secret-key
STORAGE_REGION=us-east-1

# Canvas Configuration (Client-side)
NEXT_PUBLIC_MAX_FILE_SIZE=10485760          # 10MB in bytes
NEXT_PUBLIC_MAX_CANVAS_WIDTH=4000           # Maximum canvas width in pixels
NEXT_PUBLIC_MAX_CANVAS_HEIGHT=3000          # Maximum canvas height in pixels
NEXT_PUBLIC_DEFAULT_CANVAS_WIDTH=1200
NEXT_PUBLIC_DEFAULT_CANVAS_HEIGHT=800
NEXT_PUBLIC_CANVAS_BACKGROUND_COLOR=#ffffff

# UI Configuration (Client-side)
NEXT_PUBLIC_GRID_SIZE=20
NEXT_PUBLIC_SNAP_THRESHOLD=10
NEXT_PUBLIC_ANIMATION_DURATION=200
NEXT_PUBLIC_TOOLBAR_HEIGHT=60
NEXT_PUBLIC_PANEL_WIDTH=320
NEXT_PUBLIC_ZOOM_STEP=0.2
NEXT_PUBLIC_MIN_ZOOM=0.1
NEXT_PUBLIC_MAX_ZOOM=5.0

# Export Settings (Client-side)
NEXT_PUBLIC_DEFAULT_EXPORT_FORMAT=png
NEXT_PUBLIC_DEFAULT_EXPORT_QUALITY=0.9
NEXT_PUBLIC_MAX_EXPORT_RESOLUTION=3
NEXT_PUBLIC_SUPPORTED_FORMATS=png,jpg,webp

# Feature Flags (Client-side)
NEXT_PUBLIC_ENABLE_DEBUG_MODE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=false
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true
NEXT_PUBLIC_ENABLE_COLLABORATION=false

# Performance Settings
NEXT_PUBLIC_AUTO_SAVE_INTERVAL=30000        # 30 seconds
NEXT_PUBLIC_MAX_UNDO_HISTORY=50
NEXT_PUBLIC_RENDER_THROTTLE=16              # 60fps (16ms)

# External Services (Server-side only)
OPENAI_API_KEY=your-openai-key
REPLICATE_API_TOKEN=your-replicate-token
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret

# Analytics (Client-side)
NEXT_PUBLIC_GA_TRACKING_ID=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_HOTJAR_ID=

# Security Configuration
NEXT_PUBLIC_CSP_REPORT_URI=
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000                    # 15 minutes

# Development Tools
NEXT_PUBLIC_DEV_TOOLS_ENABLED=true
ANALYZE_BUNDLE=false
TURBOPACK_ENABLED=true

# Error Monitoring (Server-side)
SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT=shot

# Email Configuration (Server-side only)
EMAIL_FROM=noreply@shot.dev
SMTP_HOST=localhost
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=

# Webhook Configuration (Server-side only)
WEBHOOK_SECRET=your-webhook-secret
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

#### Production Environment (.env.production)

```bash
# Next.js Configuration
NEXT_PUBLIC_APP_NAME="Scroma - Screenshot Mockup Tool"
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_URL=https://scroma.app

# Database Configuration (Server-side only)
DATABASE_URL=${DATABASE_URL}
REDIS_URL=${REDIS_URL}

# Authentication (Server-side only)
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXTAUTH_URL=https://scroma.app

# File Storage Configuration
NEXT_PUBLIC_STORAGE_PROVIDER=s3
STORAGE_BUCKET_NAME=shot-production-uploads
STORAGE_ACCESS_KEY=${AWS_ACCESS_KEY_ID}
STORAGE_SECRET_KEY=${AWS_SECRET_ACCESS_KEY}
STORAGE_REGION=us-east-1
STORAGE_CDN_URL=https://cdn.scroma.app

# Canvas Configuration (same as dev but with CDN)
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_MAX_CANVAS_WIDTH=4000
NEXT_PUBLIC_MAX_CANVAS_HEIGHT=3000
NEXT_PUBLIC_DEFAULT_CANVAS_WIDTH=1200
NEXT_PUBLIC_DEFAULT_CANVAS_HEIGHT=800
NEXT_PUBLIC_CANVAS_BACKGROUND_COLOR=#ffffff

# UI Configuration (optimized for production)
NEXT_PUBLIC_GRID_SIZE=20
NEXT_PUBLIC_SNAP_THRESHOLD=10
NEXT_PUBLIC_ANIMATION_DURATION=150          # Slightly faster for production
NEXT_PUBLIC_TOOLBAR_HEIGHT=60
NEXT_PUBLIC_PANEL_WIDTH=320
NEXT_PUBLIC_ZOOM_STEP=0.2
NEXT_PUBLIC_MIN_ZOOM=0.1
NEXT_PUBLIC_MAX_ZOOM=5.0

# Export Settings
NEXT_PUBLIC_DEFAULT_EXPORT_FORMAT=webp     # Better compression for production
NEXT_PUBLIC_DEFAULT_EXPORT_QUALITY=0.85    # Balanced quality/size
NEXT_PUBLIC_MAX_EXPORT_RESOLUTION=3
NEXT_PUBLIC_SUPPORTED_FORMATS=png,jpg,webp

# Feature Flags (production settings)
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=true
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true
NEXT_PUBLIC_ENABLE_COLLABORATION=true

# Performance Settings (production optimized)
NEXT_PUBLIC_AUTO_SAVE_INTERVAL=10000        # More frequent saves
NEXT_PUBLIC_MAX_UNDO_HISTORY=30             # Reduced for memory
NEXT_PUBLIC_RENDER_THROTTLE=16

# Analytics (production)
NEXT_PUBLIC_GA_TRACKING_ID=${GA_TRACKING_ID}
NEXT_PUBLIC_POSTHOG_KEY=${POSTHOG_KEY}
NEXT_PUBLIC_HOTJAR_ID=${HOTJAR_ID}

# Security Configuration
ALLOWED_ORIGINS=https://scroma.app,https://www.scroma.app
RATE_LIMIT_MAX=50                           # Stricter in production
RATE_LIMIT_WINDOW=900000

# Development Tools (disabled in production)
NEXT_PUBLIC_DEV_TOOLS_ENABLED=false
ANALYZE_BUNDLE=false
TURBOPACK_ENABLED=true

# Production Services
SENTRY_DSN=${SENTRY_DSN}
EMAIL_FROM=noreply@scroma.app
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
```

### Next.js 15 Configuration (next.config.js)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for performance
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
    // Server Components logging in development
    logging: {
      level: process.env.NODE_ENV === "development" ? "verbose" : "error",
    },
    // Optimize package imports for canvas libraries
    optimizePackageImports: [
      "fabric",
      "konva",
      "react-konva",
      "three",
      "@react-three/fiber",
    ],
    // Enable server actions
    serverActions: true,
    // PPR for better performance
    ppr: true,
  },

  // Image optimization for canvas thumbnails and uploads
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.scroma.app",
        port: "",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/scroma/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1 week
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    // Enable React Compiler for React 19
    reactCompiler: true,
  },

  // Security headers
  async headers() {
    const isDev = process.env.NODE_ENV === "development";

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: isDev
              ? "default-src 'self' 'unsafe-eval' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' ws: wss:; worker-src 'self' blob:;"
              : "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; connect-src 'self' https:; worker-src 'self' blob:; frame-ancestors 'none';",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: "/canvas",
        destination: "/editor",
        permanent: true,
      },
      {
        source: "/edit",
        destination: "/editor",
        permanent: true,
      },
    ];
  },

  // Rewrites for API compatibility
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "/api/:path*",
      },
    ];
  },

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

    // Add support for importing shader files (fallback for webpack)
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: "asset/source",
    });

    return config;
  },

  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Output configuration for deployment
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,

  // Bundle analyzer
  ...(process.env.ANALYZE === "true" && {
    experimental: {
      bundlePagesRouterDependencies: true,
    },
  }),
};

// Wrap with bundle analyzer if enabled
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
```

### Environment Type Definitions

```typescript
// types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    // Next.js built-ins
    NODE_ENV: "development" | "production" | "test";
    NEXT_PUBLIC_VERCEL_URL?: string;

    // Public environment variables (client-side)
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_APP_VERSION: string;
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_STORAGE_PROVIDER: "local" | "s3" | "cloudinary";
    NEXT_PUBLIC_MAX_FILE_SIZE: string;
    NEXT_PUBLIC_MAX_CANVAS_WIDTH: string;
    NEXT_PUBLIC_MAX_CANVAS_HEIGHT: string;
    NEXT_PUBLIC_DEFAULT_CANVAS_WIDTH: string;
    NEXT_PUBLIC_DEFAULT_CANVAS_HEIGHT: string;
    NEXT_PUBLIC_CANVAS_BACKGROUND_COLOR: string;
    NEXT_PUBLIC_GRID_SIZE: string;
    NEXT_PUBLIC_SNAP_THRESHOLD: string;
    NEXT_PUBLIC_ANIMATION_DURATION: string;
    NEXT_PUBLIC_TOOLBAR_HEIGHT: string;
    NEXT_PUBLIC_PANEL_WIDTH: string;
    NEXT_PUBLIC_ZOOM_STEP: string;
    NEXT_PUBLIC_MIN_ZOOM: string;
    NEXT_PUBLIC_MAX_ZOOM: string;
    NEXT_PUBLIC_DEFAULT_EXPORT_FORMAT: "png" | "jpg" | "webp";
    NEXT_PUBLIC_DEFAULT_EXPORT_QUALITY: string;
    NEXT_PUBLIC_MAX_EXPORT_RESOLUTION: string;
    NEXT_PUBLIC_SUPPORTED_FORMATS: string;
    NEXT_PUBLIC_ENABLE_DEBUG_MODE: string;
    NEXT_PUBLIC_ENABLE_ANALYTICS: string;
    NEXT_PUBLIC_ENABLE_ERROR_REPORTING: string;
    NEXT_PUBLIC_ENABLE_OFFLINE_MODE: string;
    NEXT_PUBLIC_ENABLE_COLLABORATION: string;
    NEXT_PUBLIC_AUTO_SAVE_INTERVAL: string;
    NEXT_PUBLIC_MAX_UNDO_HISTORY: string;
    NEXT_PUBLIC_RENDER_THROTTLE: string;
    NEXT_PUBLIC_GA_TRACKING_ID?: string;
    NEXT_PUBLIC_POSTHOG_KEY?: string;
    NEXT_PUBLIC_HOTJAR_ID?: string;
    NEXT_PUBLIC_DEV_TOOLS_ENABLED: string;

    // Server-only environment variables
    DATABASE_URL: string;
    REDIS_URL?: string;
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
    STORAGE_BUCKET_NAME: string;
    STORAGE_ACCESS_KEY: string;
    STORAGE_SECRET_KEY: string;
    STORAGE_REGION: string;
    STORAGE_CDN_URL?: string;
    OPENAI_API_KEY?: string;
    REPLICATE_API_TOKEN?: string;
    CLOUDINARY_CLOUD_NAME?: string;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;
    ALLOWED_ORIGINS: string;
    RATE_LIMIT_MAX: string;
    RATE_LIMIT_WINDOW: string;
    SENTRY_DSN?: string;
    SENTRY_ORG?: string;
    SENTRY_PROJECT?: string;
    EMAIL_FROM: string;
    SMTP_HOST?: string;
    SMTP_PORT?: string;
    SMTP_USER?: string;
    SMTP_PASSWORD?: string;
    WEBHOOK_SECRET?: string;
    STRIPE_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
    ANALYZE?: string;
    TURBOPACK_ENABLED?: string;
  }
}
```

### Environment Configuration Utilities

```typescript
// lib/config.ts - Type-safe environment configuration
const requiredEnvVars = [
  "NEXT_PUBLIC_APP_NAME",
  "NEXT_PUBLIC_APP_VERSION",
  "NEXT_PUBLIC_APP_URL",
] as const;

const optionalEnvVars = [
  "NEXT_PUBLIC_GA_TRACKING_ID",
  "NEXT_PUBLIC_POSTHOG_KEY",
  "NEXT_PUBLIC_HOTJAR_ID",
] as const;

// Validate environment variables
function validateEnv() {
  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

// Type-safe config object
export const config = {
  // App configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME!,
    version: process.env.NEXT_PUBLIC_APP_VERSION!,
    url: process.env.NEXT_PUBLIC_APP_URL!,
    isDev: process.env.NODE_ENV === "development",
    isProd: process.env.NODE_ENV === "production",
  },

  // Canvas configuration
  canvas: {
    maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || "10485760"),
    maxWidth: parseInt(process.env.NEXT_PUBLIC_MAX_CANVAS_WIDTH || "4000"),
    maxHeight: parseInt(process.env.NEXT_PUBLIC_MAX_CANVAS_HEIGHT || "3000"),
    defaultWidth: parseInt(
      process.env.NEXT_PUBLIC_DEFAULT_CANVAS_WIDTH || "1200"
    ),
    defaultHeight: parseInt(
      process.env.NEXT_PUBLIC_DEFAULT_CANVAS_HEIGHT || "800"
    ),
    backgroundColor:
      process.env.NEXT_PUBLIC_CANVAS_BACKGROUND_COLOR || "#ffffff",
  },

  // UI configuration
  ui: {
    gridSize: parseInt(process.env.NEXT_PUBLIC_GRID_SIZE || "20"),
    snapThreshold: parseInt(process.env.NEXT_PUBLIC_SNAP_THRESHOLD || "10"),
    animationDuration: parseInt(
      process.env.NEXT_PUBLIC_ANIMATION_DURATION || "200"
    ),
    toolbarHeight: parseInt(process.env.NEXT_PUBLIC_TOOLBAR_HEIGHT || "60"),
    panelWidth: parseInt(process.env.NEXT_PUBLIC_PANEL_WIDTH || "320"),
    zoomStep: parseFloat(process.env.NEXT_PUBLIC_ZOOM_STEP || "0.2"),
    minZoom: parseFloat(process.env.NEXT_PUBLIC_MIN_ZOOM || "0.1"),
    maxZoom: parseFloat(process.env.NEXT_PUBLIC_MAX_ZOOM || "5.0"),
  },

  // Export configuration
  export: {
    defaultFormat:
      (process.env.NEXT_PUBLIC_DEFAULT_EXPORT_FORMAT as
        | "png"
        | "jpg"
        | "webp") || "png",
    defaultQuality: parseFloat(
      process.env.NEXT_PUBLIC_DEFAULT_EXPORT_QUALITY || "0.9"
    ),
    maxResolution: parseInt(
      process.env.NEXT_PUBLIC_MAX_EXPORT_RESOLUTION || "3"
    ),
    supportedFormats: process.env.NEXT_PUBLIC_SUPPORTED_FORMATS?.split(",") || [
      "png",
      "jpg",
      "webp",
    ],
  },

  // Feature flags
  features: {
    debugMode: process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE === "true",
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
    errorReporting: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === "true",
    offlineMode: process.env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE === "true",
    collaboration: process.env.NEXT_PUBLIC_ENABLE_COLLABORATION === "true",
    devTools: process.env.NEXT_PUBLIC_DEV_TOOLS_ENABLED === "true",
  },

  // Performance configuration
  performance: {
    autoSaveInterval: parseInt(
      process.env.NEXT_PUBLIC_AUTO_SAVE_INTERVAL || "30000"
    ),
    maxUndoHistory: parseInt(process.env.NEXT_PUBLIC_MAX_UNDO_HISTORY || "50"),
    renderThrottle: parseInt(process.env.NEXT_PUBLIC_RENDER_THROTTLE || "16"),
  },

  // Analytics configuration
  analytics: {
    gaTrackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
    posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID,
  },

  // Storage configuration
  storage: {
    provider:
      (process.env.NEXT_PUBLIC_STORAGE_PROVIDER as
        | "local"
        | "s3"
        | "cloudinary") || "local",
  },
} as const;

// Validate on import
if (typeof window === "undefined") {
  validateEnv();
}

// Export individual sections for easier imports
export const {
  app,
  canvas,
  ui,
  export: exportConfig,
  features,
  performance,
  analytics,
  storage,
} = config;
```

### Environment-Specific Optimizations

```typescript
// lib/env-optimizations.ts
import { config } from "./config";

// Development-specific utilities
export const devUtils = {
  isEnabled: config.app.isDev,

  log: (...args: any[]) => {
    if (config.features.debugMode) {
      console.log("[DEV]", ...args);
    }
  },

  performance: {
    measureRender: <T extends (...args: any[]) => any>(
      fn: T,
      name: string
    ): T => {
      if (!config.features.debugMode) return fn;

      return ((...args: any[]) => {
        const start = performance.now();
        const result = fn(...args);
        const end = performance.now();
        console.log(`[PERF] ${name}: ${end - start}ms`);
        return result;
      }) as T;
    },

    measureAsync: async <T>(promise: Promise<T>, name: string): Promise<T> => {
      if (!config.features.debugMode) return promise;

      const start = performance.now();
      const result = await promise;
      const end = performance.now();
      console.log(`[PERF] ${name}: ${end - start}ms`);
      return result;
    },
  },
};

// Production-specific optimizations
export const prodUtils = {
  isEnabled: config.app.isProd,

  // Error boundary for production
  reportError: (error: Error, context?: Record<string, any>) => {
    if (config.features.errorReporting && typeof window !== "undefined") {
      // Send to error reporting service
      console.error("Production error:", error, context);
    }
  },

  // Performance monitoring
  reportWebVitals: (metric: any) => {
    if (config.features.analytics && typeof window !== "undefined") {
      // Send to analytics service
      console.log("Web Vital:", metric);
    }
  },
};

// Canvas-specific optimizations
export const canvasOptimizations = {
  // Determine optimal canvas settings based on device
  getOptimalCanvasSize: () => {
    if (typeof window === "undefined") {
      return {
        width: config.canvas.defaultWidth,
        height: config.canvas.defaultHeight,
      };
    }

    const devicePixelRatio = window.devicePixelRatio || 1;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    // Adjust canvas size based on device capabilities
    const maxWidth = Math.min(
      config.canvas.maxWidth,
      screenWidth * devicePixelRatio
    );
    const maxHeight = Math.min(
      config.canvas.maxHeight,
      screenHeight * devicePixelRatio
    );

    return {
      width: Math.min(config.canvas.defaultWidth, maxWidth),
      height: Math.min(config.canvas.defaultHeight, maxHeight),
    };
  },

  // Determine optimal render throttle based on device performance
  getOptimalRenderThrottle: () => {
    if (typeof window === "undefined") {
      return config.performance.renderThrottle;
    }

    // Simple performance detection
    const connection = (navigator as any).connection;
    const isSlowDevice =
      connection?.effectiveType === "2g" ||
      connection?.effectiveType === "slow-2g";
    const isLowMemory = (navigator as any).deviceMemory < 4;

    if (isSlowDevice || isLowMemory) {
      return Math.max(config.performance.renderThrottle * 2, 32); // 30fps cap
    }

    return config.performance.renderThrottle; // 60fps
  },
};
```

### Docker Configuration for Next.js 15

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables for build
ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_APP_VERSION
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_APP_VERSION=$NEXT_PUBLIC_APP_VERSION
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Environment Validation and Setup

```typescript
// scripts/validate-env.ts - Environment validation script
import { z } from "zod";

const envSchema = z.object({
  // Next.js built-ins
  NODE_ENV: z.enum(["development", "production", "test"]),

  // Public environment variables
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
  NEXT_PUBLIC_APP_VERSION: z.string().regex(/^\d+\.\d+\.\d+$/),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_MAX_FILE_SIZE: z.string().regex(/^\d+$/),
  NEXT_PUBLIC_DEFAULT_CANVAS_WIDTH: z.string().regex(/^\d+$/),
  NEXT_PUBLIC_DEFAULT_CANVAS_HEIGHT: z.string().regex(/^\d+$/),

  // Server-only variables
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),

  // Optional variables
  REDIS_URL: z.string().url().optional(),
  SENTRY_DSN: z.string().url().optional(),
});

export function validateEnvironment() {
  try {
    envSchema.parse(process.env);
    console.log("✅ Environment variables are valid");
  } catch (error) {
    console.error("❌ Invalid environment variables:");
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        console.error(`  ${err.path.join(".")}: ${err.message}`);
      });
    }
    process.exit(1);
  }
}

// Run validation
if (require.main === module) {
  validateEnvironment();
}
```

This comprehensive Next.js 15 environment configuration provides:

- **Type-safe environment variables** with TypeScript definitions
- **Next.js 15 optimized configuration** with Turbopack and modern features
- **Security-focused headers** and CSP policies
- **Performance optimizations** for canvas operations
- **Environment-specific settings** for development and production
- **Docker support** for containerized deployments
- **Validation utilities** to ensure proper configuration

The configuration follows Next.js 15 best practices while providing the specific settings needed for a high-performance canvas application.
