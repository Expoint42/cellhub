const {
        addNewVPN,
        getVPNs,
        getVPNById,
        updateVPNById,
        deleteVPNById,
        countVPNs
    }               = require('../controllers/vpnController')
    , router        = require('express').Router()
    , { USER_LEVEL, ACL }    = require('../acl')

router.route('/')
    .get ( ACL(USER_LEVEL.Guest), getVPNs )
    .post( ACL(USER_LEVEL.Admin), addNewVPN )

router.route('/count')
    .get ( ACL(USER_LEVEL.Admin), countVPNs )

router.route('/:id')
    .get ( ACL(USER_LEVEL.Guest), getVPNById )
    .put ( ACL(USER_LEVEL.Admin), updateVPNById )
    .delete ( ACL(USER_LEVEL.Admin), deleteVPNById )

module.exports = router