const gudangService = require('../services/gudang.service')

const getGudang = async (req, res, next) => {
  try {
    const data = await gudangService.getAll()

    res.json({
      success: true,
      data
    })
  } catch (err) {
    next(err)
  }
}

const createGudang = async (req, res, next) => {
  try {
    const { name, location } = req.body

    if (!name || !location) {
      throw new Error('Invalid input')
    }

    const data = await gudangService.create(req.body)

    res.status(201).json({
      success: true,
      data
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { getGudang, createGudang }