const authService = require('../services/auth.service')

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new Error('Email and password required')
    }

    if (!isValidEmail(email)) {
      throw new Error('Invalid email format')
    }

    const user = await authService.register(req.body)

    res.status(201).json({
      success: true,
      data: user
    })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new Error('Email and password required')
    }

    if (!isValidEmail(email)) {
      throw new Error('Invalid email format')
    }

    const { token, user } = await authService.login(req.body)

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict'
    })

    res.json({
      success: true,
      message: 'Login success',
      user
    })
  } catch (err) {
    next(err)
  }
}

const logout = (req, res) => {
  res.clearCookie('token')

  res.json({
    success: true,
    message: 'Logout success'
  })
}

module.exports = { register, login, logout }