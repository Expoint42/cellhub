import { takeSnapshot } from "../../state"
const io = require('../../io')

const CronJob = require('cron').CronJob

let job = new CronJob("0 * * * * *", 
    () => {
        /* 每分钟执行一次  */
        let snapshot = takeSnapshot()

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

export const getStateOfCells = (req, res) => {
    res.status(200).json(takeSnapshot())
}