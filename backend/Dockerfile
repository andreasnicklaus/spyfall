FROM node:21-alpine

COPY package.json package-lock.json ./

RUN NODE_ENV=production npm ci

COPY ./src ./src

CMD npm run start