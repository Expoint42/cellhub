const adController  = require('../controllers/adController')
    , router        = require('express').Router()

router.route('/')
    // Get all advertisements
    .get ( adController.getAds   )

    // Create new advertisement
    .post( adController.addNewAd )

// app.route('/ad/count')
//     .get()

router.route('/:id')    
    // Get advertisement by Id
    .get ( adController.getAdById )

    // Update advertisement by Id
    .put ( adController.updateAdById )

    // Delete advertisement by Id
    .delete ( adController.deleteAdById )


module.exports = router