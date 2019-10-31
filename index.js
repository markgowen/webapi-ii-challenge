const express = require('express');

const postRouter = require('./data/routing/post-router');

const server = express();

server.use(express.json());
server.use('/api/posts', postRouter);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log('Server Running on http://localhost:5000');
});
