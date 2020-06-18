FROM node:lts

WORKDIR /app

COPY ./package.json /app
RUN npm install

COPY . /app

ENV NODE_ENV production
ENV PORT 50001

EXPOSE 50001

CMD [ "npm", "start" ]