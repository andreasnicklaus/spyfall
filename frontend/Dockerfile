FROM node:15-alpine as build
WORKDIR /app

COPY package.json package-lock.json ./
RUN NODE_ENV=production npm ci

COPY ./public ./public
COPY ./src ./src
RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=build /app/build .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]