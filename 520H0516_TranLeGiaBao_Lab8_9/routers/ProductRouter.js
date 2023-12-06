const express = require('express')
const Router = express.Router()
const { validationResult } = require('express-validator')
const CheckLogin = require('../auth/CheckLogin')
const Product = require('../models/ProductModel')

const addProductValidator = require('./validators/addProductValidator')

Router.get('/', (req, res) => {
    Product.find()
    .then(products => {
        res.json({
            code: 0,
            message: 'Đọc danh sách sản phẩm thành công',
            data: products
        })
    })
})

Router.post('/', CheckLogin, addProductValidator, (req, res) => {
    let result = validationResult(req)

    if (result.errors.length === 0) {
        const { name, price, image, describe } = req.body
        let product = new Product ({
            name, price, image, describe
        })

        product.save()
        .then(() => {
            res.json({ code: 1, message: "Thêm sản phẩm thành công", data: product})
        })
        .catch(e => {
            res.json({ code: 1, message: e.message })
        })
    } else {
        let messages = result.mapped()
        let message = ''
        for (m in messages) {
            message = messages[m]
            break
        }

        res.json({ code: 1, message: message })
    }
})

Router.get('/:id', (req, res) => {
    let {id} = req.params
    if(!id) {
        return res.json({code: 1, message: 'Không có thông tin mã sản phẩm'})
    }
    Product.findById(id)
    .then(p => {
        if(p) {
            return res.json({code: 0, message: 'Đã tìm thấy sản phẩm', data: p})
        }
        else return res.json({code: 2, message: 'Không tìm thấy sản phẩm'})
    })
    .catch(e => {
        if(e.message.includes('Cast to ObjectId failed')) {
            return res.json({code: 3, message: 'Đây không phải là một id hợp lệ'})
        }
    })
})

Router.delete('/:id', CheckLogin, (req, res) => {
    let {id} = req.params
    if(!id) {
        return res.json({code: 1, message: 'Không có thông tin mã sản phẩm'})
    }
    Product.findByIdAndDelete(id)
    .then(p => {
        if(p) {
            return res.json({code: 0, message: 'Đã xóa sản phẩm', data: p})
        }
        else return res.json({code: 2, message: 'Không tìm thấy sản phẩm'})
    })
    .catch(e => {
        if(e.message.includes('Cast to ObjectId failed')) {
            return res.json({code: 3, message: 'Đây không phải là một id hợp lệ'})
        }
    })
})

Router.put('/:id', CheckLogin, (req, res) => {
    let {id} = req.params
    if(!id) {
        return res.json({code: 1, message: 'Không có thông tin mã sản phẩm'})
    }

    let supportedFields = ['name', 'price', 'image', 'describe']
    let updateData = req.body
    if(!updateData) {
        return res.json({code: 2, message: 'Không có dữ liệu cần cập nhật'})
    }

    for(field in updateData) {
        if(!supportedFields.includes(field)) {
            delete updateData[field]
        }
    }

    Product.findByIdAndUpdate(id, updateData, {
        new: true
    })
    .then(p => {
        if(p) {
            return res.json({code: 0, message: 'Đã cập nhật sản phẩm', data: p})
        }
        else return res.json({code: 2, message: 'Không tìm thấy sản phẩm'})
    })
    .catch(e => {
        if(e.message.includes('Cast to ObjectId failed')) {
            return res.json({code: 3, message: 'Đây không phải là một id hợp lệ'})
        }
    })
})

module.exports = Router