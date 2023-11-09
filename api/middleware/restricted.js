const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../auth/secrets/index.js'); 

const restrict = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    res.status(401).json({ message: 'token required' })
  } 
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      res.status(401).json({ message: 'token invalid' })
    } else {
      req.decodedToken = decodedToken
      next()
    }
  })
};
module.exports = restrict;