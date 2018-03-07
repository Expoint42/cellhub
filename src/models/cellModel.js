/**
 * 路由器
 */
const mongoose  = require('mongoose')
    , Schema    = mongoose.Schema

let cellSchema = new Schema({
    mac:        { type:String,  unique: true, required: "You need enter a MAC Address" },          // router mac address
    netname:    { type:String,  required: "You need enter a Netname" },        //
    address:    { type:String,  unique:true, required: "You need enter an IP Address" },   // tinc ip address
    subnet:     { type:String,  required: "You need enter a Subnet" },
    hostname:   { type:String,  unique: true, required: "You need enter host name" },          // 主机名
    model:      { type:String,  default: "Not set" },    // 型号
    fv:         { type:String,  default: "Not set" },    // 操作系统 firmware version
    kernel:     { type:String,  default: "Not set" },    // 内核版本
    version:    { type:Number,  default: 0 },            // 当前系统版本
    area:       { type:String,  default: "Not set" },    // 部署区域
    location:   { type:String,  default: "Not set" },    // 部署位置
    note:       { type:String,  default: "Not Set" },
    createdAt:  { type:Date,    default: new Date().getTime() }
});

module.exports = mongoose.model('Cell', cellSchema);