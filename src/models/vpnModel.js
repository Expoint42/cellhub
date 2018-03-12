/**
 * 路由器
 */
const mongoose  = require('mongoose')
    , Schema    = mongoose.Schema

let vpnSchema = new Schema({
    netname:    { type:String, unique: true, required: "Netname can't be null" },
    gateway:    { type:String, unique: true, required: "gate way can't be null" },          // the master IP
    pubIp:      { type:String, required: "Public IP address can't be null" },
    subnet:     { type:String, required: "Subnet address can't be null" },    
    ip_from:    { type:Number, default: 1   },          // 用于分配的 IP 范围
    ip_to  :    { type:Number, default: 254 },
    in_use:     { type:[Number], default: [1] },        // 已经分配的 IP
    port:       { type:Number, unique:true },            // vpn port
    tpubkey:    { type:String }     // tinc 主机配置
});

module.exports = mongoose.model('VPN', vpnSchema);