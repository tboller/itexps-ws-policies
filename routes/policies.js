const express = require('express');
const router = express.Router();
const policies = require('../services/policies');

/* GET policies. */
router.get('/', async function(req, res, next) {
  try {
    res.json(await policies.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting policies`, err.message);
    next(err);
  }
});

/* POST policies */
router.post('/', async function(req, res, next) {
  try {
    res.json(await policies.create(req.body));
  } catch (err) {
    console.error(`Error while creating policies`, err.message);
    next(err);
  }
});


/* PUT policies */
router.put('/:id', async function(req, res, next) {
  try {
    res.json(await policies.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating policies`, err.message);
    next(err);
  }
});

/* DELETE policies */
router.delete('/:id', async function(req, res, next) {
  try {
    res.json(await policies.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting policies`, err.message);
    next(err);
  }
});


module.exports = router;