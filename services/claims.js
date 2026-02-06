const db = require("./db");
const helper = require("../helper");
const config = require("../config");

/**
 * GET Multiple claims
 */

async function getMultipleClaims(query, page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);

  if (Object.values(query).length === 0) {
    const rows = await db.query(
      `SELECT claim_id, policy_id, coverage_id, claim_type, claim_amount, claim_date, status 
       FROM claims
       LIMIT ${offset},${config.listPerPage}`,
    );

    return {
      data: helper.emptyOrRows(rows),
      meta: { page },
    };
  }

  if (
    Object.keys(query).length === 1 &&
    (query.claim_type || query.policy_id)
  ) {
    const key = Object.keys(query)[0];

    const rows = await db.query(
      `
      SELECT claim_id, policy_id, coverage_id, claim_type, claim_amount, claim_date, status
      FROM claims
      WHERE ${key} = '${query[key]}'
      LIMIT ${offset},${config.listPerPage}
      `,
    );

    return {
      data: helper.emptyOrRows(rows),
      meta: { page },
    };
  }
  throw helper.apiError(
    400,
    "Claims can only be queried by claim_id or policy_id",
  );
}

/**
 * GET claim by ID
 */
async function getById(claimId) {
  const rows = await db.query(
    `
    SELECT claim_id, policy_id, coverage_id, claim_type, claim_amount, claim_date, status
    FROM claims
    WHERE claim_id = ${claimId}
    `,
  );

  if (!rows.length) {
    throw helper.apiError(404, "Claim not found");
  }

  return rows[0];
}

/**
 * CREATE claim
 */
async function create(claim) {
  const result = await db.query(
    `INSERT INTO claims 
    (policy_id, coverage_id, claim_type, claim_amount, claim_date, status) VALUES
    (${claim.policy_id}, '${claim.coverage_id}', '${claim.claim_type}', '${claim.claim_amount}', '${claim.claim_date}', 'PENDING')`,
  );

  if (!result.affectedRows) {
    throw helper.apiError(500, "Failed to create claim");
  }

  return {
    policy_id: result.insertId,
    status: "PENDING",
  };
}

/**
 * UPDATE claim status
 */
async function update(claim_id, claim) {
  const result = await db.query(
    `
    UPDATE claims
    SET status = ?
    WHERE claim_id = ?
    `,
    [claim.status, claim_id],
  );

  if (!result.affectedRows) {
    throw helper.apiError(404, "Claim not found");
  }

  if (!result.changedRows) {
    throw helper.apiError(409, "Claim already has the specified status");
  }

  return {
    status: policy.status,
  };
}

/**
 * DELETE claim
 */
async function remove(id) {
  const result = await db.query(`DELETE FROM claims WHERE claim_id = ${id}`);

  if (!result.affectedRows) {
    throw helper.apiError(404, "Claim not found");
  }
}

module.exports = {
  getMultipleClaims,
  getById,
  create,
  update,
  remove,
};
