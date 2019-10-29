const express = require('express');

const postRouter = require('./data/routing/post-router');

const server = express();

server.use(express.json());
server.use('/api/posts', postRouter);

server.listen(5000, () => {
  console.log('Server Running pn http://localhost:5000');
});
