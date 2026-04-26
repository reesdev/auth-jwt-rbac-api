const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')

const verifyToken = (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.headers.authorization?.split(' ')[1]

    if (!token) {
      throw new AppError('Unauthorized', 401)
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded
    next()
  } catch (err) {
    next(new AppError('Invalid token', 401))
  }
}

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new AppError('Forbidden', 403))
  }

  next()
}

module.exports = { verifyToken, requireAdmin }