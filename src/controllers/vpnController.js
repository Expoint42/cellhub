const VPN       = require('../models/vpn')
const utils     = require('../utils')


/**
 * Must Create the vpn config before you call this
 * Create a new VPN
 *         { name: 'netname',  propType:'string' },
        { name: 'gateway',  propType:'string' },
        { name: 'port',     propType:'number' }
 * @param { Express.Request } req 
 * @param { Express.Response } res 
 * @param {*} next 
 */
export const addNewVPN = (req, res, next) => {

    let newVPN = new VPN(req.body)

    newVPN.save((err, vpn) => {
        if(err) {
            res.status(400).send(err)
        }

        res.status(200).json(vpn)
    })
}

/**
 * { name: 'netname',  propType:'string' }
 * @param { Express.Request } req 
 * @param { Express.Response } res 
 * @param {*} next 
 */
export const allocate = (req, res, next) => {
        
    // everything is ok.
    let netname = req.body.netname
    let query = { netname: netname }

    VPN.findOne( query, (err, result) => {
        if(err){
            console.error(err)
            return { success: false, message: err.message }
        } else if( result ==null ) {
            return { success: false, message: "VPN not found by netname: " + netname}
        } else {

            let candidate = -1

            for(let i=result.ip_from; i<= result.ip_to; i++){
                if ( !result.in_use.includes(i) ) {
                    candidate = i
                    break
                }
            }
            
            if ( candidate !== -1 ) {
                // add this candidate to database [in_use]
                console.log("WTF??????!")
                console.log(result)
                let digits = result.gateway.split(".")

                digits[3] = candidate
                req.body.address = digits.join(".")

                digits[3] = 0
                req.body.subnet = digits.join(".") + "/24"


                let ipInUse = result.in_use
                ipInUse.push(candidate)

                console.log(ipInUse)
                
                VPN.update(query, { in_use: ipInUse }, function(err2, result2) {
                    if(err2){
                        console.error(err2)
                        return res.status(200).send({ success:false, message: err2.message}) 
                    } else {
                        console.log(result2)               
                        next()
                    }
                })
            } else {
                res.send({ success: false, message: "Can't allocate IP, contact the manager please." })
            }
        }
    })
}