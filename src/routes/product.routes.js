const express = require('express')
const router = express.Router()
const productController = require('../controllers/product.controller')
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware')

router.get('/products', verifyToken, productController.getProducts)

router.post('/products', verifyToken, requireAdmin, productController.createProduct)

router.put('/products/:id', verifyToken, requireAdmin, productController.updateProduct)

router.delete('/products/:id', verifyToken, requireAdmin, productController.deleteProduct)

router.patch(  '/products/:id/restore',  verifyToken,  requireAdmin,  productController.restoreProduct)

module.exports = router