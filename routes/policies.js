const express = require('express');
const router = express.Router();

const helper = require('../helper');
const policies = require('../services/policies');
const validation = require('../validation/policies');
const common = require('../validation/common');


/* GET policies */
router.get('/', async function(req,res,next){

  try {

    const validationError = validation.validateQuery(req.query);

    if (validationError){
      throw helper.apiError(400, validationError, req);
    }

    const page = req.query.page ? Number(req.query.page) : 1;

    const result = await policies.getMultiplePolicies(req.query,page);

    res.json(result);

  } catch(err){
    next(err);
  }
});


/* GET policy by ID */
router.get('/:id', async function(req,res,next){

  try {

    const err = common.requireInteger(req.params.id,'policy_id');
    if (err){
      throw helper.apiError(400, err, req);
    }

    res.json(await policies.getById(Number(req.params.id)));

  } catch(err){
    next(err);
  }
});


/* POST policy */
router.post('/', async function(req,res,next){

  try {

    const validationError = validation.validateCreatePolicy(req.body);

    if (validationError){
      throw helper.apiError(400, validationError, req);
    }

    res.status(201).json(await policies.create(req.body));

  } catch(err){
    next(err);
  }
});


/* PUT policy */
router.put('/:id', async function(req,res,next){

  try {

    let err = common.requireInteger(req.params.id,'policy_id');
    if (err){
      throw helper.apiError(400, err, req);
    }

    const validationError = validation.validateUpdatePolicy(req.body);

    if (validationError){
      throw helper.apiError(400, validationError, req);
    }

    res.json(
      await policies.update(Number(req.params.id),req.body)
    );

  } catch(err){
    next(err);
  }
});


/* DELETE policy */
router.delete('/:id', async function(req,res,next){

  try {

    const err = common.requireInteger(req.params.id,'policy_id');
    if (err){
      throw helper.apiError(400, err, req);
    }

    await policies.remove(Number(req.params.id));

    res.json({ message:'Policy deleted successfully' });

  } catch(err){
    next(err);
  }
});

module.exports = router;
