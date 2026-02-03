const db = require('./db');
const helper = require('../helper');
const config = require('../config');

/**
 * GET Multiple policies either all, by customer_id or by policy_type
 */
async function getMultiplePolicies(query, page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);

  //simplistic if cases to determine if query for all, by customer_id, policy_type
  if (Object.values(query).length === 0) {
    const rows = await db.query(
      `SELECT customer_id, policy_type, start_date, end_date, status 
      FROM policies LIMIT ${offset},${config.listPerPage}`
    );
    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
      data,
      meta
    }
  }
  else if (Object.keys(query) == 'customer_id' || Object.keys(query) == 'policy_type') {
    const query_name = Object.keys(query)
    const whereClause = `WHERE ${query_name} IN ('${query[query_name]}')`
    console.log('whereclause', whereClause)
    const rows = await db.query(
      `
      SELECT policy_id, customer_id, policy_type, start_date, end_date, status
      FROM policies
      ${whereClause} LIMIT ${offset},${config.listPerPage}
      `
    );
    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
      data,
      meta
    }
  }
}

/**
 * GET policy by Policy ID
 */
async function getById(policyId) {
  const rows = await db.query(
    `
    SELECT policy_id, customer_id, policy_type, start_date, end_date, status
    FROM policies
    WHERE policy_id = ?
    `,
    [policyId]
  );

  return rows.length ? rows[0] : null;
}

async function create(policies) {
  //We need to add Request Body Validation
  let query_ish = `INSERT INTO policies 
    (customer_id, policy_type, start_date, end_date, status) VALUES
    (${policies.customer_id}, '${policies.policy_type}', '${policies.start_date}', '${policies.end_date}', 'PENDING')`
  console.log(query_ish)
  const result = await db.query(
    query_ish
  );

  let message = 'Error in creating new policy';

  if (result.affectedRows) {
    message = `"policy_id": ,
                "status": "PENDING"`;
  }
  console.log("what is affectedRows ", result.affectedRows[1])

  return { message };
}

async function update(id, programmingLanguage) {
  const result = await db.query(
    `UPDATE programming_languages 
    SET name="${programmingLanguage.name}", released_year=${programmingLanguage.released_year}, githut_rank=${programmingLanguage.githut_rank}, 
    pypl_rank=${programmingLanguage.pypl_rank}, tiobe_rank=${programmingLanguage.tiobe_rank} 
    WHERE id=${id}`
  );

  let message = 'Error in updating programming language';

  if (result.affectedRows) {
    message = 'Programming language updated successfully';
  }

  return { message };
}

async function remove(id) {
  const result = await db.query(
    `DELETE FROM programming_languages WHERE id=${id}`
  );

  let message = 'Error in deleting programming language';

  if (result.affectedRows) {
    message = 'Programming language deleted successfully';
  }

  return { message };
}


module.exports = {
  getMultiplePolicies,
  getById,
  create,
  update,
  remove
};