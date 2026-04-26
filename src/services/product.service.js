const prisma = require('../config/prisma')
const AppError = require('../utils/AppError')

const getAll = async () => {
  return prisma.product.findMany({
    where: {
      deletedAt: null
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

const create = async (data) => {
  return prisma.product.create({
    data
  })
}

const update = async (id, data) => {
  const existing = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null
    }
  })

  if (!existing) {
    throw new AppError('Product not found', 404)
  }

  return prisma.product.update({
    where: { id },
    data
  })
}

const remove = async (id) => {
  const existing = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null
    }
  })

  if (!existing) {
    throw new AppError('Product not found', 404)
  }

  return prisma.product.update({
    where: { id },
    data: {
      deletedAt: new Date()
    }
  })
}
const restore = async (id) => {
  const existing = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: {
        not: null
      }
    }
  })

  if (!existing) {
    throw new AppError('Product not found or not deleted', 404)
  }

  return prisma.product.update({
    where: { id },
    data: {
      deletedAt: null
    }
  })
}

module.exports = {
  getAll,
  create,
  update,
  remove,
  restore
}