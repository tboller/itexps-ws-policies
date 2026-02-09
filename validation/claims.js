function isValidDate(d) {
  return !isNaN(Date.parse(d));
}

function validateCreateClaim(body) {

  if (!Number.isInteger(body.policy_id))
    return "policy_id must be integer";

  if (!Number.isInteger(body.coverage_id))
    return "coverage_id must be integer";

  if (!VALID_CLAIM_TYPES.includes(body.claim_type))
    return "Invalid claim_type value";

  if (
    typeof body.claim_amount !== "number" ||
    body.claim_amount <= 0 ||
    !Number.isFinite(body.claim_amount)
  )
    return "claim_amount must be positive number";

  if (!body.claim_date || !isValidDate(body.claim_date))
    return "Invalid claim_date";

  return null;
}

function validateQuery(query) {

  const allowed = ["policy_id", "claim_type", "page"];

  for (const key of Object.keys(query)) {
    if (!allowed.includes(key))
      return "Claims can only be queried by policy_id or claim_type";
  }
  if (!Number.isInteger(body.policy_id))
    return 'policy_id must be integer';

  if (typeof body.limit_amount !== 'number' || body.limit_amount <= 0)
    return 'limit_amount must be positive number';

  if (typeof body.deductible !== 'number' || body.deductible < 0)
    return 'deductible must be non-negative number'
  
  if (query.policy_id && !Number.isInteger(Number(query.policy_id)))
    return "policy_id must be integer";

  if (query.page && !Number.isInteger(Number(query.page)))
    return "page must be integer";

  if (query.claim_type && !VALID_CLAIM_TYPES.includes(query.claim_type))
    return "Invalid claim_type value";

  return null;
}
module.exports = {
    validateCreateClaim,
    validateQuery
};