/**
 * 路由器
 */
const mongoose  = require('mongoose')
    , Schema    = mongoose.Schema

let cellSchema = new Schema({
    hostname:   { type:String,  unique: true, required: "Hostname can't be null" },          // 主机名
    mac:        { type:String,  unique: true, uppercase: true, required: "MAC Address can't be null" },          // router mac address
    netname:    { type:String,  required: "Netname can't be null" },        // I will merge tinc master, 也就是当前路由器连接的 tinc 主机
    tIp:        { type:String,  unique:true, required: "IP Address can't be null" },   // tinc ip address
    subnet:     { type:String,  required: "Subnet can't be null" },
    password:   { type:String },    // 主机密码
    model:      { type:String },    // 型号
    fv:         { type:String },    // 操作系统 firmware version
    sn:         { type:String },    // 序列号
    adslId:     { type:String },    // 宽度账号，
    adslKey:    { type:String },
    ssid:       { type:String },    // 2.4G 无线SSID
    wifiKey:    { type:String },    // 2.4G WiFi密码
    version:    { type:Number,  default: 0 },            // 当前系统版本
    area:       { type:String,  default: "Not set" },    // 部署区域
    location:   { type:String,  default: "Not set" },    // 部署位置
    scene:      { type:String },                         // 部署场景：公共区域、出租屋、商铺
    tPubKey:    { type:String, required: "Tinc public key can't be null" },    // tinc public key
    note:       { type:String,  default: "Not Set" },
    status:     { type:Boolean, default: false },
    createdAt:  { type:Number,  default: new Date().getTime(),
    updatedAt:  { type:Number,  default: new Date().getTime()}
    }
});

module.exports = mongoose.model('Cell', cellSchema);