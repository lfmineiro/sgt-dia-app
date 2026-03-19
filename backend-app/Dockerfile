# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma
COPY prisma.config.ts ./

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start command in development mode with file watching
CMD ["npm", "run", "dev"]
