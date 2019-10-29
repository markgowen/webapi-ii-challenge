const router = require('express').Router();

const Data = require('../db');

router.get('/', (req, res) => {
  db.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: 'The posts information could not be retrieved.'
      });
    });
});


