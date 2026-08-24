#!/usr/bin/env node

const { readFileSync } = require("node:fs");
const { parseTweet } = require("twitter-text");

const text = readFileSync(0, "utf8").normalize("NFC");
const result = parseTweet(text);

process.stdout.write(
  `${JSON.stringify({
    valid: result.valid,
    weightedLength: result.weightedLength,
  })}\n`,
);
