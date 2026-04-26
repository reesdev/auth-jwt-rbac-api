const prisma = require('../config/prisma')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')

const register = async (data) => {
  const { email, password, role } = data

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new AppError('Email already registered', 400)
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: role || 'user'
    }
  })

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  }
}

const login = async (data) => {
  const { email, password } = data

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    throw new AppError('Invalid credentials', 401)
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new AppError('Invalid credentials', 401)
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  }
}

module.exports = { register, login }