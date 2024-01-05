function myjson (req, res,next){
    if(req.is('application/json')){
        let data = '';
        req.on('data',chunk =>{
            data += chunk;
        })
        req.on('end', () =>{
            try {
                req.body = JSON.parse(data)
                next();
            } catch (error) {
                res.status(404).send('Invalid JSON')
            }
        })
    }else{
        next();
    }
}

module.exports = myjson