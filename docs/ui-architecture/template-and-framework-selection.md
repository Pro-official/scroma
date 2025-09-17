# Template and Framework Selection

Based on my analysis of the PRD and front-end specifications, here's the framework decision:

**Framework Decision:** Next.js 15 with TypeScript
**Rationale:** The PRD explicitly specifies Next.js 15 with TypeScript for SSG performance, AI integration readiness, and better developer experience. The UX spec builds on shadcn/ui components, which are Next.js compatible.

**Starter Template:** Next.js 15 + TypeScript
**Rationale:** The PRD specifies Next.js 15 for SSG performance and AI integration. This aligns with the performance requirements of sub-1s load times and 60fps canvas interactions, plus enables future AI features through API routes.

**UI Component Foundation:** shadcn/ui
**Rationale:** The UX specification explicitly states "ShadCN/UI Foundation: Leverage shadcn/ui components as the base system, extended with custom Scroma-specific components." Compatible with Next.js 15 and optimized for SSG.
