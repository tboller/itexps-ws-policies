const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const QUERY_COLUMNS = ["policy_id", "claim_type"];

async function getMultipleClaims(query, page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);

  if (Object.keys(query).length === 0) {
    const rows = await db.query(
      `SELECT claim_id, policy_id, coverage_id, claim_type, claim_amount, claim_date, status 
       FROM claims
       LIMIT ?, ?`,
      [offset, config.listPerPage]
    );

    return { data: helper.emptyOrRows(rows), meta: { page } };
  }

  if (Object.keys(query).length === 1) {
    const key = Object.keys(query)[0];

    if (!QUERY_COLUMNS.includes(key)) {
      throw helper.apiError(400, "Invalid query parameter");
    }

    const rows = await db.query(
      `SELECT claim_id, policy_id, coverage_id, claim_type, claim_amount, claim_date, status
       FROM claims
       WHERE ${key} = ?
       LIMIT ?, ?`,
      [query[key], offset, config.listPerPage]
    );

    return { data: helper.emptyOrRows(rows), meta: { page } };
  }

  throw helper.apiError(400, "Claims can only be queried by claim_type or policy_id");
}

async function getById(claimId) {
  const rows = await db.query(
    `SELECT claim_id, policy_id, coverage_id, claim_type, claim_amount, claim_date, status
     FROM claims
     WHERE claim_id = ?`,
    [claimId]
  );

  if (!rows.length) throw helper.apiError(404, "Claim not found");

  return rows[0];
}

async function create(claim) {
  const result = await db.query(
    `INSERT INTO claims 
    (policy_id, coverage_id, claim_type, claim_amount, claim_date, status)
    VALUES (?, ?, ?, ?, ?, 'Submitted')`,
    [
      claim.policy_id,
      claim.coverage_id,
      claim.claim_type,
      claim.claim_amount,
      claim.claim_date,
    ]
  );

  if (!result.affectedRows)
    throw helper.apiError(500, "Failed to create claim");

  return { claim_id: result.insertId, status: "Submitted" };
}

async function update(claim_id, claim) {
  const result = await db.query(
    `UPDATE claims SET status = ? WHERE claim_id = ?`,
    [claim.status, claim_id]
  );

  if (!result.affectedRows)
    throw helper.apiError(404, "Claim not found");

  if (!result.changedRows)
    throw helper.apiError(409, "Claim already has the specified status");

  return { status: claim.status };
}

async function remove(id) {
  const result = await db.query(
    `DELETE FROM claims WHERE claim_id = ?`,
    [id]
  );

  if (!result.affectedRows)
    throw helper.apiError(404, "Claim not found");
}

module.exports = {
  getMultipleClaims,
  getById,
  create,
  update,
  remove,
};
