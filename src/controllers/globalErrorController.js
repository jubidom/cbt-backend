const errorInDev = function (error, res) {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    errorStackTrace: error.stack,
    error,
  });
};
const errorInProd = function (error, res) {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
  });
};

const globalErrorController = function (error, req, res, next) {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "fail";

  if (process.env.NODE_ENV === "development") {
    errorInDev(error, res);
  } else if (process.env.NODE_ENV === "production") {
    errorInProd(error, res);
  }
};

export default globalErrorController;
