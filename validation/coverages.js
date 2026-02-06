const VALID_POLICY_TYPES = ['Home', 'Auto', 'Life', 'Health'];
const VALID_STATUSES = ['ACTIVE', 'EXPIRED', 'CANCELLED', 'PENDING'];

function validateCreatePolicy(body) {
    if (!body.customer_id || !Number.isInteger(body.customer_id)) {
        return 'customer_id must be an integer';
    }

    if (!VALID_POLICY_TYPES.includes(body.policy_type)) {
        return 'Invalid policy_type value';
    }

    if (!body.start_date || !body.end_date) {
        return 'start_date and end_date are required';
    }

    if (new Date(body.end_date) < new Date(body.start_date)) {
        return 'end_date must be greater than or equal to start_date';
    }

    return null;
}

function validateUpdatePolicy(body) {
    if (!body.status || !VALID_STATUSES.includes(body.status)) {
        return 'Invalid status value';
    }
    return null;
}

function validateQuery(query) {
    const allowed = ['customer_id', 'policy_type', 'page'];
    const keys = Object.keys(query);

    for (const key of keys) {
        if (!allowed.includes(key)) {
            return 'Policies can only be queried by customer_id or policy_type';
        }
    }

    if (query.policy_type && !VALID_POLICY_TYPES.includes(query.policy_type)) {
        return 'Invalid policy_type value';
    }

    return null;
}

module.exports = {
    validateCreatePolicy,
    validateUpdatePolicy,
    validateQuery
};
