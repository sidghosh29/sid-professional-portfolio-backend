// 4 parameters in the handler function are important
// to identify it as an error-handling middleware in Express.
module.exports = (error, req, res, next) => {
  console.error(error);
  if (res.headersSent) {
    return next(error);
  }
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  const data = error.data;
  return res
    .status(statusCode)
    .json({ success: false, message: message, data: data });
};
