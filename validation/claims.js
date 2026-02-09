const common = require('./common');

const VALID_CLAIM_TYPES = ['Collision','Fire','Health'];
const VALID_STATUS = ['Submitted','Approved','Rejected'];

function validateCreateClaim(body){

  let err;

  err = common.requireInteger(body.policy_id,'policy_id');
  if (err) return err;

  err = common.requireInteger(body.coverage_id,'coverage_id');
  if (err) return err;

  err = common.requireEnum(body.claim_type,VALID_CLAIM_TYPES,'claim_type');
  if (err) return err;

  err = common.requirePositiveNumber(body.claim_amount,'claim_amount');
  if (err) return err;

  err = common.requireDate(body.claim_date,'claim_date');
  if (err) return err;

  return null;
}

function validateUpdateClaim(body){
  return common.requireEnum(body.status,VALID_STATUS,'status');
}

function validateQuery(query){

  const allowed = ['policy_id','claim_type','page'];

  for (const key of Object.keys(query)){
    if (!allowed.includes(key))
      return 'Claims can only be queried by policy_id or claim_type';
  }

  let err;

  err = common.enforceSingleFilter(query);
  if (err) return err;

  if (query.policy_id !== undefined){
    err = common.requireInteger(query.policy_id,'policy_id');
    if (err) return err;
  }

  if (query.claim_type !== undefined){
    err = common.requireEnum(query.claim_type,VALID_CLAIM_TYPES,'claim_type');
    if (err) return err;
  }

  return common.validatePage(query.page);
}

module.exports = {
  validateCreateClaim,
  validateUpdateClaim,
  validateQuery
};
