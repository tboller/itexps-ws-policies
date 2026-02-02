const express = require('express');
const router = express.Router();
const claims = require('../services/claims');

/* GET policies. */
router.get('/', async function(req, res, next) {
  try {
    res.json(await policies.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting claims`, err.message);
    next(err);
  }
});

/* POST policiess */
router.post('/', async function(req, res, next) {
  try {
    res.json(await policies.create(req.body));
  } catch (err) {
    console.error(`Error while creating claims`, err.message);
    next(err);
  }
});


/* PUT policies */
router.put('/:id', async function(req, res, next) {
  try {
    res.json(await policies.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating claims`, err.message);
    next(err);
  }
});

/* DELETE policies */
router.delete('/:id', async function(req, res, next) {
  try {
    res.json(await policies.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting claims`, err.message);
    next(err);
  }
});


module.exports = router;