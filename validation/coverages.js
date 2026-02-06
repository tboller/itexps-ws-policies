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
    if (!body.status || !VALID_STATUSES.includes(body.status)) {
        return 'Invalid status value';
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
