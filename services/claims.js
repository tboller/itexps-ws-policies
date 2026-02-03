const db = require("./db");
const helper = require("../helper");
const config = require("../config");

async function getMultiple(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT policy_id, customer_id, policy_type, start_date, end_date, status
    FROM programming_languages LIMIT ${offset},${config.listPerPage}`,
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

async function create(programmingLanguage) {
  const result = await db.query(
    `INSERT INTO programming_languages 
    (policy_id, customer_id, policy_type, start_date, end_date, status) 
    VALUES 
    ('${programmingLanguage.policy_id}', ${programmingLanguage.customer_id}, ${programmingLanguage.policy_type}, ${programmingLanguage.start_date}, ${programmingLanguage.end_date}, ${programmingLanguage.status})`,
  );

  let message = "Error in creating claims";

  if (result.affectedRows) {
    message = "Claims created successfully";
  }

  return { message };
}

async function update(id, programmingLanguage) {
  const result = await db.query(
    `UPDATE programming_languages 
    SET customer_id=${programmingLanguage.customer_id}, policy_type=${programmingLanguage.policy_type}, 
    start_date${programmingLanguage.start_date}, end_date=${programmingLanguage.end_date}, status=${programmingLanguage.status} 
    WHERE policy_id=${policy_id}`,
  );

  let message = "Error in updating claims";

  if (result.affectedRows) {
    message = "Claims updated successfully";
  }

  return { message };
}

async function remove(id) {
  const result = await db.query(
    `DELETE FROM programming_languages WHERE policy_id=${policy_id}`,
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
