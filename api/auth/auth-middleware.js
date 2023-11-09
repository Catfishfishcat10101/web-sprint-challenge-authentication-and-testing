const User = require('./auth-model')

async function checkUsernameFree(req, res, next) {
    try{
      const users = await User.findBy({username: req.body.username})
        if(!users.length) {
            next()
        } else {
            next({status: 422, message: 'username taken'})
        } 
    } catch (err) {
      next(err)
    }
  }
  
  async function checkUsernameExists(req, res, next) {
    try{
      const users = await User.findBy({username: req.body.username})
        if(users.length) {
            req.user = users[0]
            next()
        } else {
            next({status: 401, message: 'invalid credentials'})
        }
    } catch (err) {
      next(err)
    }
  }
  
  async function checkPayload(req, res, next) {
    if (!req.body.password || !req.body.username) {
      next({ status: 422, message: 'username and password required' })
    } else {
      next()
    }
  }
  
  module.exports = {
    checkUsernameFree,
    checkUsernameExists,
    checkPayload
  }