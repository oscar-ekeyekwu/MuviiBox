const errorHandler = (err, req, res) => {
  if (err.statusCode) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      errors: err.errors,
    });
  } else if (err.status) {
    res.status(err.status).json({
      status: "error",
      message: err.message,
      errors: err.errors,
    });
  } else {
    res.status(500).json({
      status: "error",
      error: "Internal server error " + err.stack,
    });

    // console.log(err.message);
  }
};

export default errorHandler;
