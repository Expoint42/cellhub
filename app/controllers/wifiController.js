const path          = require('path')
    , Ad            = require('../models/adModel')
    , io            = require('../../io')
    , CronJob       = require('cron').CronJob
    , appState      = require('../state')

/**
 * 计划任务
 * 每分钟获取一次
 */
let job = new CronJob('0 * * * * *', 
    () => {
        /* 每分钟执行一次  */
        let snapshot = appState.takeSnapshot()

        // compress

        // broadcast to all clients
        io.emit('state', snapshot)
    }, 
    () => {
        console.log('cron job stopped')
    }, 
    true, /* Start the job right now */
    'Asia/Shanghai' /* Time zone of this job. */
)

/**
 * 
 * @param { Express.Request } req 
 * @param { Express.Response } res 
 */
const state = (req, res) => {
    res.status(200).json(appState.takeSnapshot())
}

/**
 * 
 * @param { Express.Request } req
 * @param { Express.Response } res 
 */
const ping = (req, res) => {
    
    if(req.query != null ){
        appState.refreshStateOfCells(req.query)
    }

    res.status(200).send('Pong')
}

/**
 * 
 * @param { Express.Request } req 
 * @param { Express.Response } res 
 */
const login = (req, res) => {
    let token = 'welcome_to_wifi'

    if( req.method === 'GET') {
        res.status(200).sendFile(path.join(__dirname, '../../public', 'splash.html'))
    } else if( req.method === 'POST') {
        res.redirect(`http://${req.query.gw_address}:${req.query.gw_port}/wifidog/auth?token=${token}`)
    }
}

/**
 * 
 * @param { Express.Request } req 
 * @param { Express.Response } res 
 */
const portal = (req, res) => {
    //res.sendFile(path.join(__dirname, '../../public', 'valid.html'));
    let tempAds = [
        {
            idx : 0,
            link: 'http://live.bianxianmao.com/redirect.htm?appKey=a311596cebeb4f4baa8f52cb94f612fa&appType=h5&appEntrance=1', // 视频直播
            _id: '5a8fa9b2bae2ff30fccdcb39'
        },
        {
            idx : 1,
            link: 'http://buy.bianxianmao.com?appKey=a311596cebeb4f4baa8f52cb94f612fa&appType=app&appEntrance=1', //'爆款特卖'
            _id: '5a8fa92fbae2ff30fccdcb36'
        },
        // {
        //     idx : 2,
        //     link: 'http://bookopen.bianxianmao.com/redirect.htm?appKey=a311596cebeb4f4baa8f52cb94f612fa&appType=h5&appEntrance=1', //'书城'
        //     _id: '5a8fa9c3bae2ff30fccdcb3a'
        // },
        // {
        //     idx : 3,
        //     link: 'https://fuli.bianxianmao.com?appKey=a311596cebeb4f4baa8f52cb94f612fa&appType=h5&appEntrance=1', // 福利社
        //     _id: '5a8fa9d5bae2ff30fccdcb3b'
        // },
        // {
        //     idx : 4,
        //     link: 'http://m.cudaojia.com?appKey=a311596cebeb4f4baa8f52cb94f612fa&appType=app&appEntrance=1&business=money&i=__IMEI__&f=__IDFA__', // 广告链接
        //     _id: '5a8fa974bae2ff30fccdcb37'
        // },
        // {
        //     idx : 5,
        //     link: 'https://wwj.bianxianmao.com/#/home?appKey=a311596cebeb4f4baa8f52cb94f612fa&appType=h5&appEntrance=1', // '娃娃机'
        //     _id: '5a8fa9eebae2ff30fccdcb3c'
        // },
        // {
        //     idx : 6,
        //     link: 'https://joke.bianxianmao.com?appKey=a311596cebeb4f4baa8f52cb94f612fa', // '搞笑段子',
        //     _id: '5a8fa98dbae2ff30fccdcb38'
        // }
    ]

    // Random select 0 ~ 6(include 0 and 6)
    let selectedIdx =  Math.floor(Math.random() * tempAds.length) //The maximum is exclusive and the minimum is inclusive

    let selectAd = null

    tempAds.forEach(element => {
        if(element.idx === selectedIdx) {
            selectAd = element
        }
    })

    let redirect_link = 'http://m.cudaojia.com?appKey=a311596cebeb4f4baa8f52cb94f612fa&appType=app&appEntrance=1&business=money&i=__IMEI__&f=__IDFA__'

    if(selectAd !=null) {
        // update the views
        Ad.findOneAndUpdate({ _id: selectAd._id}, { $inc : {'views' : 1} }, { new: true }, (err, ad) => {
            if (err) {
                // res.send(err);
                console.error('Update Error')                        
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

/**
 * 
 * @param { Express.Request } req 
 * @param { Express.Response } res 
 */
const gw_message = (req, res) =>{
    res.status(200).send('你不能上网')
}

/**
 * 
 * @param { Express.Request } req 
 * @param { Express.Response } res 
 */
const auth = (req, res) => {
    if (req.query != null && req.query.token === 'welcome_to_wifi') {
        appState.refreshStateOfClients(req.query)
        res.status(200).send('Auth: 1')
    } else {
        res.status(200).send('Auth: 0')
    }
}

module.exports = {
    ping, 
    login, 
    portal, 
    gw_message, 
    auth, 
    state 
}