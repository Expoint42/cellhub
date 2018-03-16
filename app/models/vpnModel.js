/**
 * Tinc VPN
 */
const mongoose  = require('mongoose')
    , Schema    = mongoose.Schema

let vpnSchema = new Schema({
    netname:    { type: String, unique: true, required: 'Netname can not be null' },
    gateway:    { type: String, unique: true, required: 'gate way can not be null' },          // the master IP
    pubIp:      { type: String, required: 'Public IP address can not be null' },
    subnet:     { type: String, required: 'Subnet address can not be null' },    
    inUse:      { type: [{ type: Number, min: 1, max: 254 }], default: [1] },        // 已经分配的 IP
    port:       { type: Number, unique:true },            // vpn port
    tPubkey:    { type: String },     // host 的 public key
    createdAt:  { type: Number, default: new Date().getTime()}
})

module.exports = mongoose.model('VPN', vpnSchema)