const adController  = require('../controllers/adController')
    , router        = require('express').Router()
    , { USER_LEVEL, ACL }    = require('../acl')

router.route('/')
    // Get all advertisements
    .get ( ACL(USER_LEVEL.Guest), adController.getAds   )

    // Create new advertisement
    .post( ACL(USER_LEVEL.Admin), adController.addNewAd )

// app.route('/ad/count')
//     .get()

router.route('/:id')    
    // Get advertisement by Id
    .get ( ACL(USER_LEVEL.Guest), adController.getAdById )

    // Update advertisement by Id
    .put ( ACL(USER_LEVEL.Admin), adController.updateAdById )

    // Delete advertisement by Id
    .delete (ACL(USER_LEVEL.Admin), adController.deleteAdById )

module.exports = router