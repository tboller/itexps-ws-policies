function getOffset(currentPage = 1, listPerPage) {
  return (currentPage - 1) * [listPerPage];
}

function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

/**
 * Standard API error formatter
 */
function apiError(status, message, req) {
  const error = new Error(message);
  error.statusCode = status;
  error.payload = {
    timestamp: new Date().toISOString(),
    status,
    error: status === 400 ? 'Bad Request' : 'Error',
    message,
    path: req.originalUrl
  };
  return error;
}

module.exports = {
  getOffset,
  emptyOrRows,
  apiError
}