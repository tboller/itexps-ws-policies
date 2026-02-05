const VALID_CLAIM_TYPES = ["Collision", "Fire", "Health"];
const VALID_STATUSES = ["Submitted", "Approved", "Rejected"];

function validateCreateClaim(body) {
  if (!body.policy_id || !Number.isInteger(body.policy_id)) {
    return "policy_id must be an integer";
  }

  if (!body.coverage_id || !Number.isInteger(body.coverage_id)) {
    return "coverage_id must be an integer";
  }

  if (!VALID_CLAIM_TYPES.includes(body.claim_type)) {
    return "Invalid claim_type value";
  }

  if (
    body.claim_amount === undefined ||
    typeof body.claim_amount !== "number"
  ) {
    return "claim_amount must be a number";
  }

  if (!body.claim_date) {
    return "claim_date is required";
  }

  return null;
}

function validateUpdateClaim(body) {
  if (!body.status || !VALID_STATUSES.includes(body.status)) {
    return "Invalid status value";
  }
  return null;
}

function validateQuery(query) {
  const allowed = ["policy_id", "claim_type", "page"];
  const keys = Object.keys(query);

  for (const key of keys) {
    if (!allowed.includes(key)) {
      return "Claims can only be queried by policy_id or claim_type";
    }
  }

  if (query.claim_type && !VALID_CLAIM_TYPES.includes(query.claim_type)) {
    return "Invalid claim_type value";
  }

  return null;
}

module.exports = {
  validateCreateClaim,
  validateUpdateClaim,
  validateQuery,
};
