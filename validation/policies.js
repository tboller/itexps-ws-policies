const common = require('./common');

const VALID_POLICY_TYPES = ['Home','Auto','Health', 'Life'];
const VALID_STATUS = ['PENDING','ACTIVE','EXPIRED','CANCELLED'];

function validateCreatePolicy(body){

  let err;

  err = common.requireInteger(body.customer_id,'customer_id');
  if (err) return err;

  err = common.requireEnum(body.policy_type,VALID_POLICY_TYPES,'policy_type');
  if (err) return err;

  err = common.requireDate(body.start_date,'start_date');
  if (err) return err;

  err = common.requireDate(body.end_date,'end_date');
  if (err) return err;

  return null;
}

function validateUpdatePolicy(body){

  return common.requireEnum(body.status,VALID_STATUS,'status');
}

function validateQuery(query){

  const allowed = ['customer_id','policy_type','page'];

  for (const key of Object.keys(query)){
    if (!allowed.includes(key))
      return 'Policies can only be queried by customer_id or policy_type';
  }

  let err;

  err = common.enforceSingleFilter(query);
  if (err) return err;

  if (query.customer_id !== undefined){
    err = common.requireInteger(query.customer_id,'customer_id');
    if (err) return err;
  }

  if (query.policy_type !== undefined){
    err = common.requireEnum(query.policy_type,VALID_POLICY_TYPES,'policy_type');
    if (err) return err;
  }

  return common.validatePage(query.page);
}

module.exports = {
  validateCreatePolicy,
  validateUpdatePolicy,
  validateQuery
};
