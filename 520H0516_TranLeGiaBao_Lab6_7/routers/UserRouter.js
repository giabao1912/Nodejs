const express = require('express')
const { check, validationResult } = require('express-validator')
const db = require('../db')
const bcrypt = require('bcrypt')
const fs = require('fs');
const path = require('path');

const Router = express.Router()

const loginValidator = [
    check('email').exists().withMessage('Vui lòng nhập email người dùng.')
        .notEmpty().withMessage('Không được để trống email người dùng.')
        .isEmail({ min: 6 }).withMessage('Đây không phải là email hợp lệ.'),

    check('password').exists().withMessage('Vui lòng nhập mật khẩu.')
        .notEmpty().withMessage('Không được để trống mật khẩu.')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải từ 6 ký tự.')
]

Router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/')
    }

    const error = req.flash('error') || ''
    const email = req.flash('email') || ''
    const password = req.flash('password') || ''

    res.render('login', { error, email, password })
})

Router.post('/login', loginValidator, (req, res) => {
    let result = validationResult(req)

    if (result.errors.length === 0) {
        const { email, password } = req.body

        const sql = 'SELECT * FROM account WHERE email = ?'
        const params = [email]

        db.query(sql, params, (err, result, fields) => {
            if (err) {
                req.flash('error', err.message)
                req.flash('password', password)
                req.flash('email', email)

                return res.redirect('/login')
            } else {
                const hashed = result[0].password
                const match = bcrypt.compareSync(password, hashed)
                if (!match) {
                    req.flash('error', 'Mật khẩu không chính xác')
                    req.flash('password', password)
                    req.flash('email', email)

                    return res.redirect('/login')
                } else {
                    let user = result[0]
                    user.userRoot = `${req.vars.root}/users/${user.email}`
                    req.session.user = user

                    req.app.use(express.static(user.userRoot))

                    return res.redirect('/')
                }
            }
        })
    } else {
        result = result.mapped()

        let message;
        for (fields in result) {
            message = result[fields].msg
            break
        }

        const { email, password } = req.body

        req.flash('error', message)
        req.flash('email', email)
        req.flash('password', password)

        res.redirect('/login')
    }
})

const validator = [
    check('name').exists().withMessage('Vui lòng nhập tên người dùng.')
        .notEmpty().withMessage('Không được để trống tên người dùng.')
        .isLength({ min: 6 }).withMessage('Tên người dùng phải từ 6 ký tự.'),

    check('email').exists().withMessage('Vui lòng nhập email người dùng.')
        .notEmpty().withMessage('Không được để trống email người dùng.')
        .isEmail({ min: 6 }).withMessage('Đây không phải là email hợp lệ.'),

    check('password').exists().withMessage('Vui lòng nhập mật khẩu.')
        .notEmpty().withMessage('Không được để trống mật khẩu.')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải từ 6 ký tự.'),

    check('rePassword').exists().withMessage('Vui lòng nhập xác nhận mật khẩu.')
        .notEmpty().withMessage('Vui lòng nhập xác nhận mật khẩu.')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Mật khẩu không khớp.')
            }
            return true
        })
]

Router.get('/register', (req, res) => {
    const error = req.flash('error') || ''

    const name = req.flash('name') || ''
    const email = req.flash('email') || ''
    const password = ''
    const rePassword = ''

    res.render('register', { error, name, email, password, rePassword })
})

// Router.post('/register', validator, (req, res) => {
//     let result = validationResult(req)

//     if (result.errors.length === 0) {
//         const { name, email, password } = req.body
//         const hashed = bcrypt.hashSync(password, 10)

//         const sql = 'insert into account(name, email, password) values (?, ?, ?)'
//         const params = [name, email, hashed]

//         db.query(sql, params, (err, result, fields) => {
//             if (err) {
//                 req.flash('error', err.message)
//                 req.flash('name', name)
//                 req.flash('email', email)

//                 return res.redirect('/register')
//             } else if (result.affectedRows === 1) {
//                 // Tạo thư mục tương ứng với tài khoản
//                 const { root } = req.vars
//                 const userDirectory = `${root}\\users\\${email}`;

//                 // Kiểm tra nếu thư mục đã tồn tại
//                 if (!fs.existsSync(userDirectory)) {
//                     fs.mkdirSync(userDirectory);
//                 } else {
//                     // Thông báo lỗi cho người dùng
//                     req.flash('error', 'Thư mục đã tồn tại.');
//                     req.flash('name', name);
//                     req.flash('email', email);
//                     return res.redirect('/register');
//                 }

//                 return res.redirect('/login')
//             }

//             req.flash('error', 'Đăng ký thất bại.')
//             req.flash('name', name)
//             req.flash('email', email)

//             return res.redirect('/register')
//         })
//     } else {
//         result = result.mapped()

//         let message;
//         for (fields in result) {
//             message = result[fields].msg
//             break
//         }

//         const { name, email } = req.body

//         req.flash('error', message)
//         req.flash('name', name)
//         req.flash('email', email)

//         res.redirect('/register')
//     }
// })
Router.post('/register', validator, (req, res) => {
    let result = validationResult(req);

    if (result.errors.length === 0) {
        const { name, email, password } = req.body;
        const hashed = bcrypt.hashSync(password, 10);

        const sql = 'INSERT INTO account(name, email, password) VALUES (?, ?, ?)';
        const params = [name, email, hashed];

        db.query(sql, params, (err, result, fields) => {
            if (err) {
                req.flash('error', err.message);
                req.flash('name', name);
                req.flash('email', email);

                return res.redirect('/register');
            } else if (result.affectedRows === 1) {
                // Tạo thư mục tương ứng với tài khoản
                const { root } = req.vars;
                const userDirectory = path.join(root, 'users', email); // Use 'path.join' for path construction

                // Kiểm tra nếu thư mục đã tồn tại
                if (!fs.existsSync(userDirectory)) {
                    fs.mkdirSync(userDirectory, { recursive: true }); // Add 'recursive: true' to create directories recursively
                } else {
                    // Thông báo lỗi cho người dùng
                    req.flash('error', 'Thư mục đã tồn tại.');
                    req.flash('name', name);
                    req.flash('email', email);
                    return res.redirect('/register');
                }

                return res.redirect('/login');
            } else {
                req.flash('error', 'Đăng ký thất bại.');
                req.flash('name', name);
                req.flash('email', email);

                return res.redirect('/register');
            }
        });
    } else {
        result = result.mapped();

        let message;
        for (let field in result) { // Changed 'fields' to 'field' to avoid confusion with 'fields' parameter in db.query
            message = result[field].msg;
            break;
        }

        const { name, email } = req.body;

        req.flash('error', message);
        req.flash('name', name);
        req.flash('email', email);

        res.redirect('/register');
    }
});


Router.get('/logout', (req, res) => {
    if(!req.session.user) {
        return res.redirect('/login')
    }

    req.session.destroy()

    res.redirect('/login')
})

module.exports = Router