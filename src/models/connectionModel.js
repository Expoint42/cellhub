/**
 * 广告
 */
const mongoose  = require('mongoose')
    , Schema    = mongoose.Schema

let connectionSchema = new Schema({
    name:       { type:String },  // cellphone name
    mac:        { type:String,  required: true },  // cliet mac address withou : 
    cell:       { type:String,  required: true },  // gateway mac address without :
    ts:         { type:Number,  default: new Date().getTime() } // connection timestamp
});

module.exports = mongoose.model('Connection', connectionSchema);