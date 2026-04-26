const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500

  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack
    })
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error'
  })
}

module.exports = errorHandler