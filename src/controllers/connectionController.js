const Connection = require('../models/connectionModel')

const io = require('../../io')
let connectionNum = 0;

export const addNewConnection = (data) => {
    let newConnection = new Connection(data);

    newConnection.save((err, connection) => {
        if(err) {
            console.error(err)
        }
    })

    connectionNum += 1;
    io.emit('connectionNum', connectionNum)
}