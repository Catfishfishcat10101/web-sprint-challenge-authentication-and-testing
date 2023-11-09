const User = require('../users/users-model')

async function checkUsernameFree(req, res, next){
    try{
        const users = await User.findBy({ username: req.body.username })
        if (!users.length){
            next()
        }
        else {
            next({ message: 'username taken', status: 422 })
        }
    } catch(err) {
        next(err)
    }
}

 function checkCredentials(req, res, next){
    const { username, password } = req.body
    if (!username || !password ){
        next({ message: 'username and password required', status: 422 })
    } else {
        next()
    }
}

async function checkUsernameExists(req, res, next){
    try {
        const users = await User.findBy({ username: req.body.username })
        if (users.length){
            req.user = users[0]
            next()
        } else{
            next({ "message": "invalid credentials", status: 401 })
        }
    } catch (err) {
        next(err)
    }
}

module.exports = {
    checkUsernameFree,
    checkCredentials,
    checkUsernameExists
}