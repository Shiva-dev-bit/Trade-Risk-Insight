# Use Node.js Alpine base image
FROM node:alpine

# Create and set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json /app/

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the entire codebase to the working directory
COPY . /app/

# Expose the port your app runs on (replace <PORT_NUMBER> with your app's actual port)
ENV PORT=3002
EXPOSE 3002

# Define the command to start your application (replace "start" with the actual command to start your app)
CMD ["npm", "start"]
