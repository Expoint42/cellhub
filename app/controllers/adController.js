const Ad = require('../models/adModel')

const addNewAd = (req, res) => {
    let newAd = new Ad(req.body)

    newAd.save((err, ad) => {
        if(err) {
            res.status(400).json({ message: err.message })
        }

        res.status(200).json(ad)
    })
}

const getAds = (req, res) => {
    Ad.find({}, (err, ads) => {
        if(err) {
            res.status(400).json({ message: err.message })
        }

        res.status(200).json(ads)
    })
}

const getAdById = (req, res) => {
    Ad.findById(req.params.id, (err, ad) => {
        if(err) {
            res.status(400).json({ message: err.message })
        }

        res.status(200).json(ad)
    })
}

const updateAdById = (req, res) => {

    Ad.findOneAndUpdate({ _id: req.params.id}, req.body, { new: true }, (err, ad) => {
        if (err) {
            res.status(400).json({ message: err.message })
        }
        res.status(200).json(ad)
    })
}

const deleteAdById = (req, res ) => {
    Ad.remove({ _id: req.params.id }, (err, result) => {
        if (err) {
            res.status(400).json({ message: err.message })
        }
        res.status(200).json(result)
    })
}

module.exports = { addNewAd, getAds, getAdById, updateAdById, deleteAdById }