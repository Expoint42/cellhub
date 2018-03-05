const Ad = require('../models/adModel')

class AdController {

    addNewAd(req, res, next) {
        let newAd = new Ad(req.body);

        newAd.save((err, ad) => {
            if(err) {
                res.send(err);
            }

            res.json(ad);
        })
    }

    getAds (req, res, next) {
        Ad.find({}, (err, ads) => {
            if(err) {
                res.send(err);
            }

            res.json(ads)
        })
    }

    getAdById(req, res, next) {
        Ad.findById(req.params.id, (err, ad) => {
            if(err) {
                res.send(err)
            }

            res.json(ad)
        })
    }

    updateAd(req, res, next) {
        Ad.findOneAndUpdate({ _id: req.params.id}, req.body, { new: true }, (err, ad) => {
            if (err) {
                res.send(err);
            }
            res.json(ad);
        })
    }

    deleteAd(req, res, next) {
        Ad.remove({ _id: req.params.id }, (err, ad) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted ad'});
        })
    }

    getRandomAd( req, res, next ) {

        let tempAds = [
            {
                idx : 0,
                link: "http://live.bianxianmao.com/redirect.htm?appKey=a311596cebeb4f4baa8f52cb94f612fa&appType=h5&appEntrance=1", // 视频直播
                _id: "5a8fa9b2bae2ff30fccdcb39"
            },
            {
                idx : 1,
                link: "http://buy.bianxianmao.com?appKey=a311596cebeb4f4baa8f52cb94f612fa&appType=app&appEntrance=1", //"爆款特卖"
                _id: "5a8fa92fbae2ff30fccdcb36"
            },
            {
                idx : 2,
                link: "http://bookopen.bianxianmao.com/redirect.htm?appKey=a311596cebeb4f4baa8f52cb94f612fa&appType=h5&appEntrance=1", //"书城"
                _id: "5a8fa9c3bae2ff30fccdcb3a"
            },
            {
                idx : 3,
                link: "https://fuli.bianxianmao.com?appKey=a311596cebeb4f4baa8f52cb94f612fa&appType=h5&appEntrance=1", // 福利社
                _id: "5a8fa9d5bae2ff30fccdcb3b"
            },
            {
                idx : 4,
                link: "http://m.cudaojia.com?appKey=a311596cebeb4f4baa8f52cb94f612fa&appType=app&appEntrance=1&business=money&i=__IMEI__&f=__IDFA__", // 广告链接
                _id: "5a8fa974bae2ff30fccdcb37"
            },
            {
                idx : 5,
                link: "https://wwj.bianxianmao.com/#/home?appKey=a311596cebeb4f4baa8f52cb94f612fa&appType=h5&appEntrance=1", // "娃娃机"
                _id: "5a8fa9eebae2ff30fccdcb3c"
            },
            {
                idx : 6,
                link: "https://joke.bianxianmao.com?appKey=a311596cebeb4f4baa8f52cb94f612fa", // "搞笑段子",
                _id: "5a8fa98dbae2ff30fccdcb38"
            }
        ]

        // Random select 0 ~ 6(include 0 and 6)
        let selectedIdx =  Math.floor(Math.random() * 7); //The maximum is exclusive and the minimum is inclusive

        let selectAd = null;

        tempAds.forEach(element => {
            if(element.idx === selectedIdx) {
                selectAd = element;
            }
        });

        if(selectAd !=null) {
            // update the views
            Ad.findOneAndUpdate({ _id: selectAd._id}, { $inc : {'views' : 1} }, { new: true }, (err, ad) => {
                if (err) {
                    // res.send(err);
                    console.error("Update Error")                        
                    console.error(err)
                }

                // this is the ad we let user view.
                res.send(selectAd.link);
            })
        } else {

            console.log("Oops something wrong")
            res.send("http://m.cudaojia.com?appKey=a311596cebeb4f4baa8f52cb94f612fa&appType=app&appEntrance=1&business=money&i=__IMEI__&f=__IDFA__")
        }
    }
}

module.exports = new AdController();