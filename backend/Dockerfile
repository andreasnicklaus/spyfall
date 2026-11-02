FROM node:26.12.1-alpine

COPY package.json package-lock.json ./

RUN NODE_ENV=production npm ci --prefer-offline

COPY ./src ./src
COPY ./public ./public

CMD npm run start