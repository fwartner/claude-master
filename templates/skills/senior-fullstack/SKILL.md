---
name: senior-fullstack
description: When the user needs end-to-end TypeScript development — from database schema through API layer to UI — with tRPC, Prisma, Next.js, authentication, and deployment.
---

# Senior Fullstack Engineer

## Overview

Deliver complete, end-to-end TypeScript applications covering database design, API layer, frontend UI, authentication, and deployment. This skill specializes in the modern TypeScript full-stack: Next.js App Router, tRPC for type-safe APIs, Prisma for database access, and production deployment with monitoring.

## Process

### Phase 1: Data Layer
1. Design database schema with Prisma
2. Define relationships and indexes
3. Create seed data for development
4. Set up migrations workflow
5. Implement repository pattern for data access

### Phase 2: API Layer
1. Define tRPC routers and procedures
2. Implement input validation with Zod
3. Add authentication middleware
4. Build business logic in service layer
5. Add error handling and logging

### Phase 3: UI Layer
1. Build pages with Server Components (default)
2. Add Client Components for interactivity
3. Connect to API via tRPC hooks
4. Implement optimistic updates
5. Add loading and error states

### Phase 4: Production
1. Set up authentication (NextAuth.js / Clerk / Lucia)
2. Configure deployment (Vercel / Docker)
3. Add monitoring and error tracking
4. Implement CI/CD pipeline
5. Performance audit

## Full-Stack TypeScript Patterns

### tRPC Router Definition
```typescript
// server/routers/user.ts
export const userRouter = router({
  list: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(100).default(20),
      search: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const where = search ? { name: { contains: search, mode: 'insensitive' } } : {};
      const [users, total] = await Promise.all([
        ctx.db.user.findMany({
          where,
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: { createdAt: 'desc' },
        }),
        ctx.db.user.count({ where }),
      ]);
      return { users, total, totalPages: Math.ceil(total / pageSize) };
    }),

  create: protectedProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.create({ data: input });
    }),
});
```

### Prisma Schema Design
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      Role     @default(USER)
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
  @@index([createdAt])
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId  String
  tags      Tag[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([authorId])
  @@index([published, createdAt])
}

enum Role {
  USER
  ADMIN
}
```

### Database to UI Pipeline
```
Prisma Schema → Prisma Client (types) → tRPC Router → tRPC Hooks → React Components
     ↓                  ↓                     ↓              ↓              ↓
  Migration        Type-safe DB          Validated API    Auto-typed    Rendered UI
                   queries               with Zod         queries
```

## Authentication / Authorization Patterns

### Auth Strategy Selection
| Solution | Best For | SSR Support |
|---|---|---|
| NextAuth.js (Auth.js) | OAuth providers, JWT/session | Yes |
| Clerk | Fast setup, managed service | Yes |
| Lucia | Custom, lightweight, self-hosted | Yes |
| Supabase Auth | Supabase ecosystem | Yes |

### Authorization Patterns
```typescript
// Role-based middleware in tRPC
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.session.user.role !== 'ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

// Resource-level authorization
const ownerProcedure = protectedProcedure.use(async ({ ctx, next, rawInput }) => {
  const input = rawInput as { id: string };
  const resource = await ctx.db.post.findUnique({ where: { id: input.id } });
  if (resource?.authorId !== ctx.session.user.id) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx });
});
```

## Project Structure

```
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth route group
│   │   ├── (dashboard)/        # Protected route group
│   │   ├── api/trpc/[trpc]/    # tRPC handler
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── server/
│   │   ├── db.ts               # Prisma client singleton
│   │   ├── trpc.ts             # tRPC init
│   │   ├── routers/            # tRPC routers
│   │   └── services/           # Business logic
│   ├── components/
│   │   ├── ui/                 # Design system atoms
│   │   └── features/           # Feature components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Shared utilities
│   │   ├── trpc.ts             # tRPC client
│   │   ├── auth.ts             # Auth configuration
│   │   └── validators.ts       # Zod schemas
│   └── types/                  # Shared type definitions
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── docker-compose.yml
```

## Deployment Pipeline

### Vercel Deployment
```
Git Push → GitHub Actions CI (lint, test, type-check) → Vercel Build →
Preview Deploy (PR) / Production Deploy (main)
```

### Docker Deployment
```dockerfile
FROM node:20-alpine AS base
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm prisma generate
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

## Monitoring Checklist

- [ ] Error tracking (Sentry) with source maps
- [ ] Performance monitoring (Vercel Analytics or custom)
- [ ] Database query performance (Prisma metrics)
- [ ] API endpoint latency and error rates
- [ ] Uptime monitoring (external ping)
- [ ] Log aggregation with structured logging
- [ ] Alerting for error rate spikes and latency degradation

## Key Principles

- Single language (TypeScript) from database to browser
- Type safety across the entire stack (no runtime type mismatches)
- Server Components by default, Client Components by necessity
- Validate all inputs at the API boundary with Zod
- Database indexes for every query pattern
- Environment-based configuration (no hard-coded values)

## Anti-Patterns

- Raw SQL in components (use Prisma through tRPC)
- Client-side data fetching when Server Components work
- Sharing Prisma client directly with frontend code
- Missing database indexes on foreign keys and filtered columns
- Storing auth tokens in localStorage (use httpOnly cookies)
- Skipping input validation ("TypeScript will catch it")
- Monolithic tRPC routers (split by domain)

## Skill Type

**RIGID** — Follow the four-phase process. Type safety across the stack is non-negotiable. All API inputs must be validated with Zod. Database schema changes must use migrations.
