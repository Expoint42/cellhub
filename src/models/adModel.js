/**
 * 广告
 */
const mongoose  = require('mongoose')
    , Schema    = mongoose.Schema

let adSchema = new Schema({
    link:       { type:String,  unique: true },          // router mac address
    views:      { type:Number,  default: 0 },        //
    note:       { type:String },   // tinc ip address
    createdAt:  { type:Number,    default: new Date().getTime() }
});

module.exports = mongoose.model('Ad', adSchema);