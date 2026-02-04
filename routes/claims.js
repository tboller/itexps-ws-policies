const express = require("express");
const router = express.Router();
const claims = require("../services/claims");

/* GET claims */
router.get("/", async function (req, res, next) {
  try {
    res.json(await claims.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting claims`, err.message);
    next(err);
  }
});

/* POST claims */
router.post("/", async function (req, res, next) {
  try {
    res.json(await claims.create(req.body));
  } catch (err) {
    console.error(`Error while creating claims`, err.message);
    next(err);
  }
});

/* PUT claims */
router.put("/:id", async function (req, res, next) {
  try {
    res.json(await claims.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating claims`, err.message);
    next(err);
  }
});

/* DELETE claims */
router.delete("/:id", async function (req, res, next) {
  try {
    res.json(await claims.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting claims`, err.message);
    next(err);
  }
});

module.exports = router;
