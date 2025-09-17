# Project Brief: Scroma - Screenshot Mockup Tool

## Executive Summary

Scroma is a web-based screenshot mockup tool that transforms basic screenshots into professional presentations through intuitive editing capabilities including frames, gradient backgrounds, text overlays, and visual enhancements. The tool addresses the growing need for quick, professional-looking mockups among developers, designers, and marketers who currently rely on complex design software or expensive specialized tools for simple screenshot enhancement tasks.

## Problem Statement

**Current State:** Content creators, developers, and marketers frequently need to present screenshots professionally but face significant barriers:

- Complex design tools (Photoshop, Figma) require steep learning curves for simple tasks
- Existing mockup tools are either too expensive ($20+/month) or too limited in customization
- Manual mockup creation is time-consuming (30+ minutes per image)
- Inconsistent branding across screenshot presentations
- No batch processing capabilities for multiple images

**Impact:** Teams spend 3-5 hours weekly on screenshot preparation, reducing productivity and delaying content publication. Poor presentation quality affects conversion rates and professional credibility.

**Why Now:** With the rise of micro SaaS, product demos, and social media marketing, the demand for quick, professional screenshot mockups has increased 300% in the past two years.

## Proposed Solution

Scroma provides a browser-based canvas editor specifically optimized for screenshot enhancement with:

**Core Approach:**

- Drag-and-drop simplicity with powerful customization
- Pre-designed templates for common use cases
- Real-time preview with instant export capabilities
- Focus on speed and ease-of-use over comprehensive design features

**Key Differentiators:**

- **Speed:** Create professional mockups in under 2 minutes
- **Specialization:** Built specifically for screenshots, not general design
- **Batch Processing:** Apply styles to multiple images simultaneously
- **Brand Consistency:** Save and reuse brand kits across projects

## Target Users

### Primary User Segment: Solo Creators & Small Teams

**Profile:** Independent developers, content creators, small startup teams (1-10 people)
**Demographics:** 25-40 years old, technically savvy but not design-focused
**Current Behavior:** Currently use Canva, basic photo editors, or skip mockups entirely
**Pain Points:**

- Need quick results without design expertise
- Budget constraints for professional tools
- Inconsistent visual branding
- Time pressure for content creation

**Goals:** Create professional-looking screenshots quickly for social media, documentation, and product demos.

### Secondary User Segment: Marketing Teams

**Profile:** Marketing professionals at growing companies (10-100 employees)
**Current Behavior:** Use combination of design tools and dedicated mockup services
**Pain Points:**

- Need for brand consistency across team
- Batch processing requirements
- Integration with existing workflows

## Goals & Success Metrics

### Business Objectives

- **Revenue:** $5K MRR within 6 months, $25K MRR within 12 months
- **User Acquisition:** 1,000 active users by month 6, 5,000 by month 12
- **Conversion Rate:** 5% freemium to paid conversion rate
- **Customer Retention:** 80% monthly retention for paid users

### User Success Metrics

- **Task Completion Time:** Average mockup creation under 2 minutes
- **User Satisfaction:** 4.5+ star rating on product review platforms
- **Feature Adoption:** 70% of users utilize at least 3 core features
- **Return Usage:** 60% of users create multiple mockups within first week

### Key Performance Indicators (KPIs)

- **Daily Active Users (DAU):** Target 500 DAU by month 6
- **Monthly Recurring Revenue (MRR):** Track monthly growth rate of 20%+
- **Customer Acquisition Cost (CAC):** Keep below $15 per acquired user
- **Net Promoter Score (NPS):** Maintain score above 50

## Full Project Scope

### Core Features (Phase 1)

- **File Upload System:** Drag-and-drop with paste support for PNG, JPG, WebP formats
- **Frame Library:** 20+ pre-designed frames (browser, phone, tablet, custom colors, device mockups)
- **Background System:** Advanced gradient builder with 50+ presets, patterns, and solid colors
- **Text Overlays:** Complete text tools with advanced typography, effects, and positioning
- **Resize & Position:** Drag-to-resize with smart snapping, grid alignment, and aspect ratio preservation
- **Export Functionality:** High-quality PNG/JPG export with batch processing and quality settings
- **Real-time Preview:** Instant visual feedback for all editing actions with undo/redo

### Advanced Features (Phase 2)

- **User Accounts:** Save projects, preferences, and custom templates
- **Cloud Storage:** Project synchronization across devices
- **Advanced Animation:** Subtle animations and transitions for export
- **Team Collaboration:** Share templates and brand kits
- **Preset Management:** Save and organize custom frame/background combinations
- **Advanced Typography:** Web fonts, text effects, and advanced formatting
- **Batch Operations:** Apply styles to multiple images simultaneously
- **AI Features:** Smart background removal, intelligent cropping, and design suggestions
- **API Integration:** Connect with design tools and content management systems

### Launch Success Criteria

- Users can complete advanced mockups with multiple elements in under 3 minutes
- 90% of users successfully create and export professional mockups
- Support for all major use cases: social media, documentation, marketing, presentations
- Tool loads and responds within 2 seconds on standard broadband
- Compatible with Chrome, Firefox, Safari, and Edge browsers

## Future Expansion Vision

### Phase 2 Features

- **User Accounts:** Save projects and access from multiple devices
- **Template Library:** Expand to 50+ professionally designed templates
- **Batch Processing:** Apply styles to multiple screenshots simultaneously
- **Brand Kits:** Save color schemes, fonts, and styles for consistency
- **Advanced Effects:** Shadows, 3D perspective, and realistic device frames
- **AI-Powered Features:** Automated background removal, smart cropping, design suggestions

### Long-term Vision

Transform Scroma into the go-to platform for all screenshot enhancement needs, expanding to include video mockups, animated presentations, and team collaboration features. Build a marketplace for user-generated templates and integrate with popular productivity tools.

### Expansion Opportunities

- **Enterprise Features:** Team accounts, advanced branding, and analytics
- **Marketplace:** User-generated templates and frame collections
- **Integrations:** Zapier, Slack, and design tool plugins
- **White-label Solutions:** Customizable versions for agencies and larger companies
- **AI Marketplace:** Third-party AI tools and services integration

## Technical Considerations

### Platform Requirements

- **Target Platforms:** Web browsers (desktop primary, tablet secondary)
- **Browser Support:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Performance Requirements:** Sub-2 second load times, 60fps canvas interactions

### Technology Preferences

- **Frontend Framework:** Next.js 15 with TypeScript for type safety, SSG performance, and AI integration readiness
- **UI Framework:** Next.js 15 with automatic compiler optimizations for canvas operations
- **Styling:** Tailwind CSS for rapid UI development and consistency
- **Canvas Manipulation:** Fabric.js for powerful 2D canvas operations
- **State Management:** Zustand for lightweight, scalable state management
- **Build System:** Next.js 15 with Turbopack for lightning-fast development and SSG optimization

### Architecture Considerations

- **Repository Structure:** Monorepo structure for potential future mobile apps
- **Service Architecture:** Next.js SSG with API routes for future AI features (client-side processing initially)
- **Image Processing:** Browser-based using Canvas API and Web Workers for performance
- **Storage:** Local storage for temporary projects, IndexedDB for larger data
- **CDN Strategy:** Image assets served via CDN for global performance
- **AI Integration:** API routes ready for OpenAI, Anthropic, and other AI service integration

## Constraints & Assumptions

### Constraints

- **Budget:** Bootstrap development with minimal initial investment
- **Timeline:** Full project launch target within 16 weeks
- **Resources:** Single developer initially, potential design contractor
- **Technical:** Browser-first solution with server-side capabilities for AI features

### Key Assumptions

- Users prefer browser-based tools over desktop applications for this use case
- Freemium model will drive sufficient conversion to paid plans
- Next.js API routes enable seamless AI integration while maintaining static site benefits
- Modern browsers provide sufficient performance for real-time image editing
- Target market is willing to pay $5-15/month for specialized tool
- AI features will drive premium conversions and user retention

## Risks & Open Questions

### Key Risks

- **Performance Limitations:** Browser-based image processing may be slower than desktop alternatives
- **Competition Response:** Established players (Canva, Figma) may add similar features quickly
- **User Adoption:** Users may not see sufficient value over existing free alternatives
- **Technical Complexity:** Canvas manipulation and export quality may be more challenging than anticipated
- **AI Integration Costs:** Third-party AI services may impact pricing model

### Open Questions

- What file size limits are acceptable for browser-based processing?
- How important is offline functionality for the target market?
- What advanced image editing features should be prioritized (crop, brightness, contrast, filters)?
- What pricing model will optimize for both user adoption and revenue?
- How should we phase the rollout of collaboration features?
- What AI integrations would provide the most value to users?
- How should AI processing costs be passed to users?

### Areas Needing Further Research

- Competitive pricing analysis for similar tools
- User testing on canvas interaction patterns
- Browser performance benchmarking with large images
- Market validation through landing page and early user interviews
- AI service cost analysis and pricing strategies
- User willingness to pay for AI-powered features

## Next Steps

### Immediate Actions

1. Create high-fidelity mockups of core user interface
2. Set up development environment with Next.js 15 tech stack
3. Build basic file upload and canvas display functionality
4. Implement frame application system
5. Develop export functionality with quality options
6. Create landing page for early user feedback collection
7. Conduct user testing sessions with target demographic
8. Research AI service integration options and pricing

### PM Handoff

This Project Brief provides the full context for Scroma - Screenshot Mockup Tool with Next.js 15 architecture optimized for future AI integration. Please start in 'PRD Generation Mode', review the brief thoroughly to work with the user to create the PRD section by section as the template indicates, asking for any necessary clarification or suggesting improvements.
