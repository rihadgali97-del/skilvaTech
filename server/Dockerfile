FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm prune --omit=dev

FROM node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache dumb-init wget \
  && addgroup -g 1001 -S nodejs \
  && adduser -S skilvatech -u 1001

COPY --from=builder --chown=skilvatech:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=skilvatech:nodejs /app/package*.json ./
COPY --from=builder --chown=skilvatech:nodejs /app/prisma ./prisma
COPY --from=builder --chown=skilvatech:nodejs /app/src ./src

RUN mkdir -p logs && chown skilvatech:nodejs logs

USER skilvatech

EXPOSE 5000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/server.js"]
