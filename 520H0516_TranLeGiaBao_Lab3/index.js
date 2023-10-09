
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const emailValidator = require('email-validator');
const fn = require('./function')
require('dotenv').config();
const PORT = process.env.PORT;
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const upload = multer({
    storage: storage,
    dest: 'uploads/',
    fileFilter: function (req, file, callback) {
        if (file.mimetype.startsWith('image/')) {
            callback(null, true)
        }
        else callback(null, false)
    }, limits: { fileSize: 50000 }
})



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

let products = [
    { id: 1, name: "iPhone 12 Pro", price: 30000000 },
    { id: 2, name: "iPhone 11", price: 17000000 },
    { id: 3, name: "iPhone Xr", price: 11000000 },
]

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));

app.use((req, res, next) => {
    res.locals.flashMessages = req.session.flashMessages || [];
    req.session.flashMessages = [];
    next();
});

app.get('/', (req, res) => {
    res.render('index', { products })
})

app.get('/login', (req, res) => {
    // res.send('Trang chu login')
    res.render('login', { email: '', password: '', })
})
app.post('/login', (req, res) => {
    let body = req.body;
    let err = ''
    if (!body.email) {
        err = 'Please enter your email'
    }
    else if (!emailValidator.validate(body.email)) {
        err = 'Email is not valid'
    }
    else if (!body.password) {
        err = 'Please enter your password'
    }
    else if (body.password.length < 6) {
        err = 'Password should have at least 6 character'
    }
    else if (body.email !== EMAIL || body.password !== PASSWORD) {

        err = 'Invalid Email or Password'
    }
    if (err.length > 0) {
        res.render('login', { errorMessage: err })
    }
    else {
        res.end('Login successful')
    }
    return res.redirect('/')
})

app.get('/add', (req, res) => {
    res.render('add')
})
app.post('/add', (req, res) => {
    const uploader = upload.single('image')
    uploader(req, res, err => {
        let image = req.file
        let { name, price, desc } = req.body;
        let errorMsg = fn.checkProductValidation(name, price, image, err, desc);
        // if (!image) {
        //     res.end('No image found')
        // }
        // else if (err) {
        //     res.end('Image is too large')
        // }
        // else res.end('Xu ly thanh cong')
        if (errorMsg.length > 0) {
            return res.status(403).render('add', {
                name,
                price,
                desc,
                image,
                errorMsg,
            });
        }
        products.push({
            id: products.length + 1,
            name,
            price: parseInt(price),
            desc,
            imgName: req.file.filename,
        });
        fn.addFlashMessage(req,'success', 'Product added successfully');
    })
    return res.redirect('/');
})



app.use((req, res) => {
    res.end('Lien ket nay khong duoc ho tro')
})

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));