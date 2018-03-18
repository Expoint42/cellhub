const {
        ping, 
        login, 
        portal, 
        gw_message, 
        auth, 
        state 
    }           = require('../controllers/wifiController')
    , router    = require('express').Router()
    , { USER_LEVEL, ACL }    = require('../acl')

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
    .get( ACL(USER_LEVEL.Admin), state)

module.exports = router