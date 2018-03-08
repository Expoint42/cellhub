import { 
    addNewCell, 
    getCells,
    getCellById, 
    getCellsByDataTable,
    updateCellById, 
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

    app.route('/celldemo')
    .get( getCellsByDataTable )
}

export default cellRoute;