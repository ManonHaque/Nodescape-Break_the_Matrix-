# Step 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Step 2: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Install pnpm again in this stage
RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY . .

RUN pnpm build

# Step 3: Production runtime
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]
