const Ad = require('../models/adModel')

export const addNewAd = (req, res, next) => {
    let newAd = new Ad(req.body);

    newAd.save((err, ad) => {
        if(err) {
            res.send(err);
        }

        res.json(ad);
    })
}

export const getAds = (req, res, next) => {
    Ad.find({}, (err, ads) => {
        if(err) {
            res.send(err);
        }

        res.json(ads)
    })
}

export const getAdById = (req, res, next) => {
    Ad.findById(req.params.id, (err, ad) => {
        if(err) {
            res.send(err)
        }

        res.json(ad)
    })
}

export const updateAd = (req, res, next) => {

    Ad.findOneAndUpdate({ _id: req.params.id}, req.body, { new: true }, (err, ad) => {
        if (err) {
            res.send(err);
        }
        res.json(ad);
    })
}

export const deleteAd = (req, res, next) => {
    Ad.remove({ _id: req.params.id }, (err, ad) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted ad'});
    })
}