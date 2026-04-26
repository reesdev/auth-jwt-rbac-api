const prisma = require('../config/prisma')

const getAll = async () => {
  return prisma.gudang.findMany()
}

const create = async (data) => {
  return prisma.gudang.create({ data })
}

module.exports = { getAll, create }