const db = require('./db');
const helper = require('../helper');
const config = require('../config');

/**
 * GET Multiple policies
 */
async function getMultiplePolicies(query, page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);

  if (Object.values(query).length === 0) {
    const rows = await db.query(
      `SELECT customer_id, policy_type, start_date, end_date, status 
       FROM policies 
       LIMIT ${offset},${config.listPerPage}`
    );

    return {
      data: helper.emptyOrRows(rows),
      meta: { page }
    };
  }

  if (
    Object.keys(query).length === 1 &&
    (query.customer_id || query.policy_type)
  ) {
    const key = Object.keys(query)[0];

    const rows = await db.query(
      `
      SELECT policy_id, customer_id, policy_type, start_date, end_date, status
      FROM policies
      WHERE ${key} = '${query[key]}'
      LIMIT ${offset},${config.listPerPage}
      `
    );

    return {
      data: helper.emptyOrRows(rows),
      meta: { page }
    };
  }

  throw helper.apiError(
    400,
    'Policies can only be queried by customer_id or policy_type'
  );
}

/**
 * GET policy by ID
 */
async function getById(policyId) {
  const rows = await db.query(
    `
    SELECT policy_id, customer_id, policy_type, start_date, end_date, status
    FROM policies
    WHERE policy_id = ${policyId}
    `
  );

  if (!rows.length) {
    throw helper.apiError(404, 'Policy not found');
  }

  return rows[0];
}

/**
 * CREATE policy
 */
async function create(policy) {
  const result = await db.query(
    `INSERT INTO policies 
    (customer_id, policy_type, start_date, end_date, status) VALUES
    (${policies.customer_id}, '${policies.policy_type}', '${policies.start_date}', '${policies.end_date}', 'PENDING')`
  );

  if (!result.affectedRows) {
    throw helper.apiError(500, 'Failed to create policy');
  }

  return {
    policy_id: result.insertId,
    status: 'PENDING'
  };
}

/**
 * UPDATE policy status
 */
async function update(policy_id, policy) {
  const result = await db.query(
    `
    UPDATE policies 
    SET status = ?
    WHERE policy_id = ?
    `,
    [policy.status, policy_id]
  );

  if (!result.affectedRows) {
    throw helper.apiError(404, 'Policy not found');
  }

  if (!result.changedRows) {
    throw helper.apiError(
      409,
      'Policy already has the specified status'
    );
  }

  return {
    status: policy.status
  };
}

/**
 * DELETE policy
 */
async function remove(id) {
  const result = await db.query(
    `DELETE FROM policies WHERE policy_id = ${id}`
  );

  if (!result.affectedRows) {
    throw helper.apiError(404, 'Policy not found');
  }
}

module.exports = {
  getMultiplePolicies,
  getById,
  create,
  update,
  remove
};
