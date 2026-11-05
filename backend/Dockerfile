FROM node:26.13.0-alpine

COPY package.json package-lock.json ./

RUN NODE_ENV=production npm ci --prefer-offline

COPY ./src ./src
COPY ./public ./public

CMD npm run start