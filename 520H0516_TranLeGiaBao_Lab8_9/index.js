require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const rateLimit = require('express-rate-limit');

const app = express()

const ProductRouter = require('./routers/ProductRouter')
const OrderRouter = require('./routers/OrderRouter')
const AccountRouter = require('./routers/AccountRouter')

app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Áp dụng CORS
app.use(cors())

// Áp dụng rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // số lượng yêu cầu tối đa trong khoảng thời gian trên
    message: 'Quá nhiều yêu cầu từ IP của bạn. Vui lòng thử lại sau một thời gian.'
  });
  
app.use(limiter);

app.get('/', (req, res) => {
    res.json({
        code: 0,
        message: 'Welcome to my REST API'
    })
})

app.use('/api/products', ProductRouter)
app.use('/api/orders', OrderRouter)
app.use('/api/account', AccountRouter)

const port = process.env.PORT || 8080

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    app.listen(port, () => {
        console.log('http://localhost:' + port)
    })
})
.catch(e => console.log('Không thể kết nối database: ' + e.message))