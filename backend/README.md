# Spyfall WebSocket server

Node.js WebSocket server (`ws`) for room management and data sharing between players.

## Run

Install dependencies:

```bash
npm ci
```

Start the server (listens on port `8080` by default):

```bash
npm start
```

Override the port with the `PORT` environment variable:

```bash
PORT=9000 npm start
```

Run a syntax check:

```bash
node --check src
```

## Docker

Build the image:

```bash
docker build -t spyfall-backend .
```

Run it:

```bash
docker run -p 8080:8080 spyfall-backend
```

A published image is available on Docker Hub as `anicklaus/spyfall_backend`.

## Deployment notes

- In production the frontend connects to `wss://<host>/ws`, so the backend must be reachable
  behind a reverse proxy on that path.
- The server is built and pushed by `.github/workflows/server.yml`.