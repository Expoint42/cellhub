const path = require('path')
const Ad = require('../models/adModel')

import { refreshStateOfCells, refreshStateOfClients } from "../../state";

/**
 * 
 * @param {*} req 
 *  gw_id=E4956E43595E&
    sys_uptime=78126&
    sys_memfree=32588&
    sys_load=0.00&
    nf_conntrack_count=18&
    cpu_usage=1.00%25&
    wifidog_uptime=78030&
    online_clients=3&
    offline_clients=0&
    ssid=AAAAA&
    version=null&
    type=null&
    name=gl-mifi&
    channel_path=null&
    wired_passed=1
 * @param {*} res 
 */
export const ping = (req, res) => {
    
    if(req.query != null ){
        refreshStateOfCells(req.query)
    }

    res.send('Pong')
}

export const login = (req, res) => {
    let token = "welcome_to_wifi"

    if( req.method === "GET") {
        res.sendFile(path.join(__dirname, '../../public', 'splash.html'));
    } else if( req.method === "POST") {
        res.redirect(`http://${req.query.gw_address}:${req.query.gw_port}/wifidog/auth?token=${token}`)
    }
}

export const nocache = (req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}

export const portal = (req, res, next) => {
    //res.sendFile(path.join(__dirname, '../../public', 'valid.html'));
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

    let redirect_link = "http://m.cudaojia.com?appKey=a311596cebeb4f4baa8f52cb94f612fa&appType=app&appEntrance=1&business=money&i=__IMEI__&f=__IDFA__"

    if(selectAd !=null) {
        // update the views
        Ad.findOneAndUpdate({ _id: selectAd._id}, { $inc : {'views' : 1} }, { new: true }, (err, ad) => {
            if (err) {
                // res.send(err);
                console.error("Update Error")                        
                console.error(err)
            }

            // this is the ad we let user view.
            // redirect_link = selectAd.link
            res.redirect(selectAd.link)
        })
    } else {
        res.redirect(redirect_link)
    }
}

export const gw_message = (req, res) =>{
    res.send('你不能上网')
}

/**
 * /wifidog/auth/?stage=counters&
    ip=192.168.8.104&
    mac=14:d1:1f:2c:a9:a5&
    token=welcome_to_wifi&
    incoming=18120366&
    outgoing=2133348&
    first_login=1520036018&
    online_time=23468&
    gw_id=E4956E43595E&
    channel_path=null&
    name=android-6333b865a1741cc&
    wired=0
 * @param {*} req 
 * @param {*} res 
 */
export const auth = (req, res) => {
    if (req.query != null && req.query.token === "welcome_to_wifi") {
        refreshStateOfClients(req.query)
        res.send('Auth: 1')
    } else {
        res.send('Auth: 0')
    }
}