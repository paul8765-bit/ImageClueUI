# Use the NGINX image, which is hosted on Linux Alpine
FROM nginx:alpine

# Copy all files to the html folder, and set this as the current dir
COPY . /usr/share/nginx/html
WORKDIR /usr/share/nginx/html

# Use the Linux Alpine to install bash, nodejs, and npm
RUN apk update
RUN apk upgrade
RUN apk add bash
RUN apk add --update nodejs
RUN apk add --update npm

# Install mocha using npm
RUN npm install -g mocha

# Run the Mocha unit tests
RUN npm test