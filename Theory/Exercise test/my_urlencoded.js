// my_urlencoded.js
const querystring = require('querystring');

function myUrlencodedMiddleware(req, res, next) {
  if (req.headers['content-type'] && req.headers['content-type'].includes('application/x-www-form-urlencoded')) {
    const chunks = [];
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      try {
        const bodyData = Buffer.concat(chunks).toString();
        const urlEncodedData = querystring.parse(bodyData);
        req.body = urlEncodedData;
        next();
      } catch (error) {
        next(error);
      }
    });
  } else {
    next();
  }
}

module.exports = myUrlencodedMiddleware;
