const cellController = require('../controllers/cellController')
    , router         = require('express').Router()

router.route('/')
    // Get all cells
    .get ( cellController.getCells )

    // Create new cell
    .post( cellController.addNewCell )
    // .delete( deleteCell)

router.route('/count')
    .get( cellController.countCells )

// tinc host-up & host-down event handler
// wget can only use http GET/POST method, which is not universal
router.route('/status')
    .post( cellController.updateCellStatus)

router.route('/:id')
    // Support Put method
    .options ( (req, res) => { res.send('ok')})

    // Get Cell by Id
    .get ( cellController.getCellById )

    // Update Cell by Id
    .put ( cellController.updateCellById  )

    // Delete Cell by Id
    .delete ( cellController.deleteCellById )

module.exports = router