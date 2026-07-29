# Multi-stage build for the analysis API.
#
# The API is the service that touches document bytes, so the runtime image is
# kept deliberately small: production dependencies only, no build toolchain, no
# source, and a non-root user.

FROM node:22-slim AS build
WORKDIR /repo

RUN corepack enable

# Copy only what the install needs first, so dependency layers cache across
# source-only changes.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/
COPY packages/validation/package.json packages/validation/
COPY packages/typescript-config/package.json packages/typescript-config/
COPY packages/eslint-config/package.json packages/eslint-config/

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY packages/validation packages/validation
COPY packages/typescript-config packages/typescript-config
COPY apps/api apps/api

RUN pnpm --filter @wg/validation build \
 && pnpm --filter @wg/api build \
 && pnpm deploy --filter @wg/api --prod --legacy /app

FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /repo/apps/api/dist ./dist
COPY --from=build /repo/apps/api/package.json ./package.json

# Never run the document-processing service as root.
USER node

# Render and most container hosts inject PORT; bind all interfaces so the
# platform's health checks can reach us.
ENV API_HOST=0.0.0.0
EXPOSE 3001

CMD ["node", "dist/index.js"]
