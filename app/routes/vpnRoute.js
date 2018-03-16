const {
        addNewVPN,
        getVPNs,
        getVPNById,
        updateVPNById,
        deleteVPNById,
        countVPNs
    }               = require('../controllers/vpnController')
    , router        = require('express').Router()

router.route('/')
    .get ( getVPNs )
    .post( addNewVPN )

router.route('/count')
    .get( countVPNs )

router.route('/:id')
    .get ( getVPNById )
    .put ( updateVPNById )
    .delete ( deleteVPNById )

module.exports = router