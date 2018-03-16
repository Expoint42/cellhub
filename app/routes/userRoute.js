const userController    = require('../controllers/userController')
    , router            = require('express').Router()


router.route('/')
    // Get all users
    .get(userController.getUsers)

    // Create new users
    .post(userController.addNewUser)

router.route('/count')
    .get(userController.countUsers)


router.route('/:id')
    // Get User infomation by id
    .get(userController.getUserById)

    // Update User information by user id
    .put(userController.updateUserById)

    // Delete User information by user id
    .delete(userController.deleteUserById) 

module.exports = router