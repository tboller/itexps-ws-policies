const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT coverage_id, policy_id, coverage_type, deductible, is_active
    FROM coverages LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

async function create(coverage){
  const result = await db.query(
    `INSERT INTO coverages 
    (SELECT coverage_id, policy_id, coverage_type, deductible, is_active) 
    VALUES 
    ('${coverage.coverage_id}', ${coverage.policy_id}, ${coverage.coverage_type}, ${coverage.deductible}, ${coverage.is_active})`
  );

  let message = 'Error in creating coverage';

  if (result.affectedRows) {
    message = 'Coverage created successfully';
  }

  return {message};
}

async function update(coverage_id, coverage){
  const result = await db.query(
    `UPDATE programming_languages 
    SET policy_id="${coverage.policy_id}", coverage_type="${coverage.coverage_type}", deductible=${coverage.deductible}, is_active=${coverage.is_active}
    WHERE coverage_id=${coverage_id}` 
  );

  let message = 'Error in updating coverage';

  if (result.affectedRows) {
    message = 'Coverage updated successfully';
  }

  return {message};
}

async function remove(coverage_id){
  const result = await db.query(
    `DELETE FROM coverages WHERE coverage_id=${coverage_id}`
  );

  let message = 'Error in deleting coverage';

  if (result.affectedRows) {
    message = 'Coverage deleted successfully';
  }

  return {message};
}


module.exports = {
  getMultiple,
  create,
  update,
  remove
};