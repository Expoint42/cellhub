import {
    addNewVPN
} from '../controllers/vpnController'

// Advertisement
const vpnRoute = (app) => {
    app.route('/vpn')
    .post( addNewVPN )
}

export default vpnRoute;