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

# Expose the correct port (your app runs on 3000)
EXPOSE 3000

# Start the server using dotenv and your prod env
CMD ["sh", "-c", "dotenv -e .env.prod -- node dist/server.js"]
