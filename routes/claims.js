const express = require("express");
const router = express.Router();
const helper = require("../helper");
const claims = require("../services/claims");
const validation = require("../validation/claims");

/* GET claims */
router.get("/", async (req, res, next) => {
  try {
    const error = validation.validateQuery(req.query);
    if (error) {
      throw helper.apiError(400, error, req);
    }

    res.json(await claims.getMultipleClaims(req.query, req.query.page));
  } catch (err) {
    next(err);
  }
});

/* GET claims by ID */
router.get("/:id", async (req, res, next) => {
  try {
    const claim = await claims.getById(req.params.id);
    if (!claim) {
      throw helper.apiError(404, "Claim not found", req);
    }
    res.json(claim);
  } catch (err) {
    next(err);
  }
});

/* POST claims */
router.post("/", async (req, res, next) => {
  try {
    const error = validation.validateCreateClaim(req.body);
    if (error) {
      throw helper.apiError(400, error, req);
    }

    const result = await claims.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

/* PUT claims */
router.put("/:id", async (req, res, next) => {
  try {
    const error = validation.validateUpdateClaim(req.body);
    if (error) {
      throw helper.apiError(400, error, req);
    }

    res.json(await claims.update(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
});

/* DELETE claims */
router.delete("/:id", async (req, res, next) => {
  try {
    await claims.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
