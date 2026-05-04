# Use the official Node.js 18 image
FROM node:24-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --package-import-method copy --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1


# Build arguments for environment variables
ARG MONGODB="mongodb+srv://chouhanrugs:wcnWRC3QAXsOaWrU@chouhanrugs.vpli7um.mongodb.net/ecom?retryWrites=true&w=majority"
ARG MONGODB_DB="ecom"
ARG AUTH_URL="https://chouhan.yashjha.dev"
ARG NEXTAUTH_SECRET="{O^:,b!\"$8qBET_vk%;IP$Tl3`ut3!'"
ARG GOOGLE_CLIENT_ID="1004242814906-pqq7eoi3932lu1304g5jo9b8jcpkg4r8.apps.googleusercontent.com"
ARG GOOGLE_CLIENT_SECRET="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"
ARG CONFIG_ENCRYPTION_KEY="0ad0f37af22acfa5cd6466e58e0ff70597eac90ff542c3adeb2a68c296b986e2"
ARG BETTER_AUTH_SECRET="37cde01351a74e3840fc7155de4807416cad8bfaa832131ea6457e7e76d5f140"

# Set environment variables for build
ENV MONGODB=$MONGODB \
  MONGODB_DB=$MONGODB_DB \
  AUTH_URL=$AUTH_URL \
  NEXTAUTH_SECRET=$NEXTAUTH_SECRET \
  GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID \
  GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET \
  CONFIG_ENCRYPTION_KEY=$CONFIG_ENCRYPTION_KEY \
  BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET

# Build the application (not standalone)
RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else npm run build; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

COPY start.sh ./start.sh

# Make start script executable
RUN chmod +x ./start.sh

# Set the correct permission for prerender cache
RUN mkdir -p .next && chown nextjs:nodejs .next

# Change to nextjs user
USER nextjs

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"


# Runtime environment variables
ENV MONGODB="mongodb+srv://chouhanrugs:wcnWRC3QAXsOaWrU@chouhanrugs.vpli7um.mongodb.net/ecom?retryWrites=true&w=majority"
ENV MONGODB_DB="ecom"
ENV AUTH_URL="https://chouhan.yashjha.dev"
ENV NEXTAUTH_SECRET="{O^:,b!\"$8qBET_vk%;IP$Tl3`ut3!'"
ENV GOOGLE_CLIENT_ID="1004242814906-pqq7eoi3932lu1304g5jo9b8jcpkg4r8.apps.googleusercontent.com"
ENV GOOGLE_CLIENT_SECRET="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"
ENV CONFIG_ENCRYPTION_KEY="0ad0f37af22acfa5cd6466e58e0ff70597eac90ff542c3adeb2a68c296b986e2"
ENV BETTER_AUTH_SECRET="37cde01351a74e3840fc7155de4807416cad8bfaa832131ea6457e7e76d5f140"

# Start the application with PM2
# Start the application with PM2
CMD ["./start.sh"]
