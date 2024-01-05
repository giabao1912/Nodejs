const express = require('express')
const myjson = require('./myjson')
const myUrlencodedMiddleware = require('./my_urlencoded')

const app = express()

app.use(myjson)
app.use(myUrlencodedMiddleware)

app.post('/test', (req, res) => {
    console.log(req.body);
    res.send('Data received');
});

app.listen(8000, () =>{
    console.log('Sever listening 8000')
})