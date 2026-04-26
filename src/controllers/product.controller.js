const productService = require('../services/product.service')

const getProducts = async (req, res, next) => {
  try {
    const data = await productService.getAll()

    res.json({
      success: true,
      data
    })
  } catch (err) {
    next(err)
  }
}
const restoreProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    if (isNaN(id)) {
      throw new Error('Invalid ID')
    }

    const data = await productService.restore(id)

    res.json({
      success: true,
      message: 'Product restored',
      data
    })
  } catch (err) {
    next(err)
  }
}
const createProduct = async (req, res, next) => {
  try {
    const { name, price } = req.body

    if (!name || typeof price !== 'number' || price <= 0) {
      throw new Error('Invalid input')
    }

    const data = await productService.create(req.body)

    res.status(201).json({
      success: true,
      data
    })
  } catch (err) {
    next(err)
  }
}

const updateProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    if (isNaN(id)) {
      throw new Error('Invalid ID')
    }

    const data = await productService.update(id, req.body)

    res.json({
      success: true,
      data
    })
  } catch (err) {
    next(err)
  }
}

const deleteProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    if (isNaN(id)) {
      throw new Error('Invalid ID')
    }

    await productService.remove(id)

    res.json({
      success: true,
      message: 'Deleted'
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct
}