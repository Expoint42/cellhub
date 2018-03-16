const VPN = require('../models/vpnModel')

/**
 * 新增VPN
 * 
 * @param { Express.Request } req 
 * @param { Express.Response } res
 * @param { function } next
 */
const addNewVPN = (req, res, next ) => {
    try {
        let newVPN = new VPN(req.body)

        newVPN.save((err, vpn) => {
            if(err) {
                res.status(400).json({ message: err.message })
            }

            res.status(200).json(vpn)
        })
    } catch(err) { next(err) }
}

/**
 * 获取所有 VPN
 * @param { Express.Request } req 
 * @param { Express.Response } res 
 * @param { function } next
 */
const getVPNs = (req, res, next ) => {

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
        let totalCountPromise = VPN.count({}, (err, count) => {
            if(err) {
                res.status(200).send({ message: err.message })
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

            VPN.count(query, (err, count) => {
                if(err) {
                    res.status(200).send({ message: err.message })
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
            VPN.find( query, null, options, (err, results) => {
                if(err){
                    res.status(200).send({ message: err.message })
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
 * 根据 id 获取 VPN
 * @param { Express.Request } req 
 * @param { Express.Response } res
 * @param { function } next
 */
const getVPNById = (req, res, next ) => {
    try {
        VPN.findById(req.params.id, (err, vpn) => {
            if(err) {
                res.status(400).json({ message: err.message })
            } else {
                res.status(200).json(vpn)
            }
        })
    } catch(err) { next(err) }
}

/**
 * 修改 VPN 信息
 * 
 * @param { Express.Request } req 
 * @param { Express.Response } res 
 * @param { function } next
 */
const updateVPNById = (req, res, next) => {
    try {
        VPN.findOneAndUpdate({ _id: req.params.id}, req.body, { new: true }, (err, vpn) => {
            if (err) {
                res.status(400).json({ message: err.message })
            }
            res.status(200).json(vpn)
        })
    } catch(err) { next(err) }
}

/**
 * 删除 VPN 信息
 * @param { Express.Request } req 
 * @param { Express.Response } res 
 * @param { function } next
 */
const deleteVPNById = (req, res, next) => {
    try {
        VPN.remove({ _id: req.params.id }, (err, result) => {
            if (err) {
                res.status(400).json({ message: err.message })
            }
            res.status(200).json(result)
        })
    } catch(err) { next(err) }
}

/**
 * 获取路由器总量
 * @param { Express.Request } req 
 * @param { Express.Response } res 
 */
const countVPNs = (req, res, next) => {
    try {
        VPN.count({}, (err, count) => {
            if(err) {
                res.status(400).json({ message: err.message })
            } else {
                res.status(200).json({ count: count })
            }
        })
    } catch(err) { next(err) }
}

/**
 * 导出相关方法
 */
module.exports = {
    addNewVPN,
    getVPNs,
    getVPNById,
    updateVPNById,
    deleteVPNById,
    countVPNs
}