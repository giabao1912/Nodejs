const http = require('http');
const URL = require('url');
const queryString = require('querystring');

const server = http.createServer((req,res) => {
    const url = URL.parse(req.url)
    //console.log(url)
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    })
    if(url.pathname === '/'){
        return  res.end(`
                    <form method ="get" action="/result">
                        <table>
                            <tr>
                                <td>Số hạng 1</td>
                                <td><input type ="text" name="a" placeholder = "Số 1"></td>
                            </tr>
                            <tr>
                                <td>Số hạng 2</td>
                                <td><input type ="text" name="b" placeholder = "Số 2"></td>
                            </tr>
                            <tr>
                                <td>Phép tính</td>
                                <td>
                                    <select name="op">
                                        <option value="">Chọn phép tính</option>
                                        <option value="+">Cộng</option>
                                        <option value="-">Trừ</option>
                                        <option value="*">Nhân</option>
                                        <option value="/">Chia</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><button type = "submit">Tính</button></td>
                            </tr>
                        </table>
                    </form>
        `)
    }
    if(url.pathname === '/result'){
        let query = queryString.decode(url.query);
        //console.log(query)
        if(!query.a){
            return res.end('Thiếu tham số a')
        }
        if(!query.b){
            return res.end('Thiếu tham số b')
        }
        if(!query.op){
            return res.end('Thiếu tham số op')
        }
        let ops = ['+','-','*','/']
        if(!ops.includes(query.op)){
            return res.end('Phép toán không hợp lệ')
        }

        let a = parseInt(query.a)
        let b = parseInt(query.b)
        let calculate = a + b
        if(query.op === '-'){
            calculate = a - b
        }
        else if(query.op === '*'){
            calculate = a * b
        }
        else if(query.op === '/'){
            calculate = a / b
        }
        return  res.end(`Kết quả: ${a} ${query.op} ${b} = ${calculate}`)
    }
    res.end('Trang này chưa được hỗ trợ')
    // console.log(url)
})

server.listen(8080,() =>{
    console.log('Sever is running at http://localhost:8080')
});