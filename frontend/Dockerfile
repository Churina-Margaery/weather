# Build stage
FROM node:23-slim AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

ARG VITE_WEATHER_SERVER
ENV VITE_WEATHER_SERVER=${VITE_WEATHER_SERVER}

# Build the application
RUN npx vite build

# Production stage
FROM nginx:alpine

# Copy built files from build stage to nginx
COPY --from=build /app/dist /app

RUN chmod -R 755 /app

# Copy nginx configuration if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]