FROM node:20-alpine AS base
RUN apk add --no-cache git libc6-compat

FROM base AS builder
WORKDIR /app

WORKDIR /app/gaqno-erp
COPY gaqno-erp/package.json ./
# COPY gaqno-erp/package-lock.json ./
RUN npm config set fetch-timeout 1200000 && \
    npm config set fetch-retries 10 && \
    npm install --legacy-peer-deps

COPY gaqno-erp/ .
# PATCH: Fix unused @ts-expect-error in @gaqno-dev/frontcore
RUN find node_modules -name useDialogForm.ts -exec sed -i '/@ts-expect-error/d' {} +
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/gaqno-erp/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/gaqno-erp/.next/static ./.next/static
RUN mkdir -p ./public

USER nextjs
EXPOSE 3005
ENV PORT=3005
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
