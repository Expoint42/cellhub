const {
        ping, 
        login, 
        portal, 
        gw_message, 
        auth, 
        state 
    }           = require('../controllers/wifiController')
    , router    = require('express').Router()


router.route('/ping')
    .get(ping)

router.route('/login')
    .get (login)
    .post(login)

router.route('/portal')
    .get(portal)

router.route('/gw_message')
    .get(gw_message)

router.route('/auth')
    .get(auth)

router.route('/state')
    .get(state)

module.exports = router