/**
 * Success response handler
 * @param {Object} res - Express response object
 * @param {*} data - Data to send in response
 * @param {String} message - Success message
 * @param {Number} statusCode - HTTP status code (default: 200)
 * @returns {Object} Response object
 */
exports.success = (res, data, message = 'Operation successful', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Error response handler
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code (default: 500)
 * @param {String} errorDetails - Detailed error information (optional)
 * @returns {Object} Response object
 */
exports.error = (res, message = 'Server error', statusCode = 500, errorDetails = null) => {
  const response = {
    success: false,
    message
  };

  if (errorDetails) {
    response.error = errorDetails;
  }

  return res.status(statusCode).json(response);
};
