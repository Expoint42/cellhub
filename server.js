const http          = require('http')

const express       = require('express')
    , cookieParser  = require('cookie-parser')
    , bodyParser    = require('body-parser')
    , compression   = require('compression')
    , mongoose      = require('mongoose')
    , morgan        = require('morgan')


const io            = require('./io')
    , config        = require('./config')(process.env.NODE_ENV)
    , { init, authenticate }    =require('./app/acl')

const app = express()

// Start server
let port = process.env.PORT || 1338

mongoose.Promise = global.Promise
mongoose.connect(config.DB_URI, config.DB_OPTIONS )
    .then(console.log('db connected.'), (err) => console.error(err))

app.use(compression())

if ( process.env.NODE_ENV.trim() === 'development' ) {
    app.use(morgan('dev'))
}

app.use(bodyParser.urlencoded({ extended: true })) // parse application/x-www-form-urlencoded 
app.use(bodyParser.json()) // parse application/json 

app.use(cookieParser())
app.use(express.static(config.DIR_PUBLIC))

app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

// ACL to determine if user allow to access the specific resource
// app.use(require('./app/acl').ACL)

// routes.
app.use('/init',    init)
app.use('/auth',    authenticate)
app.use('/ad',      require('./app/routes/adRoute'))
app.use('/cell',    require('./app/routes/cellRoute'))
app.use('/user',    require('./app/routes/userRoute'))
app.use('/vpn',     require('./app/routes/vpnRoute'))
app.use('/wifidog', require('./app/routes/wifiRoute'))

// console.log(app._router)

// 404 error handler
app.use((req, res) => {
    res.status(404).send({ message:'resource not found' })
})

// 500 error handler
app.use((err, req, res) => {
    console.error(err)
    return res.status(500).send({ message: err.message })
})


let server = http.createServer(app)


io.attach(server, {
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
})

server.listen(port, '0.0.0.0', (err)=>{
    if(err){
        console.error(err)
    } else {
        console.log('All Good on : ', port)
    }
})

module.exports = server