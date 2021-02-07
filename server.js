const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();
const projectsRouter = require("./data/routers/projectsRouter");
const actionsRouter = require("./data/routers/actionsRouter");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use(logger);

server.get('/', (req, res) => {
  res.send(`
    Hello World
  `);
});

server.use('/projects', projectsRouter);
server.use('/actions', actionsRouter);


function logger(req, res, next) {
  console.log('*** New Request ***\n  Method: ' + req.method + '\n  URL: ' + req.url + '\n  Time: ' + new Date())
  next()
}

module.exports = server;