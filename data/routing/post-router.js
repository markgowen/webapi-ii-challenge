const router = require('express').Router();

const db = require('../db');

// GET request for all posts
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

// GET request for post by id
router.get('/:id', (req, res) => {
  db.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: 'The post information could not be retrieved.' });
    });
});

// GET request for comments for a post by id
router.get('/:id/comments', (req, res) => {
  const postID = req.params.id;

  db.findPostComments(postID)
    .then(comments => {
      db.findById(postID).then(postID => {
        console.log(postID);
        if (postID.length) {
          res.status(200).json(comments);
        } else {
          res.status(404).json({
            message: 'The post with the specified ID does not exist.'
          });
        }
      });
    })
    .catch(err => {
      console.log('error', err);
      res
        .status(500)
        .json({ error: 'The comments information could not be retrieved.' });
    });
});

// GET request for a comment by id

// POST request for a new post
router.post('/', (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.'
    });
    return;
  }

  const post = req.body;
  console.log('post', post);

  db.insert(post)
    .then(postID => {
      console.log(postID.id);
      db.findById(postID.id).then(post => {
        res.status(201).json(post);
      });
    })
    .catch(err => {
      console.log('error', err);
      res.status(500).json({
        error: 'There was an error while saving the post to the database'
      });
    });
});

// POST request to add a comment to a post by id
router.post('/:id/comments', (req, res) => {
  if (!req.body) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide text for the comment.' });
    return;
  }

  const comment = { ...req.body, postID: req.params.id };
  console.log('comment', comment);

  db.findById(comment.postID)
    .then(post => {
      if (!post) {
        res.status(404).json({
          message: 'The post with the specified ID does not exist.'
        });
      }

      db.insertComment(comment).then(postID => {
        console.log(postID.id);
        res.status(201).json(comment);
      });
    })
    .catch(err => {
      console.log('error', err);
      res.status(500).json({
        error: 'There was an error while saving the comment to the database'
      });
    });
});

// PUT request to update a post
router.put('/:id', (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.'
    });
    return;
  }

  const id = req.params.id;
  const post = req.body;

  db.update(id, post)
    .then(post => {
      if (!post) {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
        return;
      }
      db.findById(id).then(post => {
        res.status(200).json(post);
      });
    })
    .catch(err => {
      console.log('error', err);
      res
        .status(500)
        .json({ error: 'The post information could not be modified.' });
    });
});

// DELETE request to delete a post
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  db.remove(id)
    .then(count => {
      if (!count) {
        res
          .status(404)
          .json({ message: `The post with the specified ID ${id} does not exist.` });
        return;
      }
      res.status(200).json({ message: 'Successfully deleted post' });
    })
    .catch(err => {
      console.log('error', err);
      res.status(500).json({ error: 'The post could not be removed' });
    });
});

module.exports = router;
