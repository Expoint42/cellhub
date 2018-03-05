import { addNewAd, getAds, getAdById, updateAd, deleteAd } from '../controllers/adController'

// Advertisement
const adRoute = (app) => {
    app.route('/ad')
    .get ( getAds   )
    .post( addNewAd )

    app.route('/ad/:id')
    .get ( getAdById )
    .put ( updateAd  )
    .delete ( deleteAd )
}

export default adRoute;