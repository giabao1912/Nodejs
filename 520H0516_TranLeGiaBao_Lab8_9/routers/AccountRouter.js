const express = require('express')
const Router = express.Router()
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Account = require('../models/AccountModel')

const registerValidator = require('./validators/registerValidator')
const loginValidator = require('./validators/loginValidator')

Router.get('/', (req, res) => {
    res.json({
        code: 0,
        message: 'Account route'
    })
})

Router.post('/login', loginValidator, (req, res) => {
    let result = validationResult(req)

    if (result.errors.length === 0) {
        let { email, password } = req.body
        let account = undefined

        Account.findOne({email: email})
        .then(acc => {
            if(!acc) {
                throw new Error('Tài khoản này không tồn tại')
            }
            account = acc
            return bcrypt.compare(password, acc.password)
        })
        .then(passwordMatch => {
           if(!passwordMatch) {
            return res.status(401).json({code: 3, message: 'Đăng nhập thất bại, sai mật khẩu'})
           }
           
           const {JWT_SECRET} = process.env
           jwt.sign({
            email: account.email,
            fulllName: account.fulllName
           }, JWT_SECRET, {
            expiresIn: '1h'
           }, (err, token) => {
            if (err) throw err
            return res.json({
                code: 0,
                message: 'Đăng nhập thành công',
                token: token
            })
           })
        })
        .catch(e => {
            return res.status(401).json({code: 2, message: 'Đăng nhập thất bại: ' + e.message})
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

Router.post('/register', registerValidator, (req, res) => {
    let result = validationResult(req)

    if (result.errors.length === 0) {
        let { email, password, fullname } = req.body
        Account.findOne({email: email})
        .then(acc => {
            if(acc) {
                throw new Error('Tài khoản này đã tồn tại')
            }
        })
        .then(() => bcrypt.hash(password, 10))
        .then(hashed => {
            let user = new Account({
                email: email,
                password: hashed,
                fulllName: fullname
            })

            return user.save()
        })
        .then(() => {
            return res.json({code: 0, message: 'Đăng ký thành công.'})
        })
        .catch(e => {
            return res.json({code: 2, message: 'Đăng ký thất bại: ' + e.message})
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

module.exports = Router