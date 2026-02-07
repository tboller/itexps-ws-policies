const db = require('./db');
const helper = require('../helper');
const config = require('../config');

/**
 * GET Multiple coverages
 */
async function getMultipleCoverages(query, page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  
  if (Object.values(query).length === 0) {
    const rows = await db.query(
      `SELECT coverage_id, policy_id, coverage_type, limit_amount, deductible, is_active
      FROM coverages
      LIMIT ${offset},${config.listPerPage}`,
    );

    return {
      data: helper.emptyOrRows(rows),
      meta: { page },
    };
  } 

  if (
    Object.keys(query).length === 1 &&
    (query.coverage_type || query.policy_id)
  ) {
    const key = Object.keys(query)[0];

    const rows = await db.query(
      `SELECT coverage_id, policy_id, coverage_type, limit_amount, deductible, is_active 
      FROM coverages
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
    "Coverages can only be queried by coverage_id or policy_id",
  );
}

/**
 * GET claim by ID
 */
async function getById(coverageId) {
  const rows = await db.query(
    `SELECT coverage_id, policy_id, coverage_type, limit_amount, deductible, is_active 
    FROM coverages
    WHERE coverage_id = ${coverageId}
    `,
  );

  if (!rows.length) {
    throw helper.apiError(404, "Coverage not found");
  }

  return rows[0];
}

async function create(coverage){
  const initial_active_bool = true;
  const result = await db.query(
    `INSERT INTO coverages 
    (policy_id, coverage_type, limit_amount, deductible, is_active) 
    VALUES 
    ('${coverage.policy_id}', '${coverage.coverage_type}', ${coverage.limit_amount}, ${coverage.deductible}, ${initial_active_bool})`
  );


  if (!result.affectedRows) {
    throw helper.apiError(500, 'Failed to create coverage');
  }
  
  return {
    coverage_id: result.insertId,
    is_active: 'true'
  };
}

async function update(coverageid, coverage){
  const result = await db.query(
    `UPDATE coverages 
    SET policy_id="${coverage.policy_id}", coverage_type=${coverage.coverage_type}, limit_amount=${coverage.limit_amount}, 
    deductible=${coverage.deductible}, is_active=${coverage.is_active} 
    WHERE coverage_id=${coverageid}` 
  );

  let message = 'Error in updating coverage';

  if (result.affectedRows) {
    message = 'Coverage updated successfully';
  }

  return {message};
}

async function remove(coverageid){
  const result = await db.query(
    `DELETE FROM coverages WHERE coverage_id=${coverageid}`
  );

  let message = 'Error in deleting coverage';

  if (result.affectedRows) {
    message = 'Coverage deleted successfully';
  }

  return {message};
}


module.exports = {
  getMultipleCoverages,
  getById,
  create,
  update,
  remove
};