const fs        = require('fs')
const path      = require('path')
const Cell      = require('../models/cellModel')

/**
 * Router Initialize Handler
 * req.body example: 
 * {    mac_addr: "08:00:27:5D:C5:A1", 
 *      username: "admin", 
 *      password: "admin" }
 * @param { Express.Request } req 
 * @param { Express.Response } res 
 * @param {*} next 
 */
export const addNewCell = (req, res, next) => {

    // const requiredProps = [
    //     { name: 'mac',      propType:'string' },
    //     { name: 'netname',  propType:'string' },
    //     { name: 'hostname', propType:'string' },
    //     { name: 'address',  propType:'string' },
    //     { name: 'subnet',   propType:'string' }
    // ]

    let newCell = new Cell(req.body);

    newCell.save((err, cell) => {
        if(err) {
            res.send(err)
        }

        res.json(cell)
    })
    
    try{
        // utils.checkProps(req.body, requiredProps)
        // everything is ok.
        let mac         = req.body.mac
        let netname     = req.body.netname
        let hostname    = req.body.hostname
        let address     = req.body.address
        let subnet      = req.body.subnet

        let newCell     = new Cell({ 
            mac     :   mac,
            netname :   netname,
            hostname:   hostname,
            address :   address,
            subnet  :   subnet
        })

        Cell.create(newCell, function(err, result) {
            if(err) {
                // TODO: make the err message more readable for client
                return res.status(200).send({ success:false, message: err.message })
            }
            
            if (result == null){
                return res.status(200).send({ success:false,  message: 'Add router failed' })
            } else {
                let node = result._id.toString()
                res.send(`${node} ${address} ${subnet}`)
            }
        })
    } catch(err){ next(err) }
}

/**
 * 查询路由器信息
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
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const getCells = (req, res, next) => {

    try {

        let search = req.query['search[value]']
        let draw = parseInt(req.query.draw);
        let start = parseInt(req.query['start']);
        let length = parseInt(req.query['length']);

        let query   = {}
        let recordsTotalCount = 0
        let recordsFilteredCount = 0

        // Do the count work.
        // Match the [DataTable](https://datatables.net/manual/server-side) query pattern, need get the amount of records.
        let totalCountPromise = Cell.count({}, (err, count) => {
            if(err) {
                console.error(err)
                return res.status(200).send({ success:false,  message: err.message })
            } else {
                recordsTotalCount = count
            }
        })

        // Do filter work.
        let filterCountPromise = totalCountPromise.then(()=>{

            // if client provide the name type
            if (search) {
                console.log('search....', search)
                query.name = new RegExp(search, 'i')
            }

            Cell.count(query, (err, count) => {
                if(err) {
                    console.error(err)
                    return res.status(200).send({ success:false,  message: err.message })
                } else {                                
                    recordsFilteredCount = count
                    // don't delete.
                    // TODO: don't know why, must print then can get it's value.
                    console.log(recordsFilteredCount)
                }
            })
        })

        // Do the query work.
        let queryPromise = filterCountPromise.then(()=>{
            let options = { skip: start, limit: length, sort: { createdAt: -1 } }  
            Cell.find( query, null, options, (err, results) => {
                if(err){
                    console.error(err)
                    return res.status(200).send({ success:false,  message: err.message })
                } else {
                    return res.status(200).send({
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
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const getCellById = (req, res, next) => {
    Cell.findById(req.params.id, (err, cell) => {
        if(err) {
            res.status(400).send(err)
        } else {
            res.status(200).json(cell)
        }
    })
}

/**
 * 修改路由器信息
 * 
 * HTTP Header: Cookie: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 * HTTP Body  : {"objectid":"dwerw34edf5","name":"sder","usertype":1,"phone":"13523087907","email":"huanshikeji@163.com" }
 * 说明：HTTPBody 里填写修改的用户信息,objectid是必填的
 * Return： 成功返回200。失败返回错误信息
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next
 * @returns
 */
export const updateCellById = (req, res, next) => {
    // insert the update time to the update data.
    req.body.updatedAt = new Date().getTime()

    Cell.findOneAndUpdate({ _id: req.params.id}, req.body, { new: true }, (err, cell) => {
        if (err) {
            res.status(400).send(err);
        }
        res.status(200).json(cell);
    })
}

/**
 * This is a special method only for tinc host-up & host-down hook script
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const updateCellStatus = (req, res, next) => {

    Cell.findOneAndUpdate(
        { _id: req.body._id}, 
        { status: req.body.status === "1" ? true : false }, 
        { new: true }, 
        (err, cell) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(200).json(cell);
            }
    })
}

/**
 * 删除路由器信息(根据objectid删除)
 * Return： 成功返回200。失败返回错误信息
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const deleteCell = (req, res, next) => {
    try{
        let deleteIds = []
        
        if(req.body.ids){
            let tempIds = req.body.ids.split(',')
            tempIds.forEach(function(id) {
                deleteIds.push(id.trim())
            }, this);
        }

        Cell.remove({ _id : { $in: deleteIds }}, (err) => {
            if(err){
                console.error(err)
                return res.status(200).send({ success:false, message: err.message}) 
            } else {
                return res.status(200).send({ success: true, message: 'ok' })
            }
        })
    } catch(err){ next(err) }
}

export const deleteCellById = (req, res, next) => {
    console.log(req.body)
    console.log(req.params)
    console.log(req.query)
}

/**
 * 获取路由器总量
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const count =(req, res, next) => {
    Cell.count({}, (err, count) => {
        if(err) {
            console.error(err)
            return res.status(400).send(err)
        } else {
            return res.status(200).json({ count: count})
        }
    })
}


/**
 * Cell upload it's host file
 * @param { Express.Request } req 
 * @param { Express.Response } res 
 * @param {*} next 
 */
export const hosts = (req, res, next) => {
    
    // const requiredProps = [
    //     { name: 'node',     propType:'string' },
    //     { name: 'netname',  propType:'string'},
    //     { name: 'hostfile', propType:'string' }
    // ]
    
    try{
        // utils.checkProps(req.body, requiredProps)
        // everything is ok.
        let node = req.body.node
        let netname = req.body.netname
        let hostfile = req.body.hostfile            
        let hostsFilePath = path.join( envConfig.tincRoot, netname, "hosts" )

        let splitedHostfile = hostfile.split('-----')
        splitedHostfile[2] = splitedHostfile[2].replace(/[ \t\r]/g, "+") // replace all space(without tab & newline) with "+"
        let fixedHostfile = splitedHostfile.join('-----')
        console.log(fixedHostfile)

        fs.writeFile(`${hostsFilePath}/${node}`, fixedHostfile, (w_err) => {
            if(w_err) {
                console.log(w_err.message)
                res.status(500).send('error')
            } else {
                res.download(path.join(hostsFilePath, "ac"))
            }
        })
    } catch(err){ next(err) }
}
