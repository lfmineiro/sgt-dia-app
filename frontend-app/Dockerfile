# Frontend Dockerfile - Development
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Vite port
EXPOSE 5173

# Start Vite dev server with host flag
# Host is need beacuse Docker expose the door to out of container
CMD ["npm", "run", "dev", "--", "--host"]
