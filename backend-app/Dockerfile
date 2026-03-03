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

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Expose port
EXPOSE 3000

# Start command (adjust based on your actual start script)
CMD ["npm", "start"]
