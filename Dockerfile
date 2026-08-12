# Stage 1: Build
FROM oven/bun:slim AS builder

WORKDIR /app

# Cache packages installation
COPY package.json ./
COPY bun.lock ./

# Install dependencies
RUN --mount=type=cache,target=~/.bun/install/cache \
  bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Stage 2: Run
FROM oven/bun:distroless AS runtime

WORKDIR /app

# Copy built output from the build stage
COPY --from=builder /app/.output ./.output

# Copy package.json so bun can resolve the scripts
COPY --from=builder /app/package.json ./package.json

# Expose the configured port
EXPOSE 3000

CMD ["bun", "run", "start"]
