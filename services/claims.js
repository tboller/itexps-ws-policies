const db = require('./db');
const helper = require('../helper');
const config = require('../config');

const QUERY_COLUMNS = ['policy_id','claim_type'];

async function getMultipleClaims(query,page=1){

  const offset = Number(helper.getOffset(page,config.listPerPage));
  const limit = Number(config.listPerPage);

  if (Object.keys(query).length === 0){

    const rows = await db.query(
      `SELECT claim_id, policy_id, coverage_id, claim_type, claim_amount, claim_date, status
       FROM claims
       LIMIT ${offset}, ${limit}`
    );

    return { data: helper.emptyOrRows(rows), meta:{page} };
  }

  const key = Object.keys(query).find(k => k !== 'page');

  const rows = await db.query(
    `SELECT claim_id, policy_id, coverage_id, claim_type, claim_amount, claim_date, status
     FROM claims
     WHERE ${key} = ?
     LIMIT ${offset}, ${limit}`,
    [query[key]]
  );

  return { data: helper.emptyOrRows(rows), meta:{page} };
}

async function getById(id){

  const rows = await db.query(
    `SELECT claim_id, policy_id, coverage_id, claim_type, claim_amount, claim_date, status
     FROM claims
     WHERE claim_id=?`,
    [id]
  );

  if (!rows.length)
    throw helper.apiError(404,'Claim not found');

  return rows[0];
}

async function create(claim){

  const result = await db.query(
    `INSERT INTO claims
     (policy_id, coverage_id, claim_type, claim_amount, claim_date, status)
     VALUES (?, ?, ?, ?, ?, 'Submitted')`,
    [
      claim.policy_id,
      claim.coverage_id,
      claim.claim_type,
      claim.claim_amount,
      claim.claim_date
    ]
  );

  return { claim_id: result.insertId, status:'Submitted' };
}

async function update(id,claim){

  const result = await db.query(
    `UPDATE claims SET status=? WHERE claim_id=?`,
    [claim.status,id]
  );

  if (!result.affectedRows)
    throw helper.apiError(404,'Claim not found');

  if (!result.changedRows)
    throw helper.apiError(409,'Claim already has specified status');

  return { status:claim.status };
}

async function remove(id){

  const result = await db.query(
    `DELETE FROM claims WHERE claim_id=?`,
    [id]
  );

  if (!result.affectedRows)
    throw helper.apiError(404,'Claim not found');
}

module.exports = {
  getMultipleClaims,
  getById,
  create,
  update,
  remove
};
