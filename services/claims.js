const db = require("./db");
const helper = require("../helper");
const config = require("../config");

async function getMultiple(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT claim_id, policy_id, customer_id, policy_type, start_date, end_date, status
    FROM claims LIMIT ${offset},${config.listPerPage}`,
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

async function create(claims) {
  const result = await db.query(
    `INSERT INTO claims 
    (claim_id, policy_id, customer_id, policy_type, start_date, end_date, status) 
    VALUES 
    ('${claims.claim_id}, ${claims.policy_id}', ${claims.customer_id}, ${claims.policy_type}, ${claims.start_date}, ${claims.end_date}, ${claims.status})`,
  );

  let message = "Error in creating claims";

  if (result.affectedRows) {
    message = "Claims created successfully";
  }

  return { message };
}

async function update(claim_id, claims) {
  const result = await db.query(
    `UPDATE claims 
    SET policy_id=${claims.policy_id}, customer_id=${claims.customer_id}, policy_type=${claims.policy_type}, 
    start_date${claims.start_date}, end_date=${claims.end_date}, status=${claims.status} 
    WHERE claim_id=${claim_id}`,
  );

  let message = "Error in updating claims";

  if (result.affectedRows) {
    message = "Claims updated successfully";
  }

  return { message };
}

async function remove(claim_id) {
  const result = await db.query(
    `DELETE FROM claims WHERE claim_id=${claim_id}`,
  );

  let message = "Error in deleting claims";

  if (result.affectedRows) {
    message = "Claims deleted successfully";
  }

  return { message };
}

module.exports = {
  getMultiple,
  create,
  update,
  remove,
};
