/**
 * 广告
 */
const mongoose  = require('mongoose')
    , Schema    = mongoose.Schema

let adSchema = new Schema({
    link:       { type:String,  unique: true, required: 'Ad link can not be null' },          // router mac address
    views:      { type:Number,  default: 0 },        //
    key:        { type:String },    // 广告平台分配的唯一标示码
    secret:     { type:String },    //用来进行MD5签名的字符串
    note:       { type:String },    // tinc ip address
    createdAt:  { type:Number,    default: new Date().getTime() }
})

module.exports = mongoose.model('Ad', adSchema)