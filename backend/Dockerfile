FROM node:current-alpine

COPY package.json package-lock.json ./
# Run `npm ci` _before_ copying the application in
RUN NODE_ENV=production npm ci

COPY ./src ./src

CMD node src/index.js