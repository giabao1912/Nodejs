const http = require('http');
const queryString = require('querystring');
const path = require('path');
const fs = require('fs');
const URL = require('url');

let students = new Map();
let pattern = /\/students\/[a-zA-Z0-9]+\/*$/ig;

// students.set(1, {
//     id: 1,
//     name: "Nguyen Van A"
// })
// students.set(2, {
//     id: 2,
//     name: "Nguyen Van B"
// })
// students.values() => [
//     { id: 1, name: "Nguyen Van A" },
//     { id: 2, name: "Nguyen Van B" }
// ]
// students.has(1) => true
// students.has(2) => true
// students.has(3) => false
// students.get(1) => { id: 1, name: "Nguyen Van A" }
// students.delete(1)

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    })
    let url = URL.parse(req.url)
    if (url.pathname === '/students') {
        if (req.method === 'POST') {
            return addStudent(req, res)
        }
        if (req.method === 'GET') {
            return loadStudent(req, res)
        }
        if (req.method === 'PUT') {
            return updateStudent(req, res)
        }
        else return res.end(JSON.stringify({ code: 101, message: `Phương thức ${req.method} không được hỗ trợ` }))
    }
    else if (url.pathname.match(pattern)) {
        // find URL student{id}
        let idPattern = /[a-zA-Z0-9]+\/*$/ig
        let studentId = url.pathname.match(idPattern)[0].replace(/\/*$/ig, '');
        if(req.method === 'GET') {
            return findStudentID(req, res, studentId)
            // console.log("Id + ",studentId)
            // return res.end('Đã nhận được ID' + studentId)
        }
        if(req.method === 'PUT') {
            return updateStudent(req, res, studentId)
        }
        if(req.method === 'DELETE') {
            return deleteStudent(req, res, studentId)
        }
    }
    else return res.end(JSON.stringify({ code: 100, message: 'Đường dẫn không hỗ trợ' }))
})

function addStudent(req, res) {
    let body = ''
    req.on('data', d => body += d.toString())
    req.on('end', () => {
        let input = queryString.decode(body)
        if (!input.id) {
            return res.end(JSON.stringify({ code: 1, message: 'Chưa có mã sinh viên' }))
        }
        if (!input.name) {
            return res.end(JSON.stringify({ code: 1, message: 'Chưa có tên sinh viên' }))
        }
        if (!input.age) {
            return res.end(JSON.stringify({ code: 1, message: 'Chưa có tuổi sinh viên' }))
        }
        if (isNaN(input.age)) {
            return res.end(JSON.stringify({ code: 1, message: 'Tuổi sinh viên bị sai định dạng' }))
        }
        if (input.age < 0) {
            return res.end(JSON.stringify({ code: 1, message: 'Tuổi sinh viên không có giá trị âm' }))
        }
        if (students.has(input.id)) {
            return res.end(JSON.stringify({ code: 2, message: `Sinh viên ${input.id} đã tồn tại` }))
        }
        console.log(students.set(input.id, input))
        return res.end(JSON.stringify({ code: 0, message: 'Đã thêm sinh viên thành công' }))
    })
}

function loadStudent(req, res) {
    if (students.size === 0) {
        return res.end(JSON.stringify({ code: 102, message: 'Chưa có sinh viên' }))
    }
    let studentsList = Array.from(students.values())
    return res.end(JSON.stringify({ code: 0, message: 'Đọc sinh viên thành công', data: studentsList }))
}
function findStudentID(req, res, studentId) {
    if (!students.has(studentId)) {
        return res.end(JSON.stringify({ code: 1, message: `Không tồn tại sinh viên có mã số ${studentId} này` }))
    }
    let student = students.get(studentId)
    return res.end(JSON.stringify({ code: 0, message: 'Đã tìm thấy sinh viên', data: student }))
}

function updateStudent(req, res, studentId) {
    let body = ''
    let student = students.get(studentId)
    req.on('data', d => body += d.toString())
    req.on('end', ()=>{
        let update = queryString.decode(body)
        if(!students.has(studentId)){
            return res.end(JSON.stringify({ code: 1, message: `Không tồn tại sinh viên có mã số ${studentId} này` }))
        }
        if(update.name){
            student.name = update.name
        }
        if(update.age){
            student.age = update.age
        }
        return  res.end(JSON.stringify({ code: 0, message: 'Đã cập nhật thông tin sinh viên bằng phương thức PUT', data: student }));
    })
}

function deleteStudent(req, res,studentId) {
    let body = ''
    req.on('data', d => body += d.toString())
    req.on('end' , ()=>{
        let input = queryString.decode(body)
        if(!students.has(studentId)){
            return res.end(JSON.stringify({ code: 1, message: `Không tồn tại sinh viên ${studentId} này` }))
        }
        let deleteID = students.delete(studentId)
        return  res.end(JSON.stringify({ code: 0, message: 'Đã xóa thông tin sinh viên ', data: deleteID }));
    })
}
server.listen(8080, () => {
    console.log("Sever is listening")
})