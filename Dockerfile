# Multi-stage build: Build frontend first, then serve with backend
FROM node:18-alpine as frontend-builder

WORKDIR /app/frontend

# Copy frontend
COPY frontend/package*.json ./
RUN npm ci

COPY frontend ./

# Build the frontend
RUN npm run build

# Final stage: Run backend + serve frontend
FROM node:18-alpine

WORKDIR /app

# Install production dependencies for backend only
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --production

# Copy backend source
COPY backend/src ./src
COPY backend/config ./config 2>/dev/null || true
COPY backend/database ./database 2>/dev/null || true
COPY backend/scripts ./scripts 2>/dev/null || true

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Set working directory to app root
WORKDIR /app

# Expose port (Appwrite will map this)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start backend server
CMD ["node", "backend/src/server.js"]
