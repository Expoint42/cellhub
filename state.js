import { addNewConnection } from './src/controllers/connectionController'

let stateOfCells = new Map();

/**
 * 
 * @param {*} cell 
 */
export const refreshStateOfCells = (cell) => {

    if (stateOfCells.has(cell.gw_id)) {
        let theCell = stateOfCells.get(cell.gw_id)
        theCell.uptime = cell.sys_uptime;
        theCell.memfree = cell.sys_memfree;
        theCell.load = cell.sys_load;
        theCell.sessions = cell.nf_conntrack_count;
        theCell.cpu = cell.cpu_usage;
    } else {
        stateOfCells.set(cell.gw_id, {
            id : cell.gw_id,
            uptime : cell.sys_uptime,
            memfree : cell.sys_memfree,
            load : cell.sys_load,
            sessions : cell.nf_conntrack_count,
            cpu : cell.cpu_usage,
            clients: new Map()
        })
    }
}

/**
 * 
 * @param {*} client 
 */
export const refreshStateOfClients = (client) => {
    let tempClient = {
        name : client.name,
        mac : client.mac.replace(/:/g, "").toUpperCase(),
        dl : client.incoming,
        ul : client.outgoing,
        login : client.first_login,
        online : client.online_time
    }

    // 检查 Cell Map 中是否有该 gw_id
    if(stateOfCells.has(client.gw_id)) {
        stateOfCells
            .get(client.gw_id)  // 获取指定 cell 
            .clients            // 从 cell 中获取所有客户端
            .set(tempClient.mac, tempClient) // 将客户端信息更新
    }
}

export const newConnection = (client) => {
    if(client != null ) {
        let connection = {
            mac:    client.mac.replace(/:/g, "").toUpperCase(),
            cell:   client.gw_id,
            ts:     client.first_login
        }
    
        addNewConnection(connection)
    }
}

/**
 * https://stackoverflow.com/questions/728360/how-do-i-correctly-clone-a-javascript-object
 * https://jsfiddle.net/pahund/5qtt2Len/1/
 * @param {*} obj 
 */
const clone = (obj) => {
    let copy;

    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    
    if (obj instanceof Map) {
    	return new Map(clone(Array.from(obj)));
    }

    if (obj instanceof Array) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    if (obj instanceof Object) {
        copy = {};
        for (const attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = clone(obj[attr]);
            }
        }
        return copy;
    }
    throw new Error('Unable to copy object! Its type isn\'t supported');
}

/** */
export const takeSnapshot = () => {
    // clone
    let stateOfCellsClone = clone(stateOfCells)

    // generate json snapshots
    let snapshot = {
        ts: new Date().getTime(),
        state: [],
        cellNum: stateOfCells.size,
        clientNum: 0 
    }

    stateOfCellsClone.forEach( (value, key, map) => {
        snapshot.clientNum += value.clients.size;
        value.clients = Array.from(value.clients.values());
        snapshot.state.push(value)
    })

    // console.log("origianl: ")
    // console.log(stateOfCells)
    // console.log("clone:")
    // console.log(stateOfCellsClone)
    // console.log("json:")
    // console.log(JSON.stringify(snapshot))

    return snapshot;
}
