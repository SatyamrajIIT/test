# Production-ready Dockerfile for Appwrite
# Build: Multi-stage for frontend + backend
# This MUST work on Appwrite without caching issues

FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy frontend files
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci --legacy-peer-deps && npm cache clean --force

# Copy all frontend source
COPY frontend ./frontend

# Build frontend - this creates frontend/dist
RUN cd frontend && npm run build

# Verify dist exists
RUN ls -la frontend/dist/ || (echo "ERROR: frontend/dist not created!" && exit 1)

# ============================================================
# FINAL STAGE: Backend + Frontend
# ============================================================
FROM node:18-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --production --legacy-peer-deps && npm cache clean --force

# Copy backend source
COPY backend/src ./backend/src
COPY backend/config ./backend/config 2>/dev/null || true

# Copy built frontend from builder
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Verify files exist
RUN echo "=== Checking files ===" && \
    ls -la backend/src/server.js && \
    ls -la backend/src/app.js && \
    ls -la frontend/dist/ && \
    echo "=== All files ready ==="

# Set working directory
WORKDIR /app

# Port
EXPOSE 3000

# Health check - simplified
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=2 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start server
# Explicitly set NODE_ENV and other critical vars
CMD ["sh", "-c", "NODE_ENV=production node backend/src/server.js"]