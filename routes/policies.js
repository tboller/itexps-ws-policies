const express = require('express');
const router = express.Router();
const policies = require('../services/policies');

/* GET All policies. 
    Determines if the request comes with params and if the params are valid.
    Then routes the call to getMultiplePolicies with the values the function needs to properly query the DB   
    If there are values provided that are not valid it will return 400 
*/
router.get('/', async function(req, res, next) {
  try {
    if (Object.values(req.query).length === 0 || req.query.customer_id ||req.query.policy_type ){
      res.json(await policies.getMultiplePolicies(req.query, req.query.page));
    } else {
        console.error('Trying to query policies with: ', req.query)
        return res.status(400).json({ message: 'Policies can only be queried by policy_id, customer_id, or policy_type' });
    }
  } catch (err) {
    console.error(`Error while getting policies`, err.message);
    next(err);
  }
});

/**
 * GET /policies/:id
 * Get policy by Policy ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const policy = await policies.getById(req.params.id);

    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    res.json(policy);
  } catch (err) {
    console.error('Error fetching policy by id', err.message);
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