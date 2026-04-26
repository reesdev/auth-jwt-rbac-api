const express = require('express')
const router = express.Router()
const gudangController = require('../controllers/gudang.controller')
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware')

router.get('/gudang', verifyToken, gudangController.getGudang)

router.post('/gudang', verifyToken, requireAdmin, gudangController.createGudang)

module.exports = router