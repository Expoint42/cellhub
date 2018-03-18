const User = require('../models/userModel')

/**
 * 添加用户
 * 必备字段：
 * username
 * password
 * phone
 */
const addNewUser = (req, res, next) => {
    try{
        let newUser = new User(req.body)

        newUser.save(( err, user) => {
            if(err) {
                res.status(400).send({ message: err.message })
            }

            res.status(200).json(user)
        })
    } catch(err){ next(err) }
}

/**
 * 
 * @param { Express.Request } req 
 * @param { Express.Response } res 
 * @param { function } next 
 */
const getUserById = (req, res, next) => {
    try {
        User.findById(req.params.id, (err, user) => {
            if(err) {
                res.status(400).json({ message: err.message })
            }
            res.status(200).json(user)
        })
    } catch(err){ next(err) }
}


/**
 * 查询用户信息
 * Request data example:
 * 
 * HTTP Header: Cookie: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 * HTTP Body  : {"usertype":1,"name":"ddd", "skip":0,"limit":10}
 * 说明: skip表示跳过多少条记录，limit表示前多少条记录。两个字段配合用于分页查询。
         skip和limit是必填的，如果只有skip和limit两个字段，则查询所有的用户。针对name字段使用模糊查询。
* Return： 成功返回用户信息组成的json数组。失败返回错误信息
* Eg: 
    [ {"id":"dwerw34edf5", "name":"sder","password":"",
        "usertype":1,"phone":"13523087907",
        "email":"huanshikeji@163.com","creator":"admin",
        "createdAt":"2017-08-01 18:51","updatedAt":" 2017-08-01 18:51"} ]

*/
const getUsers = (req, res, next) => {

    try {
        let search = req.query['search[value]']
        let draw = parseInt(req.query.draw)
        let start = parseInt(req.query['start'])
        let length = parseInt(req.query['length'])

        let query   = {}            
        let recordsTotalCount = 0
        let recordsFilteredCount = 0

        // Do the count work.
        // Match the [DataTable](https://datatables.net/manual/server-side) query pattern, need get the amount of records.
        let totalCountPromise = User.count({}, (err, count) => {
            if(err) {
                res.status(400).send({ message: err.message })
            } else {
                recordsTotalCount = count
            }
        })

        // Do filter work.
        let filterCountPromise = totalCountPromise.then(()=>{                        
            // if client provide the usertype parameter
            if (req.body.usertype) {
                if (!isNaN(parseInt( req.body.usertype ))) {
                    query.usertype = parseInt(req.body.usertype)
                } else {
                    res.status(400).send({ message: 'usertype is not numeric' }) 
                }
            }
    
            // if client provide the name type
            if (search) {
                console.log('search....', search)
                query.name = new RegExp(search, 'i')
            }

            User.count(query, (err, count) => {
                if(err) {
                    res.status(400).send({ message: err.message })
                } else {                                
                    recordsFilteredCount = count
                    // don't delete.
                    // don't know why, must print then can get it's value.
                    console.log(recordsFilteredCount)
                }
            })
        })

        // Do the query work.
        filterCountPromise.then(()=>{
            let options = { skip: start, limit: length, sort: { createdAt: -1 } }
            
            User.find( query, null, options, (err, results) => {
                if(err){
                    res.status(400).send({ message: err.message })
                } else {
                    res.status(200).send({
                        draw: draw, 
                        recordsTotal: recordsTotalCount,
                        recordsFiltered: recordsFilteredCount, 
                        data: results })
                }
            })
        })

    } catch(err){ next(err) }
}

/**
 * 修改用户信息（修改密码也使用该接口）
 * Request data example:
 * 
 * HTTP Header: Cookie: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 * HTTP Body  : {"objectid":"dwerw34edf5","name":"sder","usertype":1,"phone":"13523087907","email":"huanshikeji@163.com" }
 * 说明：HTTPBody 里填写修改的用户信息,objectid是必填的
 * Return： 成功返回200。失败返回错误信息
 */
const updateUserById = (req, res, next) => {
    try {
        User.findOneAndUpdate({ _id: req.params.id}, req.body, { new: true }, (err, user) => {
            if (err) {
                res.status(400).json({ message: err.message })
            }
            res.status(200).json(user)
        })
    } catch(err){ next(err) }
}

/**
 * 删除用户(根据objectid删除)
 * Request data example:
 * 
 * HTTP Header: Cookie: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 * HTTP Body  : {"objectid":"dwerw34edf5" }
 * Return： 成功返回200。失败返回错误信息
 */
const deleteUserById = (req, res, next) => {
    
    try{
        User.remove({ _id: req.params.id }, (err, result) => {
            if(err) {
                res.status(400).send({ message: err.message })
            }
            res.status(200).json( result)
        })
    } catch(err){ next(err) }
}


/**
 * 删除用户(根据objectid删除)
 * Return： 成功返回200。失败返回错误信息
 */
const deleteUsers = (req, res, next) => {

    try{

        let deleteIds = []
        
        if(req.body.ids){
            let tempIds = req.body.ids.split(',')
            tempIds.forEach(function(id) {
                deleteIds.push(id.trim())
            }, this)
        }

        User.remove({ _id : { $in: deleteIds }}, (err, result ) => {
            if(err){
                res.status(200).send({ message: err.message}) 
            } else {
                res.status(200).send( result )
            }
        })
    } catch(err){ next(err) }
}

/**
 * 获取用户数量
 * Request data example:
 * 
 * HTTP Header: Cookie: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 * HTTP Body  : null
 * Return： 成功返回用户数量。失败返回错误信息
 */
const countUsers = (req, res, next) => {
    try {
        let query   = {}
        // if client provide the usertype parameter
        if (req.body.usertype) {
            if (!isNaN(parseInt( req.body.usertype ))) {
                query.usertype = parseInt(req.body.usertype)
            } else {
                return res.status(200).send({ success:false,  message: 'usertype is not numeric' }) 
            }
        }

        // if client provide the name type
        if (req.body.name) {
            query.name = new RegExp(req.body.name, 'i')
        }

        User.count(query, (err, count) => {
            if(err) {
                console.error(err)
                return res.status(200).send({ success:false,  message: err.message })
            } else {
                return res.status(200).send({ success:true,   message: 'ok', count: count })
            }
        })
    } catch(err) { next(err)}
}


module.exports =  { 
    addNewUser, 
    getUserById, 
    getUsers, 
    updateUserById, 
    deleteUserById,
    deleteUsers,
    countUsers 
}