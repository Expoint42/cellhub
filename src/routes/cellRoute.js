import { 
    addNewCell, 
    getCells,
    getCellById,
    updateCellById,
    updateCellStatus,
    deleteCell,
    deleteCellById
} from '../controllers/cellController'

// Advertisement
const cellRoute = (app) => {
    app.route('/cell')
    .get ( getCells )
    .post( addNewCell )
    // .delete( deleteCell)

    app.route('/cell/:id')
    .options ( (req, res) => { res.send('ok')})
    .get ( getCellById )
    .put ( updateCellById  )
    // .delete ( deleteCellById )

    // tinc host-up & host-down event handler
    // wget can only use http GET/POST method, which is not universal
    app.post('/cellstatus', updateCellStatus)
}

export default cellRoute;