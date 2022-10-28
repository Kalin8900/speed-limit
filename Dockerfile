FROM node:alpine

# Create app directory
WORKDIR /usr/src/app


# Bundle app source
COPY . .

# Install app dependencies
RUN npm install

# Build app
RUN npm run build

# Expose port
EXPOSE 8080

# Run app
CMD [ "npm", "start" ]