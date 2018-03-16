const crypto = require('crypto')
    , mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , config = require('../../config')(process.env.NODE_ENV)

/**
* Hash Password
* @param {String} password 
*/
function hash(password){
    return crypto.createHmac(config.HASH_ALGORITHM, config.SECRET_KEY)
        .update(password)
        .digest('hex')
}

/**
* Create User Schema
*/
let userSchema = new Schema({
    username:   { 
        type: String, 
        unique: true, 
        trim: true,
        index: true, 
        required: 'User name can not be null' 
    },
    password:   { type: String, required: 'Password can not be null' },
    usertype:   { type: Number, default: 3 }, // 1: 管理员， 2：操作员， 3：普通用户
    phone:      { 
        type: String, 
        unique: true, 
        required: 'Cellphone can not be null',
        maxlength: 11,
        minlength: 11
    },
    email:      { type: String, unique: true, sparse: true },
    createdAt:  { type: Number, default: new Date().getTime() },
    updatedAt:  { type: Number, default: new Date().getTime() }
})

/**
 * 
 * NOTE: Don't change the function(next) to arrow function, it will lose 'this'
 * object
 */
userSchema.pre('save', function(next) {
    this.password = hash(this.password)
    next()
})

/**
 * 
 * NOTE: Don't change the function(next) to arrow function, it will lose 'this'
 * object
 * [Mongoose pre findOneAndUpdate hook issues](https://stackoverflow.com/a/43778325/5176750)
 */
userSchema.pre('findOneAndUpdate', function( next ) {
    if( this._update.password != null) {
        this._update.password = hash(this._update.password)
    }

    this._update.password = new Date().getTime()
    next()
})

/**
* Provide a `User.passwordCompare(password, hashed_pwd)` method.
* Compare user input password with the hashed password. 
* If vaild, return true, else return false.
*/
userSchema.statics.passwordCompare = function(password, hashed_pwd){
    return hash(password) == hashed_pwd ? true : false
}

/**
* Provide a `user_instance.validPassword()` method
* Can be called to check if user's password is valid or not.
*/
userSchema.methods.validPassword = function(password){
    return hash(password) == this.password ? true : false
}

module.exports = mongoose.model('User', userSchema)
