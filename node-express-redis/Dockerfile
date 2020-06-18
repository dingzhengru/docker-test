FROM node:lts

WORKDIR /app

COPY ./package.json /app
RUN npm install

COPY . /app

EXPOSE 50001

CMD [ "npm", "start" ]