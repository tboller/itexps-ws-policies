const common = require('./common');

const VALID_COVERAGE_TYPES = ['Collision','Fire','Health'];

function validateCreateCoverage(body){

  let err;

  err = common.requireInteger(body.policy_id,'policy_id');
  if (err) return err;

  err = common.requireEnum(body.coverage_type,VALID_COVERAGE_TYPES,'coverage_type');
  if (err) return err;

  err = common.requirePositiveNumber(body.limit_amount,'limit_amount');
  if (err) return err;

  err = common.requireNonNegativeNumber(body.deductible,'deductible');
  if (err) return err;

  return null;
}

function validateUpdateCoverage(body){

  let err;

  err = common.requirePositiveNumber(body.limit_amount,'limit_amount');
  if (err) return err;

  err = common.requireNonNegativeNumber(body.deductible,'deductible');
  if (err) return err;

  return null;
}

function validateQuery(query){

  const allowed = ['policy_id','coverage_type','page'];

  for (const key of Object.keys(query)){
    if (!allowed.includes(key))
      return 'Coverages can only be queried by policy_id or coverage_type';
  }

  let err;

  err = common.enforceSingleFilter(query);
  if (err) return err;

  if (query.policy_id !== undefined){
    err = common.requireInteger(query.policy_id,'policy_id');
    if (err) return err;
  }

  if (query.coverage_type !== undefined){
    err = common.requireEnum(query.coverage_type,VALID_COVERAGE_TYPES,'coverage_type');
    if (err) return err;
  }

  return common.validatePage(query.page);
}

module.exports = {
  validateCreateCoverage,
  validateUpdateCoverage,
  validateQuery
};
