import { ping, login, portal, gw_message, auth, nocache } from "../controllers/wifiDogController"

const wifiDogRoute = (app) => {
    app.route('/wifidog/ping').get(ping)
    app.route('/wifidog/login')
        .get (login)
        .post(login)

    app.route('/wifidog/portal').get(nocache, portal)
    app.route('/wifidog/gw_message').get(gw_message)
    app.route('/wifidog/auth').get(auth)
}

export default wifiDogRoute;