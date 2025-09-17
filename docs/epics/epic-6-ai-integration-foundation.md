# Epic 6: AI Integration Foundation

## Epic Goal

Establish comprehensive AI service infrastructure using Next.js 15 API routes and create foundational AI-powered features that enhance the screenshot mockup workflow. Users will benefit from intelligent background removal, smart cropping, and AI-driven design suggestions, all optimized for sub-1s response times through Next.js architecture.

## Epic Description

### Purpose

This epic introduces AI capabilities that transform Scroma from a manual design tool into an intelligent assistant for creating professional mockups. By leveraging Next.js 15 API routes, we can integrate multiple AI services (OpenAI, Anthropic, specialized computer vision APIs) without requiring separate backend infrastructure, providing immediate value through background removal and smart image processing while laying the foundation for advanced AI features.

### Business Value

- Delivers premium AI features that justify paid tier conversions
- Provides competitive differentiation through intelligent design assistance
- Establishes technical foundation for advanced AI mockup generation
- Supports goal of 20% premium conversion driven by AI features
- Leverages Next.js 15 API routes for seamless AI service integration without additional infrastructure costs

### Technical Implementation

- Next.js 15 API routes for AI service integration (OpenAI, Anthropic, Computer Vision APIs)
- Client-side AI result processing optimized for Next.js performance patterns
- Background removal and smart cropping using computer vision APIs
- AI-powered design suggestions and mockup enhancement
- Intelligent frame and background recommendations based on image content
- Real-time AI processing with progress indicators and fallback mechanisms

## User Stories

### Story 6.1: AI API Routes Infrastructure

**Goal:** Establish Next.js API routes foundation for AI service integration
**Effort:** 8 story points
**Dependencies:** Epic 1 (Next.js 15 foundation)

**Acceptance Criteria:**

1. Next.js API routes created for AI service integration (app/api/ai/)
2. Authentication and rate limiting implemented for AI service calls
3. Error handling and fallback mechanisms for AI service failures
4. API route structure supports multiple AI providers (OpenAI, Anthropic, Computer Vision)
5. Request/response logging and monitoring for AI service usage
6. Cost tracking and usage limits for AI service consumption
7. Environment variable configuration for AI service API keys
8. API route optimization for sub-1s response times where possible

### Story 6.2: Background Removal & Smart Cropping

**Goal:** Implement AI-powered background removal and intelligent image cropping via Next.js API routes
**Effort:** 13 story points
**Dependencies:** Story 6.1

**Acceptance Criteria:**

1. Background removal functionality using computer vision APIs via Next.js API routes
2. Smart crop detection identifies optimal image boundaries automatically
3. AI processing progress indicators show real-time status to users
4. Fallback to manual tools if AI processing fails or takes too long
5. Preview mode shows before/after comparison for AI operations
6. Processing optimized for common screenshot formats and sizes
7. AI results cached via Next.js for improved performance on similar images
8. Integration with existing canvas system for seamless AI result application

## Technical Architecture

### Next.js 15 AI API Routes Structure

```
app/api/ai/
├── remove-background/
│   └── route.ts              # Background removal API endpoint
├── smart-crop/
│   └── route.ts              # Intelligent cropping API endpoint
├── suggest-frame/
│   └── route.ts              # AI frame recommendations
├── suggest-background/
│   └── route.ts              # AI background suggestions
├── enhance-image/
│   └── route.ts              # AI image enhancement
└── middleware.ts             # AI service authentication and rate limiting

lib/ai/
├── providers/
│   ├── openai-client.ts      # OpenAI API integration
│   ├── anthropic-client.ts   # Anthropic API integration
│   ├── replicate-client.ts   # Replicate AI model integration
│   └── remove-bg-client.ts   # remove.bg API integration
├── image-processing/
│   ├── background-remover.ts # Background removal logic
│   ├── smart-cropper.ts      # Intelligent cropping algorithms
│   └── image-enhancer.ts     # AI image enhancement
├── ai-cache.ts               # AI result caching system
└── ai-utils.ts               # AI service utilities
```

### AI Service Integration (Next.js API Routes)

```typescript
// Background removal API route
// app/api/ai/remove-background/route.ts
import { NextRequest, NextResponse } from "next/server";
import { RemoveBgClient } from "@/lib/ai/providers/remove-bg-client";

export async function POST(request: NextRequest) {
  try {
    const { imageData, options } = await request.json();

    // Rate limiting and authentication
    const isAuthorized = await checkAIUsageLimit(request);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Usage limit exceeded" },
        { status: 429 }
      );
    }

    // Process background removal
    const removeBgClient = new RemoveBgClient();
    const result = await removeBgClient.removeBackground(imageData, options);

    // Cache result for future use
    await cacheAIResult("remove-bg", imageData, result);

    return NextResponse.json({
      success: true,
      processedImage: result.processedImage,
      confidence: result.confidence,
      processingTime: result.processingTime,
    });
  } catch (error) {
    console.error("Background removal failed:", error);
    return NextResponse.json(
      { error: "Background removal failed" },
      { status: 500 }
    );
  }
}

// Smart crop API route
// app/api/ai/smart-crop/route.ts
export async function POST(request: NextRequest) {
  try {
    const { imageData, targetAspectRatio } = await request.json();

    const smartCropper = new SmartCropper();
    const cropSuggestions = await smartCropper.analyzeCropOptions(
      imageData,
      targetAspectRatio
    );

    return NextResponse.json({
      success: true,
      cropSuggestions,
      recommendedCrop: cropSuggestions[0], // Best suggestion
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Smart crop analysis failed" },
      { status: 500 }
    );
  }
}
```

### AI State Management (Zustand + Next.js)

```typescript
interface AIState {
  // AI processing state
  isProcessing: boolean;
  currentOperation: AIOperation | null;
  processingProgress: number;

  // AI results
  backgroundRemovalResults: Map<string, BackgroundRemovalResult>;
  smartCropSuggestions: Map<string, CropSuggestion[]>;
  frameRecommendations: Map<string, FrameRecommendation[]>;

  // AI configuration
  aiProviders: AIProviderConfig[];
  usageStats: AIUsageStats;
  preferences: AIPreferences;

  // Error handling
  lastError: string | null;
  fallbackMode: boolean;
}

interface AIOperation {
  id: string;
  type: "remove-background" | "smart-crop" | "suggest-frame" | "enhance-image";
  status: "pending" | "processing" | "completed" | "failed";
  startTime: number;
  estimatedDuration: number;
}

interface BackgroundRemovalResult {
  originalImage: string;
  processedImage: string;
  maskImage: string;
  confidence: number;
  processingTime: number;
  provider: string;
}

interface CropSuggestion {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  reasoning: string;
}

interface FrameRecommendation {
  frameId: string;
  confidence: number;
  reasoning: string;
  suitabilityScore: number;
}
```

### AI Client-Side Integration

```typescript
// AI service hook for  components
export function useAIBackgroundRemoval() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<BackgroundRemovalResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const removeBackground = useCallback(async (imageData: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/remove-background", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData }),
      });

      if (!response.ok) {
        throw new Error("Background removal failed");
      }

      const result = await response.json();
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { removeBackground, isProcessing, result, error };
}

// Smart crop hook
export function useSmartCrop() {
  const [suggestions, setSuggestions] = useState<CropSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCropOptions = useCallback(
    async (imageData: string, targetAspectRatio?: number) => {
      setIsAnalyzing(true);

      try {
        const response = await fetch("/api/ai/smart-crop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageData, targetAspectRatio }),
        });

        const result = await response.json();
        setSuggestions(result.cropSuggestions);
      } catch (error) {
        console.error("Smart crop analysis failed:", error);
      } finally {
        setIsAnalyzing(false);
      }
    },
    []
  );

  return { analyzeCropOptions, suggestions, isAnalyzing };
}
```

### AI Component Architecture

```typescript
// AI-powered background removal component
export function AIBackgroundRemoval({ imageData }: { imageData: string }) {
  const { removeBackground, isProcessing, result, error } =
    useAIBackgroundRemoval();
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="ai-background-removal">
      <Button
        onClick={() => removeBackground(imageData)}
        disabled={isProcessing}
        className="ai-feature-button"
      >
        {isProcessing ? (
          <>
            <Spinner className="mr-2" />
            Removing Background...
          </>
        ) : (
          <>
            <Wand2 className="mr-2" />
            Remove Background
          </>
        )}
      </Button>

      {result && (
        <div className="ai-result-preview">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4>Original</h4>
              <img src={imageData} alt="Original" />
            </div>
            <div>
              <h4>AI Processed</h4>
              <img src={result.processedImage} alt="Background removed" />
            </div>
          </div>

          <div className="ai-metadata">
            <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
            <p>Processing time: {result.processingTime}ms</p>
          </div>

          <div className="ai-actions">
            <Button onClick={() => applyAIResult(result)}>Apply</Button>
            <Button variant="outline" onClick={() => setResult(null)}>
              Discard
            </Button>
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
```

## Definition of Done

### Functional Requirements

- [ ] All user stories completed with acceptance criteria met
- [ ] Next.js API routes successfully integrate with AI services
- [ ] Background removal works with 90%+ accuracy on typical screenshots
- [ ] Smart crop suggestions provide relevant options for common use cases
- [ ] AI processing provides real-time progress feedback to users
- [ ] Fallback mechanisms handle AI service failures gracefully

### Performance Requirements

- [ ] AI API routes respond within 3 seconds for background removal
- [ ] Smart crop analysis completes within 2 seconds
- [ ] AI processing doesn't block canvas interactions or other features
- [ ] AI result caching reduces repeat processing by 80%
- [ ] Memory usage remains under 100MB during AI operations

### Quality Requirements

- [ ] Background removal preserves image quality with minimal artifacts
- [ ] Smart crop suggestions maintain subject focus and composition
- [ ] AI error handling provides clear user feedback and recovery options
- [ ] AI features integrate seamlessly with existing canvas workflow
- [ ] AI results can be undone/redone like other canvas operations

### Business Requirements

- [ ] AI features available to premium users with appropriate usage limits
- [ ] Cost tracking prevents AI service overuse
- [ ] AI usage analytics provide insights for feature optimization
- [ ] Premium upgrade prompts appear for free users after AI trial usage

## Success Metrics

### Feature Adoption

- **Target:** 60% of premium users try AI background removal within first month
- **Measurement:** Analytics tracking AI feature usage and completion rates

### User Satisfaction

- **Target:** 85% of users rate AI background removal as "helpful" or higher
- **Measurement:** In-app feedback collection and user surveys

### Technical Performance

- **Target:** AI operations complete within SLA times 95% of the time
- **Measurement:** API response time monitoring and error rate tracking

### Business Impact

- **Target:** AI features drive 20% of premium conversions
- **Measurement:** Conversion funnel analysis and revenue attribution

## Risk Assessment

### Primary Risk: AI Service Reliability and Costs

**Mitigation:**

- Multiple AI provider fallbacks for critical operations
- Usage monitoring and cost controls to prevent budget overruns
- Caching strategies to reduce API calls for similar images
- Clear user communication about AI processing times and limitations

### Secondary Risk: AI Processing Performance

**Mitigation:**

- Asynchronous processing with progress indicators
- Client-side fallbacks for simple operations
- Performance monitoring with automatic service degradation
- User education about AI feature benefits vs. processing time trade-offs

### Tertiary Risk: AI Result Quality Variability

**Mitigation:**

- Confidence scoring for AI results with quality thresholds
- A/B testing with different AI providers for optimal results
- User feedback collection to improve AI model selection
- Manual override options for all AI operations

### Rollback Plan

- Feature flags for instant disable of AI functionality
- Manual tool fallbacks for all AI-powered operations
- API route versioning for safe AI service updates
- Cost monitoring with automatic shutoff at spending thresholds

## Integration Points

### Upstream Dependencies

- Epic 1: Next.js 15 foundation provides API routes infrastructure
- Epic 1: Canvas system for AI result integration
- Epic 1: State management for AI operation tracking

### Downstream Dependencies

- Epic 2: Frame system enhanced with AI recommendations
- Epic 3: Background system enhanced with AI suggestions
- Epic 4: Text system could benefit from AI content suggestions
- Epic 5: Export system includes AI processing metadata

### Next.js 15 Integration Points

- **API Routes:** Full-stack AI service integration without separate backend
- **Server-Side Processing:** AI operations leverage Next.js server capabilities
- **Client Optimization:** AI results processed efficiently on client side
- **Static Generation:** AI provider configurations and fallbacks served via SSG
- **Performance Monitoring:** AI operation metrics integrated with Next.js analytics

### External Integrations

- **remove.bg API:** Background removal service
- **OpenAI API:** Advanced image analysis and suggestions
- **Anthropic API:** AI-powered design recommendations
- **Replicate API:** Access to specialized computer vision models
- **Custom Computer Vision APIs:** Specialized screenshot processing

## AI Provider Configuration

### Background Removal Providers

```typescript
const BACKGROUND_REMOVAL_PROVIDERS = [
  {
    id: "remove-bg",
    name: "remove.bg",
    priority: 1,
    costPerImage: 0.2,
    avgProcessingTime: 2000,
    supportedFormats: ["png", "jpg", "webp"],
  },
  {
    id: "openai-dalle",
    name: "OpenAI DALL-E",
    priority: 2,
    costPerImage: 0.4,
    avgProcessingTime: 4000,
    supportedFormats: ["png", "jpg"],
  },
];
```

### Smart Crop Providers

```typescript
const SMART_CROP_PROVIDERS = [
  {
    id: "openai-vision",
    name: "OpenAI Vision",
    priority: 1,
    costPerAnalysis: 0.05,
    avgProcessingTime: 1500,
    features: ["object-detection", "composition-analysis"],
  },
  {
    id: "google-vision",
    name: "Google Vision AI",
    priority: 2,
    costPerAnalysis: 0.03,
    avgProcessingTime: 1200,
    features: ["face-detection", "text-detection", "object-detection"],
  },
];
```

## Future Enhancements (Out of Scope)

### Advanced AI Features

- AI-powered mockup generation from text descriptions
- Automatic frame and background selection based on image content
- AI-driven typography suggestions and text placement
- Brand consistency checking using AI analysis
- Batch AI processing for multiple images

### AI Learning and Personalization

- User preference learning for AI suggestions
- Custom AI model training on user's design patterns
- Collaborative AI learning from team usage patterns
- AI-powered template recommendations based on usage history

### Enterprise AI Features

- Custom AI model integration for specific use cases
- On-premise AI processing for security-sensitive organizations
- Advanced AI analytics and insights for team optimization
- AI-powered compliance checking for brand guidelines

---

**Epic Owner:** Winston (Architect)
**Technical Lead:** Development Team
**Business Stakeholder:** Product Manager
**Timeline:** Sprint 11-12 (4 weeks)
**Priority:** P1 - Premium feature differentiation
**Next.js 15 Migration:** Complete architecture leveraging API routes for AI integration
