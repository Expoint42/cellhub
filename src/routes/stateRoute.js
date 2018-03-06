import { getStateOfCells  } from "../controllers/stateController";


const stateRoute = (app) => {
    app.route('/state')
    .get( getStateOfCells )
}

export default stateRoute;