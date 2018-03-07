/**
 * 广告
 */
const mongoose  = require('mongoose')
    , Schema    = mongoose.Schema

let connectionSchema = new Schema({
    mac:        { type:String,  required: true },  // cliet mac address withou : 
    cell:       { type:String,  required: true },  // gateway mac address without :
    ts:         { type:Number,  required: true }   // tinc ip address
});

module.exports = mongoose.model('Connection', connectionSchema);