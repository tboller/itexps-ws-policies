const VALID_COVERAGE_TYPES = ['Fire', 'Collision', 'Health'];
const VALID_STATUSES = ['TRUE', 'FALSE'];

function validateCreateCoverage(body) {
    if (!body.policy_id || !Number.isInteger(body.policy_id)) {
        return 'policy_id must be an integer';
    }

    if (!VALID_COVERAGE_TYPES.includes(body.coverage_type)) {
        return 'Invalid coverage_type value';
    }

    return null;
}

function validateUpdateCoverage(body) {
    if (!body || Object.keys(body).length === 0) {
        return 'Request body is required';
    }

    // Only allow specific fields
    const allowedFields = ['limit_amount', 'deductible'];
    const bodyFields = Object.keys(body);

    for (const field of bodyFields) {
        if (!allowedFields.includes(field)) {
            return `Invalid field: ${field}`;
        }
    }

    // Validate limit_amount
    if (
        body.limit_amount === undefined ||
        typeof body.limit_amount !== 'number' ||
        body.limit_amount <= 0
    ) {
        return 'limit_amount must be a positive number';
    }

    // Validate deductible
    if (
        body.deductible === undefined ||
        typeof body.deductible !== 'number' ||
        body.deductible < 0
    ) {
        return 'deductible must be a non-negative number';
    }

    return null;
}

function validateQuery(query) {
    console.log(`query value is ${Object.keys(query)}`);
    const allowed = ['policy_id', 'coverage_type', 'page'];
    const keys = Object.keys(query);

    for (const key of keys) {
        if (!allowed.includes(key)) {
            return 'Coverages can only be queried by policy_id or coverage_type';
        }
    }

    if (query.coverage_type && !VALID_COVERAGE_TYPES.includes(query.coverage_type)) {
        return 'Invalid coverage_type value';
    }

    return null;
}

module.exports = {
    validateCreateCoverage,
    validateUpdateCoverage,
    validateQuery
};
