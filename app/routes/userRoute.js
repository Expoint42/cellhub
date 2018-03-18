const userController    = require('../controllers/userController')
    , router            = require('express').Router()
    , { USER_LEVEL, ACL }    = require('../acl')

router.route('/')
    // Get all users
    .get( ACL(USER_LEVEL.Guest), userController.getUsers)

    // Create new users
    .post( ACL(USER_LEVEL.Admin), userController.addNewUser)

router.route('/count')
    .get( ACL(USER_LEVEL.Admin), userController.countUsers)


router.route('/:id')
    // Get User infomation by id
    .get( ACL(USER_LEVEL.Guest), userController.getUserById)

    // Update User information by user id
    .put( ACL(USER_LEVEL.Admin), userController.updateUserById)

    // Delete User information by user id
    .delete( ACL(USER_LEVEL.Admin), userController.deleteUserById) 

module.exports = router