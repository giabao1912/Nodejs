const http = require('http')
const URL = require('url')
const path = require('path')
const querystring = require('querystring')
const fs = require('fs')

const sever = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type':'text/html; charset= utf-8'
    })
    let url = URL.parse(req.url)
    if(url.pathname === '/') {
        let html = fs.readFileSync(path.join(__dirname,'/view/login.html'))
        return res.end(html)
    }
    // if(url.pathname === '/success') {
    //     let html = fs.readFileSync(path.join(__dirname,'/view/success.html'))
    //     return res.end(html)
    // }
    // if(url.pathname === '/fail') {
    //     let html = fs.readFileSync(path.join(__dirname,'/view/fail.html'))
    //     return res.end(html)
    // }
    if(url.pathname ==='/login') {
        return handleLogin(req, res)
    }
    let html = fs.readFileSync(path.join(__dirname,'/view/fail.html')).toString()
    html = html.replace('xxxxxxxxxxxxx',`Đường dẫn không hợp lý`)
    return res.end(html)
})

function handleLogin(req,res) {
    let html = fs.readFileSync(path.join(__dirname,'/view/fail.html')).toString()
    if(req.method !== 'POST'){
        html = html.replace('xxxxxxxxxxxxx',`Phương thức ${req.method} không được hỗ trợ`)
        return res.end(html)
    }
    let body = ''
    req.on('data', d => body += d.toString())
    req.on('end', () => {
        let input = querystring.decode(body)
        // console.log(input)
        if(!input.email){
            return res.end(html.replace('xxxxxxxxxxxxx',`Thiếu thông tin email`))
        }
        if(!input.password){
            return res.end(html.replace('xxxxxxxxxxxxx',`Thiếu thông tin password`))
        }
        if(input.password.length < 6){
            return res.end(html.replace('xxxxxxxxxxxxx',`Mật khẩu phải nhiều hơn 6 kí tự`))
        }
        if(!input.email.includes('@')){
            return res.end(html.replace('xxxxxxxxxxxxx',`Thiếu giống @ trong mail`))
        }
        if(input.email !== "admin@gmail.com" || input.password !== "123456"){
            return res.end(html.replace('xxxxxxxxxxxxx',`Sai email hoặc mật khẩu`))
        }
        let successHTML = fs.readFileSync(path.join(__dirname,'/view/success.html')).toString()
        return res.end(successHTML)
    })
}

sever.listen(8080,() =>{
    console.log("Sever is listening at http://localhost:8080")
})