# Use the NGINX image, which is hosted on Linux Alpine
FROM nginx:alpine
EXPOSE 80
EXPOSE 443

# Copy all files to the html folder, and set this as the current dir
COPY . /usr/share/nginx/html
WORKDIR /usr/share/nginx/html

# Remove the default Nginx configuration file and add cert directory
RUN rm -v /etc/nginx/nginx.conf
 
# Add ngnix config file
ADD nginx.conf /etc/nginx/
 
# Add certifcate (crt and key)
#ADD ca_bundle.crt /etc/nginx/certs/
#ADD certificate.crt /etc/nginx/certs/
#ADD private.key /etc/nginx/certs/
ADD ca_bundle.crt /etc/nginx/certs/
ADD certificate.crt /etc/nginx/certs/
ADD private.key /etc/nginx/certs/

# Add mime.types 
ADD mime.types /etc/nginx/conf/

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