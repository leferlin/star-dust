FROM node:11.13-stretch-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# COPY package*.json ./

# RUN npm install
COPY app ./
RUN npm install socket.io
RUN npm install express
# RUN npm install --verbose
# If you are building your code for production
# RUN npm ci --only=production

# -------------------
# COPY game ./
# RUN npm install --production
# RUN npm build
# -------------------

# Bundle app source
# COPY . .

EXPOSE 8082
CMD [ "npm", "start" ]
