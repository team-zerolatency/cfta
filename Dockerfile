FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat curl
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# ==========================================
# 1. API Service (Express Backend)
# ==========================================
FROM base AS api
WORKDIR /app
COPY . .

RUN cp .env.example .env
ENV DATABASE_URL="postgresql://cfta_user:cfta_secure_password@postgres:5432/cfta_db?schema=public"

RUN pnpm install --frozen-lockfile
RUN pnpm --filter=@cfta/database db:generate
RUN pnpm --filter=api build

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

HEALTHCHECK --interval=10s --timeout=5s --start-period=5s CMD curl -f http://localhost:4000/health || exit 1
CMD ["pnpm", "--filter=api", "exec", "tsx", "src/index.ts"]

# ==========================================
# 2. Web Service (Next.js Frontend)
# ==========================================
FROM base AS web
WORKDIR /app
COPY . .

RUN cp .env.example .env
ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm install --frozen-lockfile
RUN pnpm --filter=web build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s CMD curl -f http://localhost:3000/ || exit 1
CMD ["pnpm", "--filter=web", "start"]
