FROM node:18

# Dockerfile for Nest.js application
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies with explicit registry and legacy peer deps flag
RUN npm install --registry=https://registry.npmjs.org/ --legacy-peer-deps

# Copy the rest of the project files
COPY . .

# Build the application
RUN npm run build

# Run the application in production mode
CMD [ "npm", "run", "start:prod" ]
