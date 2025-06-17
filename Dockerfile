# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port
EXPOSE 80

# Start the server
CMD ["sh", "-c", "dotenv -e .env.prod -- node dist/server.js"]

