const config = require('../config')(process.env.NODE_ENV)
/**
 * 根据请求的 URL 来判断是否允许调用 route
 */

// app._router.stack

// Authn
// Authz


/**
 * 验证用户token信息
 * 
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
export const Verify = (req, res, next) => {

    console.log(req.body)

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-requested-with']
    
    // decode token
    if (token) {
        
        // verifies secret and checks exp
        jwt.verify(token, config.SECRET_KEY, function(err, decoded) {      
            if (err) {
                console.error(err)
                return res.json({ success: false, message: 'Failed to authenticate token.' });    
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded
                req.user = decoded._doc
                next()
            }
        })

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.'
        });

    }
}

export const Auth = (req, res, next) => {
    console.log(req.user)
    if(req.user.usertype === 1) {
        next()
    } else {
        res.json({ success: false, message: 'you do not have permission.'})
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const nocache = (req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}

/**
 * 
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const ACL = (req, res, next) => {

}


/**
 * 初始化，用于创建管理员
 */
export const Initialize = () => {
    try {
        var user = new User({
            name    :   "admin",
            password:   User.passwordHash('admin'),
            usertype:   1,
            phone   :   '未设置',
            email   :   '未设置',
            creator :   'system'
        })

        // save to DB
        User.create(user, function(err, result){
            if (err) { throw err } 
            else if (result != null){
                console.log('admin create successfully.')
            } else {
                throw new Error('created admin falied')
            }
        })
    } catch (err) { throw err }
}


export const Dummy = (req, res, next) => {
    
    let dummyNum = 96 // || req.params.num;

    // console.log(req.params);
    // console.log(dummyNum);

    for (let i=0; i< dummyNum; i ++ ){
        try{
            // everything is ok.
            var user = new User({
                name    :   'dummy' + i,
                password:   User.passwordHash("a123"),
                usertype:   2,
                phone   :   '1561781'+ utils.randomIntFromInterval(1000,9999),
                email   :   utils.randomIntFromInterval(30000,99990) + "@qq.com",
                creator :   "admin"
            })
    
            // save to DB
            User.create(user, function(err, result){
                if (err) { 
                    console.error(err) 
                } else if (result != null){
                    console.log('created' + user.name)
                } else {
                    console.log('Add user failed') 
                }
            })
        } catch(err){ next(err) }
    }
}
