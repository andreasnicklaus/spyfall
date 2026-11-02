# Spyfall Webapp

React frontend for the [Spyfall](../README.md) party game. Players host or join a room and
play over WebSockets.

## Tech stack

- React 19 & React Router 7
- Material UI 9
- socket.io-client
- Hallmark design system (tokens and styles in `src/styles/`)

## Development

Install dependencies:

```bash
npm ci
```

Run the dev server (http://localhost:3000):

```bash
npm start
```

Run tests:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

## Deployment

The frontend is deployed to GitHub Pages at https://spyfall.andreasnicklaus.de via
`.github/workflows/pages.yml`. The workflow builds the app, copies `index.html` to `404.html`
for client-side routing, and creates the CNAME file.

---

# IMPORTANT!

The game is based on websockets and data sent through the server by the game leader.
Once the game leader leaves a game, a lot of unwanted behaviour can occur.
You might need to restart the game.
