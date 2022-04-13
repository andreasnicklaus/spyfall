FROM node:15-alpine

COPY package.json package-lock.json ./

RUN NODE_ENV=production npm ci

COPY ./src ./src

CMD node src/index.js