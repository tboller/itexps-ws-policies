const express = require('express');
const router = express.Router();
const coverages = require('../services/coverages');

/* GET coverages. */
router.get('/', async function(req, res, next) {
  try {
    res.json(await coverages.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting coverages`, err.message);
    next(err);
  }
});

/* POST coverages */
router.post('/', async function(req, res, next) {
  try {
    res.json(await coverages.create(req.body));
  } catch (err) {
    console.error(`Error while creating coverages`, err.message);
    next(err);
  }
});


/* PUT coverages */
router.put('/:id', async function(req, res, next) {
  try {
    res.json(await coverages.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating coverages`, err.message);
    next(err);
  }
});

/* DELETE coverages */
router.delete('/:id', async function(req, res, next) {
  try {
    res.json(await coverages.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting coverages`, err.message);
    next(err);
  }
});


module.exports = router;