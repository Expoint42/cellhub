import { takeSnapshot } from "../../state"
const io = require('../../io')

const CronJob = require('cron').CronJob

let job = new CronJob("*/7 * * * * *", 
    () => {
        /**
         * Runs every 10s
         */
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
    res.json(takeSnapshot())
}