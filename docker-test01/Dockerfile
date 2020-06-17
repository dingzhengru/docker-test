# Base image
# node:<version>, node:<version>-slim, node:<version>-alpine
FROM node:lts

# Create app directory
# WORKDIR /
WORKDIR /docker-app

# Install app dependencies
# COPY package.json /
COPY /package.json /docker-app
RUN npm install
# RUN npm cache clean 解決辦法: npm cache clean --force "no use"

# Bundle app source
COPY / /docker-app

EXPOSE 50001

CMD ["npm", "start"]