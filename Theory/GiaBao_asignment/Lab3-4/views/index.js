const express = require('express')
const path = require('path')
const app = express()

app.get('/login', (req, res) => {
    // res.send('Hello, world')
    const file = path.join(__dirname, 'login.html')
    res.sendFile(file)
})
app.listen(3000, () => console.log('http://localhost:3000'))