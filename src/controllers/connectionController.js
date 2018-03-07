const Connection = require('../models/connectionModel')

export const addNewConnection = (data) => {
    let newConnection = new Connection(data);

    newConnection.save((err, connection) => {
        if(err) {
            console.error(err)
        }
    })
}