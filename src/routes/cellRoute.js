import { 
    addNewCell, 
    getCells, 
    getCellById, 
    updateCellById, 
    deleteCell,
    deleteCellById
} from '../controllers/cellController'

// Advertisement
const cellRoute = (app) => {
    app.route('/cell')
    .get ( getCells )
    .post( addNewCell )
    .delete( deleteCell)

    app.route('/cell/:id')
    .get ( getCellById )
    .put ( updateCellById  )
    .delete ( deleteCellById )
}

export default cellRoute;