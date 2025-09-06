# Multi-stage build for Vite application
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS production

# Set working directory
WORKDIR /app

# Install serve to run the application
RUN npm install -g serve

# Copy built application from builder stage (Vite builds to 'dist' folder)
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S viteuser -u 1001

# Change ownership
RUN chown -R viteuser:nodejs /app
USER viteuser

# Expose port (using 5173 for Vite)
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5173 || exit 1

# Start the application (serve from dist folder)
CMD ["serve", "-s", "dist", "-l", "5173"]

# Development stage
FROM node:22-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S viteuser -u 1001

# Change ownership
RUN chown -R viteuser:nodejs /app
USER viteuser

# Expose port (Vite dev server default)
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev"]