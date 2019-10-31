require('dotenv').config();
const express = require('express');

const postRouter = require('./data/routing/post-router');

const server = express();

server.use(express.json());
server.use('/api/posts', postRouter);

console.log(`message:`, process.env.MSG);
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server Running on ${port}`);
});
