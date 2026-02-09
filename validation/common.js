function isEmpty(value){
  return value === undefined || value === null || value === '';
}

function requireInteger(value, fieldName){

  if (isEmpty(value))
    return `${fieldName} cannot be empty`;

  if (!Number.isInteger(Number(value)))
    return `${fieldName} must be integer`;

  return null;
}

function requirePositiveNumber(value, fieldName){

  if (typeof value !== 'number' || value <= 0 || !Number.isFinite(value))
    return `${fieldName} must be a positive number`;

  return null;
}

function requireNonNegativeNumber(value, fieldName){

  if (typeof value !== 'number' || value < 0 || !Number.isFinite(value))
    return `${fieldName} must be a non-negative number`;

  return null;
}

function requireEnum(value, validValues, fieldName){

  if (isEmpty(value))
    return `${fieldName} cannot be empty`;

  if (!validValues.includes(value))
    return `Invalid ${fieldName} value`;

  return null;
}

function requireDate(value, fieldName){

  if (isEmpty(value))
    return `${fieldName} cannot be empty`;

  if (isNaN(Date.parse(value)))
    return `Invalid ${fieldName}`;

  return null;
}

function validatePage(page){

  if (page === undefined)
    return null;

  if (page === '')
    return 'page cannot be empty';

  if (!Number.isInteger(Number(page)))
    return 'page must be integer';

  if (Number(page) < 1)
    return 'page must be greater than 0';

  return null;
}

function enforceSingleFilter(query){
  const filters = Object.keys(query).filter(k => k !== 'page');

  if (filters.length > 1)
    return 'Only one filter parameter allowed';

  return null;
}

module.exports = {
  isEmpty,
  requireInteger,
  requirePositiveNumber,
  requireNonNegativeNumber,
  requireEnum,
  requireDate,
  validatePage,
  enforceSingleFilter
};
