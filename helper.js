function getOffset(currentPage = 1, listPerPage) {
  return (Number(currentPage) - 1) * Number(listPerPage);
}

function emptyOrRows(rows) {
  if (!rows) return [];
  return rows;
}

function apiError(status, message, req) {
  const error = new Error(message);
  error.statusCode = status;

  error.payload = {
    timestamp: new Date().toISOString(),
    status,
    error:
      status === 400 ? "Bad Request"
        : status === 404 ? "Not Found"
        : status === 409 ? "Conflict"
        : "Error",
    message,
    path: req?.originalUrl || "N/A",
  };

  return error;
}

module.exports = {
  getOffset,
  emptyOrRows,
  apiError,
};
