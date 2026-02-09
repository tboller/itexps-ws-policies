const db = require('./db');
const helper = require('../helper');
const config = require('../config');

const QUERY_COLUMNS = ['policy_id','coverage_type'];

async function getMultipleCoverages(query,page=1){

  const offset = Number(helper.getOffset(page,config.listPerPage));
  const limit = Number(config.listPerPage);

  if (Object.keys(query).length === 0){

    const rows = await db.query(
      `SELECT coverage_id, policy_id, coverage_type, limit_amount, deductible, is_active
       FROM coverages
       LIMIT ${offset}, ${limit}`
    );

    return { data: helper.emptyOrRows(rows), meta:{page} };
  }

  const key = Object.keys(query).find(k => k !== 'page');

  const rows = await db.query(
    `SELECT coverage_id, policy_id, coverage_type, limit_amount, deductible, is_active
     FROM coverages
     WHERE ${key} = ?
     LIMIT ${offset}, ${limit}`,
    [query[key]]
  );

  return { data: helper.emptyOrRows(rows), meta:{page} };
}

async function getById(id){

  const rows = await db.query(
    `SELECT coverage_id, policy_id, coverage_type, limit_amount, deductible, is_active
     FROM coverages
     WHERE coverage_id = ?`,
    [id]
  );

  if (!rows.length)
    throw helper.apiError(404,'Coverage not found');

  return rows[0];
}

async function create(coverage){

  const result = await db.query(
    `INSERT INTO coverages
     (policy_id, coverage_type, limit_amount, deductible, is_active)
     VALUES (?, ?, ?, ?, TRUE)`,
    [
      coverage.policy_id,
      coverage.coverage_type,
      coverage.limit_amount,
      coverage.deductible
    ]
  );

  return {
    coverage_id: result.insertId,
    is_active:true
  };
}

async function update(id,coverage){

  const result = await db.query(
    `UPDATE coverages
     SET limit_amount=?, deductible=?
     WHERE coverage_id=?`,
    [
      coverage.limit_amount,
      coverage.deductible,
      id
    ]
  );

  if (!result.affectedRows)
    throw helper.apiError(404,'Coverage not found');

  if (!result.changedRows)
    throw helper.apiError(409,'Coverage already matches given values');

  return { coverage_id:id, ...coverage };
}

async function remove(id){

  const result = await db.query(
    `DELETE FROM coverages WHERE coverage_id=?`,
    [id]
  );

  if (!result.affectedRows)
    throw helper.apiError(404,'Coverage not found');
}

module.exports = {
  getMultipleCoverages,
  getById,
  create,
  update,
  remove
};
