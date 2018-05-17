const cellController = require('../controllers/cellController')
    , router         = require('express').Router()
    , { USER_LEVEL, ACL }    = require('../acl')

router.route('/')
    // Get all cells
    .get (ACL(USER_LEVEL.Guest), cellController.getCells )

    // Create new cell
    .post(ACL(USER_LEVEL.Admin), cellController.addNewCell )
    // .delete( deleteCell)

router.route('/count')
    .get(ACL(USER_LEVEL.Admin), cellController.countCells )

// tinc host-up & host-down event handler
// wget can only use http GET/POST method, which is not universal
router.route('/status')
    .post(cellController.updateCellStatus)
    // .post(ACL(USER_LEVEL.Admin), cellController.updateCellStatus)

router.route('/:id')
    // Support Put method
    .options ( (req, res) => { res.send('ok')})

    // Get Cell by Id
    .get (ACL(USER_LEVEL.Guest), cellController.getCellById )

    // Update Cell by Id
    .put (ACL(USER_LEVEL.Admin), cellController.updateCellById  )

    // Delete Cell by Id
    .delete (ACL(USER_LEVEL.Admin), cellController.deleteCellById )

module.exports = router