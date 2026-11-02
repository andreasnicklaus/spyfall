// Bot / crawler detection helpers.
//
// The backend is a WebSocket server, but crawlers and automated clients may
// still attempt to connect. This module centralises the User-Agent based
// detection so it can be reused by the HTTP handler and the WebSocket handshake
// verifier, and unit-tested independently of a running server.

const BOT_PATTERNS = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /slurp/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /linkedinbot/i,
    /whatsapp/i,
    /telegrambot/i,
    /discordbot/i,
    /preview/i,
    /wget/i,
    /curl/i,
    /python-requests/i,
    /httpclient/i,
    /scrapy/i,
    /headless/i,
    /phantomjs/i,
    /puppeteer/i,
    /playwright/i,
    /selenium/i,
];

function isBot(userAgent) {
    if (!userAgent || typeof userAgent !== "string") return false;
    return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

module.exports = { isBot, BOT_PATTERNS };
module.exports.isBot = isBot;
module.exports.BOT_PATTERNS = BOT_PATTERNS;
