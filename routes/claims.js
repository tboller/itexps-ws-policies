const express = require('express');
const router = express.Router();

const helper = require('../helper');
const claims = require('../services/claims');
const validation = require('../validation/claims');
const common = require('../validation/common');


router.get('/', async function(req,res,next){

  try {

    const validationError = validation.validateQuery(req.query);
    if (validationError){
      throw helper.apiError(400, validationError, req);
    }

    const page = req.query.page ? Number(req.query.page) : 1;

    res.json(
      await claims.getMultipleClaims(req.query,page)
    );

  } catch(err){
    next(err);
  }
});


router.get('/:id', async function(req,res,next){

  try {

    const err = common.requireInteger(req.params.id,'claim_id');
    if (err){
      throw helper.apiError(400, err, req);
    }

    res.json(
      await claims.getById(Number(req.params.id))
    );

  } catch(err){
    next(err);
  }
});


router.post('/', async function(req,res,next){

  try {

    const validationError = validation.validateCreateClaim(req.body);
    if (validationError){
      throw helper.apiError(400, validationError, req);
    }

    res.status(201).json(await claims.create(req.body));

  } catch(err){
    next(err);
  }
});


router.put('/:id', async function(req,res,next){

  try {

    let err = common.requireInteger(req.params.id,'claim_id');
    if (err){
      throw helper.apiError(400, err, req);
    }

    const validationError = validation.validateUpdateClaim(req.body);
    if (validationError){
      throw helper.apiError(400, validationError, req);
    }

    res.json(
      await claims.update(Number(req.params.id),req.body)
    );

  } catch(err){
    next(err);
  }
});


router.delete('/:id', async function(req,res,next){

  try {

    const err = common.requireInteger(req.params.id,'claim_id');
    if (err){
      throw helper.apiError(400, err, req);
    }

    await claims.remove(Number(req.params.id));

    res.json({ message:'Claim deleted successfully' });

  } catch(err){
    next(err);
  }
});

module.exports = router;
