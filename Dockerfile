FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

# Build-time env: SITE_URL is consumed by src/app/robots.ts, sitemap.ts, and
# the discovery generator for absolute URLs. Passed via --build-arg from cloudbuild.yaml.
ARG SITE_URL
ENV SITE_URL=$SITE_URL

COPY package*.json ./
RUN npm ci

COPY . .

# prebuild (generate-discovery) runs automatically before `next build`.
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY --from=builder /usr/src/app/.next/standalone ./
COPY --from=builder /usr/src/app/.next/static ./.next/static
COPY --from=builder /usr/src/app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
