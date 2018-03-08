/**
 * 路由器
 */
const mongoose  = require('mongoose')
    , Schema    = mongoose.Schema

let cellSchema = new Schema({
    mac:        { type:String,  unique: true, uppercase: true, required: "You need enter a MAC Address" },          // router mac address
    netname:    { type:String,  required: "You need enter a Netname" },        //
    address:    { type:String,  unique:true, required: "You need enter an IP Address" },   // tinc ip address
    subnet:     { type:String,  required: "You need enter a Subnet" },
    hostname:   { type:String,  unique: true, required: "You need enter host name" },          // 主机名
    password:   { type:String },    // 主机密码
    model:      { type:String },    // 型号
    fv:         { type:String },    // 操作系统 firmware version
    sn:         { type:String },    // 序列号
    adsl_id:    { type:String },    // 宽度账号，
    adsl_key:   { type:String },
    ssid:       { type:String },    // 2.4G 无线SSID
    wifikey:    { type:String },    // 2.4G WiFi密码
    version:    { type:Number,  default: 0 },            // 当前系统版本
    area:       { type:String,  default: "Not set" },    // 部署区域
    location:   { type:String,  default: "Not set" },    // 部署位置
    scene:      { type:String },                         // 部署场景：公共区域、出租屋、商铺
    note:       { type:String,  default: "Not Set" },
    status:     { type:Boolean, default: false },
    createdAt:  { type:Number,  default: new Date().getTime(),
    updatedAt:  { type:Number,  default: new Date().getTime()}
    }
});

module.exports = mongoose.model('Cell', cellSchema);