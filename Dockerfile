ARG ALPINE_VERSION=3.24
ARG NODEJS_VERSION=24.19.0

# Stage 1: Install dependencies (Bun as package manager only)
FROM oven/bun:slim AS install

# install dependencies into temp directory
# this will cache them and speed up future builds
RUN mkdir -p /temp/dev

COPY package.json /temp/dev
COPY bun.lock /temp/dev

RUN cd /temp/dev && bun install --frozen-lockfile

# Stage 2: Build
FROM node:${NODEJS_VERSION}-alpine${ALPINE_VERSION} AS builder

RUN mkdir -p /temp/prod

COPY . /temp/prod
COPY --from=install /temp/dev/node_modules /temp/prod/node_modules

RUN cd /temp/prod && npm run build

# Stage 3: Runtime (fresh minimal image, Node only)
FROM alpine:${ALPINE_VERSION} AS release

WORKDIR /app

# Add required binaries
RUN apk add --no-cache libstdc++ dumb-init \
    && addgroup -g 1000 node && adduser -u 1000 -G node -s /bin/sh -D node \
    && chown node:node ./

COPY --from=builder /usr/local/bin/node /usr/local/bin/
COPY --from=builder /usr/local/bin/docker-entrypoint.sh /usr/local/bin/

ENTRYPOINT ["docker-entrypoint.sh"]

USER node

# Uploads dir is mounted as a volume in docker-compose
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads

COPY --from=builder --chown=node:node /temp/prod/.output ./.output

EXPOSE 3000

ENV NODE_ENV=production

# Run with dumb-init to not start node with PID=1, since Node.js was not designed to run as PID 1
CMD ["dumb-init", "node", ".output/server/index.mjs"]
