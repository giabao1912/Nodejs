require('dotenv').config()

const express = require('express')
const flash = require('express-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fs = require('fs');
const multer = require('multer')
const FileReader = require('./fileReader')
const path = require('path');
const rateLimit = require('express-rate-limit');

const UserRouter = require('./routers/UserRouter')

const app = express()

app.set('view engine', 'ejs')

// Chống DDoS
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // số lượng request tối đa trong khoảng thời gian windowMs
    message: 'Quá nhiều yêu cầu từ địa chỉ IP này, vui lòng thử lại sau.'
});

app.use(limiter);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser('cat'));
app.use(session({ cookie: { maxAge: 60000 } }))
app.use(flash());

app.use((req, res, next) => {
    req.vars = { root: __dirname }
    next()
})

app.use('/', UserRouter)

const getCurrentDir = (req, res, next) => {
    if (!req.session.user) {
        return next()
    }

    const { userRoot } = req.session.user
    let { dir } = req.query

    if (dir === undefined) {
        dir = ''
    }

    let currentDir = `${userRoot}/${dir}`

    if (!fs.existsSync(currentDir)) {
        currentDir = userRoot
    }

    req.vars.currentDir = currentDir
    req.vars.userRoot = userRoot
    next()
}

// Hiển thị danh sách
app.get('/', getCurrentDir, (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    let { userRoot, currentDir } = req.vars

    FileReader.load(userRoot, currentDir)
        .then(files => {
            const user = req.session.user
            console.log(currentDir)
            res.render('index', { user, files, currentDir })
        })
})

// Upload
const uploader = multer({ dest: __dirname + '/upload/' })

app.post('/upload', uploader.single('attachment'), (req, res) => {
    const { email } = req.body; // email should be in body if you're setting it from client-side
    const file = req.file;

    if (!email || !file) {
        console.log('Email or file not provided');
        return res.json({ code: 1, message: 'Thông tin không hợp lệ!' });
    }

    const currentPath = path.join(__dirname, 'users', email); // Use path.join for cross-platform compatibility

    if (!fs.existsSync(currentPath)) {
        console.log('Destination path does not exist');
        return res.json({ code: 2, message: 'Đường dẫn cần lưu không tồn tại' });
    }

    let name = file.originalname;
    let newPath = path.join(currentPath, name);

    try {
        fs.renameSync(file.path, newPath);
        console.log('File saved to', newPath);
        return res.json({ code: 0, message: 'Upload thành công, đã lưu tại: ' + newPath });
    } catch (error) {
        console.error('Error saving file:', error);
        return res.status(500).json({ code: 3, message: 'Error saving file' });
    }
});


// Tạo folder
app.post('/create-folder', (req, res) => {
    const { folderName, currentDir } = req.body;

    const newFolderPath = `${currentDir}/${folderName}`;

    if (!fs.existsSync(newFolderPath)) {
        fs.mkdirSync(newFolderPath);
        res.send(`Thư mục "${folderName}" đã được tạo thành công.`);
    } else {
        res.send(`Thư mục "${folderName}" đã tồn tại.`);
    }
});

// Xóa file/folder
app.post('/delete', (req, res) => {
    const { fileName, currentDir } = req.body;
    const targetPath = path.join(currentDir, fileName);

    fs.stat(targetPath, (err, stats) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (stats.isDirectory()) {
            fs.rm(targetPath, { recursive: true }, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                return res.status(200).send('Folder deleted successfully');
            });
        } else {
            fs.unlink(targetPath, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                return res.status(200).send('File deleted successfully');
            });
        }
    });
});


// Tạo text file
app.post('/create-text-file', (req, res) => {
    const fileName = req.body.fileName; // Assuming you're sending the file name from the frontend
    const content = req.body.content; // Assuming you're sending the content from the frontend
    const currentDir = req.body.currentDir;

    const filePath = path.join(currentDir, fileName);

    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error('Error creating text file:', err);
            res.status(500).send('Error creating text file');
        } else {
            res.send('Text file created successfully');
        }
    });
});

// Đổi tên file/folder
app.post('/rename', (req, res) => {
    const { oldName, newName, currentDir } = req.body;

    const oldPath = path.join(currentDir, oldName);
    const newPath = path.join(currentDir, newName);

    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            return res.status(500).send('Lỗi khi đổi tên tập tin/thư mục');
        }
        res.send('Đổi tên thành công');
    });
});

const port = process.env.PORT || 8228
app.listen(port, () => console.log(`http://localhost:${port}`))