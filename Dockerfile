FROM node:20-alpine AS base
RUN apk add --no-cache git libc6-compat

FROM base AS builder
WORKDIR /app

COPY package.json ./
COPY .npmrc* ./
ARG NPM_TOKEN
RUN if [ -z "$NPM_TOKEN" ] || [ "$NPM_TOKEN" = "REPLACE_WITH_NPM_TOKEN" ]; then \
    echo "ERROR: NPM_TOKEN must be set in Dokploy build arguments (GitHub PAT with read:packages)."; exit 1; \
    fi && \
    printf '%s\n' "@gaqno-development:registry=https://npm.pkg.github.com" "//npm.pkg.github.com/:_authToken=$NPM_TOKEN" > .npmrc
RUN --mount=type=cache,target=/root/.npm \
    npm config set fetch-timeout 1200000 && \
    npm config set fetch-retries 10 && \
    npm install --legacy-peer-deps --include=dev
ARG GAQNO_CACHE_BUST
RUN npm update @gaqno-development/frontcore @gaqno-development/types --legacy-peer-deps 2>/dev/null || true

COPY . .
RUN mkdir -p public
# PATCH: Fix unused @ts-expect-error in @gaqno-development/frontcore
RUN find node_modules -name useDialogForm.ts -exec sed -i '/@ts-expect-error/d' {} +
ENV NODE_ENV=production
RUN npm run build

FROM nginx:alpine AS runner
WORKDIR /app

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/public /usr/share/nginx/html/public

RUN echo 'server { listen 3004; server_name _; root /usr/share/nginx/html; index index.html; absolute_redirect off; \
    location = /assets/remoteEntry.js { alias /usr/share/nginx/html/assets/remoteEntry.js; add_header Cache-Control "no-cache"; add_header CDN-Cache-Control "no-store"; add_header Access-Control-Allow-Origin "*"; } \
    location = /erp/assets/remoteEntry.js { alias /usr/share/nginx/html/assets/remoteEntry.js; add_header Cache-Control "no-cache"; add_header CDN-Cache-Control "no-store"; add_header Access-Control-Allow-Origin "*"; } \
    location /erp/assets/ { alias /usr/share/nginx/html/assets/; add_header Cache-Control "public, immutable"; add_header Access-Control-Allow-Origin "*"; } \
    location /assets/ { alias /usr/share/nginx/html/assets/; add_header Cache-Control "public, immutable"; add_header Access-Control-Allow-Origin "*"; } \
    location / { return 302 /; } }' > /etc/nginx/conf.d/default.conf

RUN mkdir -p /etc/nginx/snippets && \
    printf 'add_header X-Frame-Options "SAMEORIGIN" always;\nadd_header X-Content-Type-Options "nosniff" always;\nadd_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;\nadd_header Referrer-Policy "strict-origin-when-cross-origin" always;\n' > /etc/nginx/snippets/security-headers.conf && \
    sed -i 's/server {/server { server_tokens off; include \/etc\/nginx\/snippets\/security-headers.conf;/' /etc/nginx/conf.d/default.conf

EXPOSE 3004
CMD ["nginx", "-g", "daemon off;"]
