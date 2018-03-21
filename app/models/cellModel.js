/**
 * 路由器
 */
const mongoose  = require('mongoose')
    , Schema    = mongoose.Schema

let cellSchema = new Schema({
    hostname:   { type:String,  unique: true, required: 'Hostname can not be null' },          // 主机名
    mac:        { 
        type:String,  
        unique: true, 
        uppercase: true, 
        required: 'MAC Address can not be null',
        minlength: 12,
        maxlength: 12
    },          // router mac address
    netname:    { type:String },        // I will merge tinc master, 也就是当前路由器连接的 tinc 主机
    tIp:        { type:String },   // tinc ip address
    subnet:     { type:String },
    password:   { type:String },    // 主机密码
    model:      { type:String },    // 型号
    fv:         { type:String },    // 操作系统 firmware version
    sn:         { type:String },    // 序列号
    adslId:     { type:String },    // 宽度账号，
    adslKey:    { type:String },
    ssid:       { type:String },    // 2.4G 无线SSID
    wifiKey:    { type:String },    // 2.4G WiFi密码
    version:    { type:Number,  default: 0 },            // 当前系统版本
    area:       { type:String },    // 部署区域
    location:   { type:String },    // 部署位置
    scene:      { type:String },                         // 部署场景：公共区域、出租屋、商铺
    tPubKey:    { type:String },    // tinc public key
    note:       { type:String },
    status:     { type:Boolean, default: false },
    owner:      { type:Schema.Types.ObjectId },   // 这是谁的路由器（部署在谁那里）
    createdAt:  { type:Number,  default: new Date().getTime() },
    updatedAt:  { type:Number,  default: new Date().getTime() }
})

/**
 * TO-DO 在验证通用户提交的基本数据，之后，我们需要为之分配 netname, tIp 和 subnet
 */
cellSchema.post('validate', (cell) => {
    // 由于用户提交的数据最多只会是 mac 和 hostname

    // 我们需要在这里为用户分配 netname, tIp 和 subnet，最后一起保存到 数据库中
    cell.netname = 'g1'
    cell.tIp = '10.10.1.123'
    cell.subnet = '10.10.1.0/24'
})

/**
 * TO-DO 检测在 post validate 是否正确分配 netname, tIp 和 subnet
 */
cellSchema.pre('save', function(next){
    // 检测是否所有字段齐全
    if (this.netname == null || this.tIp == null || this.subnet == null) {
        throw new Error('Can not assign')
    } else {
        next()
    }
})


module.exports = mongoose.model('Cell', cellSchema)