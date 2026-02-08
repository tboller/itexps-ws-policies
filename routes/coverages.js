const express = require('express');
const router = express.Router();
const helper = require('../helper');
const coverages = require('../services/coverages');
const validation = require('../validation/coverages');

/* GET coverages */
router.get('/', async (req, res, next) => {
  try {
    const error = validation.validateQuery(req.query);
    if (error) {
      throw helper.apiError(400, error, req);
    }

    res.json(await coverages.getMultipleCoverages(req.query, req.query.page));
  } catch (err) {
    next(err);
  }
});

/* GET Coverage by ID */
router.get('/:id', async (req, res, next) => {
  try {
    const coverage = await coverages.getById(req.params.id);
    if (!coverage) {
      throw helper.apiError(404, 'Coverage not found', req);
    }
    res.json(coverage);
  } catch (err) {
    next(err);
  }
});

/* POST coverages */
router.post('/', async (req, res, next) => {
  try {
    const error = validation.validateCreateCoverage(req.body);
    if (error) {
      throw helper.apiError(400, error, req);
    }

    const result = await coverages.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

/* PUT coverages */
router.put('/:id', async (req, res, next) => {
  try {
    const error = validation.validateUpdateCoverage(req.body);
    if (error) {
      throw helper.apiError(400, error, req);
    }

    res.json(await coverages.update(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
});

/* DELETE coverages */
router.delete('/:id', async (req, res, next) => {
  try {
    await coverages.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;