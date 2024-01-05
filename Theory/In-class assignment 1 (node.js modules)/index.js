const path = require('path')
const url = require('url')
const fs = require('fs')

const url1 = 'http://localhost:3000/document/introduction.txt?user=admin&year=2020'

const obj = url.parse(url1,true)
const {hostname, port, query, pathname} = obj

const domain = hostname + ':' + port

var file = path.basename(pathname)

file = file.split('.')[0] + '_' + query.year + '.' + file.split('.')[1]

fs.mkdirSync(query.user)

filepath = query.user+'/'+file

fs.writeFileSync(filepath,domain)

console.log(filepath)