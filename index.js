const fs            = require('fs')
    , path          = require('path')
    , http          = require('http')

const express       = require('express')
    , cookieParser  = require('cookie-parser')
    , bodyParser    = require('body-parser')
    , compression   = require('compression')
    , yaml          = require('js-yaml')
    , mongoose      = require('mongoose')

import adRoute from './src/routes/adRoute'
import wifiDogRoute from './src/routes/wifiDogRoute'
import stateRoute from "./src/routes/stateRoute";

const io        = require('./io')

try{
    global.appConfig = yaml.safeLoad(fs.readFileSync('config.yml'), 'utf-8')
} catch (e) {
    throw e
}

const app = express();

adRoute(app)
wifiDogRoute(app)
stateRoute(app)

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_DB, appConfig.db.options )
    .then(console.log('db connected.'), (err) => console.error(err))

app.use(compression())
app.use(bodyParser.urlencoded({ extended: true })) // parse application/x-www-form-urlencoded 
app.use(bodyParser.json()) // parse application/json 
app.use(cookieParser())
app.use(express.static(appConfig.public_dir))
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

// 404 error handler
app.use((req, res, next) => {
    res.status(404).send('resource not found')
})

// 500 error handler
app.use((err, req, res, next) => {
    console.error(err)
    return res.status(500).send(err.message)
})

// Start server
let port = process.env.PORT || 1338
let server = http.createServer(app)


io.attach(server, {
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
})

server.listen(port, "0.0.0.0", (err)=>{
    if(err){
        console.error(err);
    } else {
        console.log("All Good on : ", port);
    }
})