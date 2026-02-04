const express = require('express');
const router = express.Router();
const helper = require('../helper');
const policies = require('../services/policies');
const validation = require('../validation/policies');

/* GET policies */
router.get('/', async (req, res, next) => {
  try {
    const error = validation.validateQuery(req.query);
    if (error) {
      throw helper.apiError(400, error, req);
    }

    res.json(await policies.getMultiplePolicies(req.query, req.query.page));
  } catch (err) {
    next(err);
  }
});

/* GET policy by ID */
router.get('/:id', async (req, res, next) => {
  try {
    const policy = await policies.getById(req.params.id);
    if (!policy) {
      throw helper.apiError(404, 'Policy not found', req);
    }
    res.json(policy);
  } catch (err) {
    next(err);
  }
});

/* POST policies */
router.post('/', async (req, res, next) => {
  try {
    const error = validation.validateCreatePolicy(req.body);
    if (error) {
      throw helper.apiError(400, error, req);
    }

    const result = await policies.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

/* PUT policies */
router.put('/:id', async (req, res, next) => {
  try {
    const error = validation.validateUpdatePolicy(req.body);
    if (error) {
      throw helper.apiError(400, error, req);
    }

    res.json(await policies.update(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
});

/* DELETE policies */
router.delete('/:id', async (req, res, next) => {
  try {
    await policies.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;