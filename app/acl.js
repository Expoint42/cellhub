const User          = require('./models/userModel')
    , jwt               = require('jsonwebtoken') // used to create, sign, and verify tokens
    , config        = require('../config')(process.env.NODE_ENV)

/**
 * 初始化，用于创建管理员
 */
const init = (req, res) => {
    try {
        let newUser = new User({
            username:   'admin',
            password:   'admin',
            usertype:   1,
            phone   :   '18838152065',
        })

        newUser.save((err, user) => {
            if(err) {
                res.status(400).json({ message: err.message })
            } else {
                res.status(200).json({ message: `create ${user.username} ok`})
            }
        })
    } catch (err) { throw err }
}


/**
 * 登录
*/
const authenticate = (req, res, next) => {

    if(!req.body.username) {
        return res.status(400).json({ message: 'username can not be empty'})
    }

    if(!req.body.password) {
        return res.status(400).json({ message: 'password can not be empty'})
    } 

    try {

        // hash current password
        req.body.password = User.hashPassword(req.body.password)

        // find user based on username and password
        User.findOne( req.body, function(err, user){

            if( err) {
                return res.status(400).json({ message: err.message })
            }

            if (!user) {
                return res.status(400).json({ message: 'user not found' })
            }

            // here the user is an object return from mongoose, which maybe can't
            // serialzie
            // https://stackoverflow.com/a/47118163/5176750
            let token = jwt.sign(user.toJSON(), config.SECRET_KEY, {
                expiresIn : 60*60*24 // expires in 24 hours
            })

            return res.status(200).json({ token: token  })
        })
    } catch (err) { next(err) }
}

const doAuthorize = (req) => {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-requested-with']
    
    let result = { success: false, message: 'system error'}

    // decode token
    if (token) {
        
        // verifies secret and checks exp
        jwt.verify(token, config.SECRET_KEY, (err, decoded) => {      
            if (err) {
                result = { success: false, message: 'failed to authenticate token'  }
            } else {
                // if everything is good, save to request for use in other routes
                req.user = decoded
                result = { success: true }
            }
        })
    } else {
        result = { success: false, message: 'no token provided'  }
    }

    return result
}

const authorizeGuest = ( req, res, next ) => {
    next()
}

const authorizeUser = (req, res, next) => {

    let result = doAuthorize(req)

    if (result.success) {
        next()
    } else {
        res.status(400).json( { message: result.message })
    }

}

const authorizeAdmin = (req, res, next) => {
    let result = doAuthorize(req)

    if (result.success) {
        if(req.user.usertype === 1) {
            next()
        } else {
            res.status(400).json({ message: 'you do not have permission'})
        }
    } else {
        res.status(400).json( { message: result.message })
    }
}


const USER_LEVEL = {
    Guest:  0,
    User :  1,
    Admin:  99
}

const ACL = ( userLevel ) => {

    let level = userLevel || 0

    switch(level) {
    case 0 : return authorizeGuest
    case 1 : return authorizeUser
    case 99: return authorizeAdmin
    }
}

// const ACL = {
//     Guest:  authorizeGuest,
//     User:   authorizeUser,
//     Admin:  authorizeAdmin
// }

module.exports = {
    USER_LEVEL,
    ACL,
    init,
    authenticate
}