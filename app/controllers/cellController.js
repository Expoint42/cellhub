const Cell      = require('../models/cellModel')

/**
 * 新增路由器
 * 
 * @param { Express.Request } req 
 * @param { Express.Response } res
 */
const addNewCell = ( req, res ) => {

    let newCell = new Cell(req.body)

    newCell.save((err, cell) => {
        if(err) {
            res.status(400).send({ message: err.message })
        }
        res.status(200).json(cell)
    })
}

/**
 * 查询路由器信息
 * 
 * 说明: skip表示跳过多少条记录，limit表示前多少条记录。两个字段配合用于分页查询。
         skip和limit是必填的，如果只有skip和limit两个字段，则查询所有的用户。针对name字段使用模糊查询。
* Return： 成功返回用户信息组成的json数组。失败返回错误信息
 * @param { Express.Request } req 
 * @param { Express.Response } res 
 * @param { function } next 
 * @returns 
 */
const getCells = (req, res, next) => {

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
        let totalCountPromise = Cell.count({}, (err, count) => {
            if(err) {
                console.error(err)
                return res.status(400).send({ message: err.message })
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
                    return res.status(400).send({ message: err.message })
                } else {                                
                    recordsFilteredCount = count
                    // don't delete.
                    // TODO: don't know why, must print then can get it's value.
                    console.log(recordsFilteredCount)
                }
            })
        })

        // Do the query work.
        filterCountPromise.then(()=>{
            let options = { skip: start, limit: length, sort: { createdAt: -1 } }  
            Cell.find( query, null, options, (err, results) => {
                if(err){
                    console.error(err)
                    return res.status(400).send({ message: err.message })
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
 * @param { Express.Request } req 
 * @param { Express.Response } res
 */
const getCellById = (req, res) => {
    Cell.findById(req.params.id, (err, cell) => {
        if(err) {
            res.status(400).json({ message: err.message })
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
 * @param { Express.Request } req 
 * @param { Express.Response } res 
 * @param { function } next
 * @returns
 */
const updateCellById = (req, res) => {
    // insert the update time to the update data.
    req.body.updatedAt = new Date().getTime()

    Cell.findOneAndUpdate({ _id: req.params.id}, req.body, { new: true }, (err, cell) => {
        if (err) {
            res.status(400).json({ message: err.message })
        }
        res.status(200).json(cell)
    })
}

/**
 * This is a special method only for tinc host-up & host-down hook script
 * @param { Express.Request } req 
 * @param { Express.Response } res
 */
const updateCellStatus = (req, res) => {

    Cell.findOneAndUpdate(
        { _id: req.body._id}, 
        { status: req.body.status === '1' ? true : false }, 
        { new: true }, 
        (err, cell) => {
            if (err) {
                res.status(400).json({ message: err.message })
            } else {
                res.status(200).json(cell)
            }
        }
    )
}

/**
 * 删除路由器信息(根据objectid删除)
 * Return： 成功返回200。失败返回错误信息
 * @param { Express.Request } req 
 * @param { Express.Response } res 
 * @param { function } next 
 */
const deleteCells = (req, res, next) => {
    try{
        let deleteIds = []
        
        if(req.body.ids){
            let tempIds = req.body.ids.split(',')
            tempIds.forEach(function(id) {
                deleteIds.push(id.trim())
            }, this)
        }

        Cell.remove({ _id : { $in: deleteIds }}, (err, result) => {
            if(err){
                return res.status(400).send({ message: err }) 
            } else {
                return res.status(200).send( result )
            }
        })
    } catch(err){ next(err) }
}

/**
 * 根据 Cell Id 删除 Cell
 * @param { Express.Request } req 
 * @param { Express.Response } res 
 */
const deleteCellById = (req, res ) => {
    Cell.remove({ _id: req.params.id }, (err, result) => {
        if (err) {
            res.status(400).json({ message: err.message })
        }
        res.status(200).json(result)
    })
}

/**
 * 获取路由器总量
 * @param { Express.Request } req 
 * @param { Express.Response } res 
 */
const countCells =(req, res) => {
    Cell.count({}, (err, count) => {
        if(err) {
            res.status(400).json({ message: err.message })
        } else {
            res.status(200).json({ count: count})
        }
    })
}

module.exports = { 
    addNewCell, 
    getCells, 
    getCellById, 
    updateCellById,
    updateCellStatus, 
    deleteCells, 
    deleteCellById, 
    countCells 
}
