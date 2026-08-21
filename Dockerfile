# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
COPY frontend/package*.json ./
RUN npm ci --no-audit --no-fund
COPY frontend ./
RUN npm run build

# Stage 2: Install backend dependencies
FROM node:20-alpine AS backend-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# Stage 3: Final production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=384

# Copy backend dependencies
COPY --from=backend-deps /app/backend/node_modules ./backend/node_modules

# Copy backend source
COPY backend/package*.json ./backend/
COPY backend/src ./backend/src
COPY backend/scripts ./backend/scripts

# Copy frontend build artifacts (now in dist instead of out)
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

WORKDIR /app/backend
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:4000/api/health || exit 1
CMD ["npm", "start"]
