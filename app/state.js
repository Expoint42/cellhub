const utils = require('./utils')
    , Connection    = require('./models/connectionModel')

let stateOfCells = new Map()
let dailyConnectNum = 0

/**
 *  gw_id=E4956E43595E&
    sys_uptime=78126&
    sys_memfree=32588&
    sys_load=0.00&
    nf_conntrack_count=18&
    cpu_usage=1.00%25&
    wifidog_uptime=78030&
    online_clients=3&
    offline_clients=0&
    ssid=AAAAA&
    version=null&
    type=null&
    name=gl-mifi&
    channel_path=null&
    wired_passed=1
 * @param { object } cell 
 */
const refreshStateOfCells = (cell) => {

    if(cell == null) return

    if (stateOfCells.has(cell.gw_id)) {
        let theCell         = stateOfCells.get(cell.gw_id)
        theCell.uptime      = cell.sys_uptime
        theCell.memfree     = cell.sys_memfree
        theCell.load        = cell.sys_load
        theCell.sessions    = cell.nf_conntrack_count
        theCell.cpu         = cell.cpu_usage
        theCell.online      = cell.online_clients
    } else {
        stateOfCells.set(cell.gw_id, {
            id      : cell.gw_id,
            uptime  : cell.sys_uptime,
            memfree : cell.sys_memfree,
            load    : cell.sys_load,
            sessions: cell.nf_conntrack_count,
            cpu     : cell.cpu_usage,
            online  : cell.online_clients,
            clients : new Map()
        })
    }
}

/**
 * /wifidog/auth/?stage=counters&
    ip=192.168.8.104&
    mac=14:d1:1f:2c:a9:a5&
    token=welcome_to_wifi&
    incoming=18120366&
    outgoing=2133348&
    first_login=1520036018&
    online_time=23468&
    gw_id=E4956E43595E&
    channel_path=null&
    name=android-6333b865a1741cc&
    wired=0
 * @param { object } client 
 */
const refreshStateOfClients = (client) => {

    if(client == null) return

    // if stage == login that means the first time user connect to the cell, 
    // we need to put that on record.
    if (client.stage === 'login') {
    
        dailyConnectNum += 1

        let newConnection = new Connection({
            mac:    client.mac.replace(/:/g, '').toUpperCase(),
            cell:   client.gw_id
        })

        newConnection.save((err, connection) => {
            if(err) {
                console.error(err)
            } else {
                console.log(connection)
            }
        })
    }

    let tempClient = {
        name    : client.name,
        mac     : client.mac.replace(/:/g, '').toUpperCase(),
        dl      : client.incoming,
        ul      : client.outgoing,
        login   : client.first_login,
        online  : client.online_time
    }

    // 检查 Cell Map 中是否有该 gw_id
    if(stateOfCells.has(client.gw_id)) {
        stateOfCells
            .get(client.gw_id)  // 获取指定 cell 
            .clients            // 从 cell 中获取所有客户端
            .set(tempClient.mac, tempClient) // 将客户端信息更新
    }
}



/** */
const takeSnapshot = () => {
    // clone
    let stateOfCellsClone = utils.clone(stateOfCells)

    // generate json snapshots
    let snapshot = {
        ts: new Date().getTime(),
        state: [],
        cellNum: stateOfCells.size,
        clientNum: 0,
        connectNum: dailyConnectNum
    }

    stateOfCellsClone.forEach( (value, key, map) => {
        snapshot.clientNum += value.clients.size
        value.clients = Array.from(value.clients.values())
        snapshot.state.push(value)
    })

    // console.log("origianl: ")
    // console.log(stateOfCells)
    // console.log("clone:")
    // console.log(stateOfCellsClone)
    // console.log("json:")
    // console.log(JSON.stringify(snapshot))

    return snapshot
}


module.exports = {
    refreshStateOfCells,
    refreshStateOfClients,
    takeSnapshot
}

