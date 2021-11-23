const express = require("express");
const { json } = require("express");

const server = express();

server.use(json());

module.exports = server;
