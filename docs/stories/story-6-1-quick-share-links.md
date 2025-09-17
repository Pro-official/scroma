# Story 6.1: Quick Share & Public Links

## Story Overview

**Epic:** Epic 6 - Advanced Collaboration & Sharing Features
**Story ID:** 6.1
**Priority:** High
**Status:** Ready for Development
**Estimated Effort:** 8 Story Points
**Sprint Assignment:** TBD

## User Story

**As a** content creator or developer,
**I want to** generate shareable links for my completed mockups,
**So that I can** quickly share my work with clients, stakeholders, or on social media without requiring them to download files.

## Story Context

### Existing System Integration
- **Integrates with:** Export system (Epic 5), Canvas state management (Epic 1)
- **Technology:** Next.js 15 with App Router + TypeScript, Zustand store extensions, Next.js API Routes
- **Follows pattern:** Existing modal pattern (export modal), URL generation utilities with Next.js API routes
- **Touch points:** Export pipeline, canvas data serialization, state persistence, Next.js API routes for share link generation

### Business Value
- Reduces friction in sharing workflow from 3+ steps (export → upload → share) to 1 click
- Enables viral growth through easy social media sharing with Next.js SEO optimization
- Supports team collaboration by eliminating file transfer dependencies
- Provides foundation for future premium team features with Next.js API infrastructure
- Leverages Next.js Image optimization for fast preview loading in shared links

## Acceptance Criteria

### Functional Requirements

1. **Share Button Integration**
   - Share button appears prominently in export modal alongside existing download options
   - Button is accessible via keyboard navigation with appropriate ARIA labels
   - Visual state clearly indicates when sharing is in progress vs. complete using Next.js client components

2. **Link Generation & Settings**
   - System generates unique, non-guessable URLs using Next.js API routes for secure processing
   - Link expiration options: 24 hours, 7 days, 30 days, never expire
   - Privacy settings: Public (anyone with link), Unlisted (not searchable), Private (password protected)

3. **Permission Controls**
   - Download toggle allows creator to enable/disable image downloads for viewers
   - View-only mode prevents modifications to shared mockups
   - Link deactivation option allows creators to revoke access at any time via Next.js API

4. **Share Analytics (Basic)**
   - View counter shows total number of times mockup has been accessed
   - Access timestamps display recent viewing activity (last 10 views)
   - Simple analytics dashboard accessible from user's mockup history

5. **Embedded Viewer Experience**
   - Responsive viewer works on desktop, tablet, and mobile devices with Next.js responsive design
   - Clean, branded interface without distracting UI elements
   - Zoom and pan controls for detailed mockup inspection
   - Optional download button based on creator's permission settings
   - Next.js Image optimization for fast loading of shared mockups

6. **URL Management**
   - Copy-to-clipboard functionality with success feedback
   - URL shortening for social media optimization (scroma.app/s/abc123) via Next.js API routes
   - QR code generation for easy mobile sharing
   - Direct social media sharing buttons (Twitter, LinkedIn, optional) with Next.js metadata optimization

7. **Performance & Reliability**
   - Link generation completes within 3 seconds for typical mockups using Next.js API routes
   - Shared viewer loads within 2 seconds on standard broadband with Next.js optimization
   - Works offline-first: viewer caches content for subsequent visits using Next.js service worker

### Integration Requirements

8. **Export System Compatibility**
   - Sharing functionality integrates seamlessly with existing export modal
   - Shared mockups maintain same quality and resolution as downloaded exports
   - Export settings (format, quality) apply to shared versions

9. **State Management Integration**
   - Sharing state persists in Zustand store with localStorage backup
   - Recent shares accessible from main application interface
   - Share history syncs across browser sessions for same user using Next.js client-side storage

10. **Canvas Data Preservation**
    - Shared mockups capture complete canvas state (image, frame, background, text)
    - Frame customizations and text styling preserved exactly
    - High-resolution rendering maintained for shared versions with Next.js Image optimization

### Quality Requirements

11. **Security & Privacy**
    - Shared URLs are cryptographically secure and non-enumerable via Next.js API routes
    - No personal data exposed in shared mockup metadata
    - Private links require additional authentication (password/access code)

12. **Accessibility Compliance**
    - All sharing controls meet WCAG AA standards
    - Shared viewer supports screen readers and keyboard navigation
    - High contrast mode available for shared content viewing

13. **Cross-Browser Compatibility**
    - Share generation works in Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
    - Shared viewer renders consistently across all supported browsers
    - Mobile sharing experience optimized for iOS Safari and Android Chrome

## Technical Implementation Notes

### Architecture Approach
- Extend existing export system with sharing pipeline using Next.js API routes
- Create new `SharingStore` slice in Zustand architecture
- Implement URL-based state hydration for shared viewer using Next.js App Router
- Use Next.js App Router for shared mockup routes with dynamic routing

### Next.js 15 API Routes Structure
```typescript
// app/api/share/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { mockupData, settings } = await request.json()

    // Generate secure share ID
    const shareId = generateSecureId()

    // Store mockup data securely
    await storeSharedMockup(shareId, {
      ...mockupData,
      settings,
      createdAt: new Date()
    })

    return NextResponse.json({
      shareId,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/shared/${shareId}`
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create share link' },
      { status: 500 }
    )
  }
}

// app/api/share/[shareId]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { shareId: string } }
) {
  const mockupData = await getSharedMockup(params.shareId)

  if (!mockupData || isExpired(mockupData)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(mockupData)
}
```

### State Management Extensions
```typescript
interface SharingState {
  sharedMockups: SharedMockup[]
  currentShare: ShareConfig | null
  isSharing: boolean
  shareHistory: ShareHistoryItem[]
}

interface ShareConfig {
  id: string
  title: string
  mockupData: CanvasExportData
  expiresAt: Date | null
  allowDownload: boolean
  isPasswordProtected: boolean
  password?: string
  analytics: ShareAnalytics
}
```

### Component Structure (Next.js App Router)
```
components/
├── sharing/
│   ├── share-modal.tsx              # Main sharing interface (use client)
│   ├── share-settings-panel.tsx     # Expiration, privacy, download settings
│   ├── share-link-display.tsx       # URL display with copy/QR features
│   ├── share-analytics-widget.tsx   # Basic view count and activity
│   ├── shared-mockup-viewer.tsx     # Public viewer for shared content
│   └── share-history-list.tsx       # User's sharing history management

app/
├── shared/
│   └── [shareId]/
│       ├── page.tsx                 # Shared mockup viewer page
│       ├── loading.tsx              # Loading UI
│       └── not-found.tsx           # 404 page for invalid shares
├── api/
│   └── share/
│       ├── route.ts                 # Create share endpoint
│       └── [shareId]/
│           ├── route.ts             # Get share data
│           └── analytics/
│               └── route.ts         # Track views
```

### Next.js App Router Implementation
```typescript
// app/shared/[shareId]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getSharedMockup } from '@/lib/share-api'
import SharedMockupViewer from '@/components/sharing/shared-mockup-viewer'

interface Props {
  params: { shareId: string }
}

export async function generateMetadata({ params }: Props) {
  const mockup = await getSharedMockup(params.shareId)

  if (!mockup) return { title: 'Mockup Not Found' }

  return {
    title: `${mockup.title} - Shared Mockup`,
    description: 'View this shared mockup created with our design tool',
    openGraph: {
      title: mockup.title,
      description: 'Shared mockup',
      images: [mockup.previewUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title: mockup.title,
      description: 'Shared mockup',
      images: [mockup.previewUrl],
    }
  }
}

export default async function SharedMockupPage({ params }: Props) {
  const mockup = await getSharedMockup(params.shareId)

  if (!mockup) {
    notFound()
  }

  return <SharedMockupViewer mockup={mockup} />
}
```

### Performance Considerations
- Lazy load sharing components to avoid impacting core export performance
- Use Next.js API Routes for secure URL generation and mockup data serialization
- Implement progressive image loading for shared viewer with Next.js Image component
- Cache shared mockup data in browser storage for return visits
- Leverage Next.js ISR (Incremental Static Regeneration) for frequently accessed shares

## Definition of Done

### Development Checklist
- [ ] Share button integrated into export modal with consistent styling using Next.js client components
- [ ] Next.js API routes implemented for secure URL generation with cryptographically secure random ID generation
- [ ] Expiration and permission settings functional with real-time preview
- [ ] Shared viewer responsive and accessible across all target devices using Next.js responsive design
- [ ] Copy-to-clipboard and QR code generation working reliably
- [ ] Basic analytics tracking implemented with privacy compliance via Next.js API routes

### Testing Checklist
- [ ] Unit tests cover sharing state management and URL generation using Next.js testing patterns
- [ ] Integration tests verify export-to-share workflow end-to-end including API routes
- [ ] Cross-browser testing completed on all supported platforms
- [ ] Accessibility testing with screen readers and keyboard navigation
- [ ] Performance testing confirms sharing adds <200ms to export process with Next.js optimization
- [ ] Security testing validates URL security and access control via API routes

### Quality Assurance
- [ ] UX review confirms sharing workflow intuitive for new users
- [ ] Performance monitoring shows no regression in core canvas operations
- [ ] Analytics implementation respects user privacy and GDPR compliance
- [ ] Documentation updated with sharing feature usage and API references for Next.js patterns
- [ ] Feature flags configured for controlled rollout and quick rollback

## Dependencies

### Upstream Dependencies
- **Epic 5 Story 5.1 (Export Modal)**: Share button placement and modal integration
- **Epic 1 Story 1.4 (State Management)**: Zustand store architecture for sharing state
- **Epic 1 Story 1.3 (Canvas Display)**: Canvas data serialization for sharing

### Parallel Dependencies
- **shadcn/ui components**: Modal, button, input, and form components for sharing interface
- **Next.js 15 App Router**: Routing infrastructure for shared mockup URLs and API routes
- **Tailwind CSS 4**: Styling system for sharing components and viewer

### Downstream Impact
- **Story 6.2 (Template Library)**: Will build on sharing infrastructure for template sharing
- **Story 6.3 (Team Workspaces)**: Team sharing features will extend this foundation
- **Future Analytics Epic**: Detailed usage analytics will build on basic sharing metrics

## Risk Assessment & Mitigation

### Primary Risk: Performance Impact on Export
**Risk:** Adding sharing functionality could slow down the core export process that users rely on daily.

**Mitigation:**
- Implement sharing as optional enhancement to existing export, not replacement
- Use Next.js API Routes for URL generation to avoid blocking main thread
- Lazy load sharing components until user explicitly accesses sharing features
- Performance monitoring with alerts if export time exceeds 3-second threshold
- Leverage Next.js optimization for faster processing

### Secondary Risk: URL Security and Abuse
**Risk:** Shared URLs could be discovered, enumerated, or used maliciously if not properly secured.

**Mitigation:**
- Use cryptographically secure random URL generation via Next.js API routes (UUID v4 + entropy)
- Implement rate limiting on URL generation and access using Next.js middleware
- Provide link expiration and deactivation controls for users
- Monitor for suspicious access patterns and implement automatic blocking

### Rollback Plan
- Feature flag allows instant disable of sharing functionality without deployment
- Sharing components isolated from core export system for easy removal
- Shared URL database designed for quick content removal if needed
- User communication plan prepared for feature rollback scenarios

## Success Metrics

### User Adoption
- **Target:** 30% of weekly active users try sharing feature within first month
- **Measurement:** Analytics tracking share button clicks and successful link generation via Next.js API

### User Engagement
- **Target:** Users who share mockups show 25% higher 7-day retention rate
- **Measurement:** Cohort analysis comparing sharing vs. non-sharing user retention

### Technical Performance
- **Target:** Sharing functionality adds <200ms to export process with Next.js optimization
- **Measurement:** Performance monitoring of export completion times before and after sharing

### Feature Quality
- **Target:** <5% of sharing attempts result in errors or failed link generation
- **Measurement:** Error tracking and user feedback on sharing reliability via Next.js API monitoring

## Future Enhancements (Out of Scope)

- Real-time collaboration on shared mockups using Next.js WebSocket integration
- Advanced analytics with geographic and referrer data via Next.js API routes
- Branded sharing pages for team accounts with Next.js custom domains
- API access for programmatic sharing using Next.js API routes
- Integration with social media platforms for direct posting via Next.js API
- Bulk sharing of multiple mockups
- Commenting and feedback system on shared mockups using Next.js real-time features