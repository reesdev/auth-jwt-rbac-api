const express = require('express')
const cookieParser = require('cookie-parser')

const authRoutes = require('./routes/auth.routes')
const productRoutes = require('./routes/product.routes')
const gudangRoutes = require('./routes/gudang.routes')
const { verifyToken } = require('./middlewares/auth.middleware')
const errorHandler = require('./middlewares/error.middleware')

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/api', authRoutes)
app.use('/api', productRoutes)
app.use('/api', gudangRoutes)

app.get('/api/profile', verifyToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  })
})

app.get('/', (req, res) => {
  res.send('API Running')
})


app.use(errorHandler)

module.exports = app