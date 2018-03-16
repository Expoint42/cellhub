//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let Connection = require('../app/models/connectionModel')

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should()

chai.use(chaiHttp)

//Our parent block
describe('WifiDog', () => {

    //Before each test we empty the database
    beforeEach((done) => {
        Connection.remove({}, (err) => {  
            // console.error(err)
            done() 
        })
    })

    /*
    * Test the /GET VPN
    */
    describe('GET /wifidog/ping', () => {
        it('it should return Pong', (done) => {
            chai.request(server)
                .get('/wifidog/ping?gw_id=E4956E43595E&sys_uptime=78126&sys_memfree=32588&sys_load=0.00&nf_conntrack_count=18&cpu_usage=1.00%25&wifidog_uptime=78030&online_clients=3&offline_clients=0&ssid=AAAAA&version=null&type=null&name=gl-mifi&channel_path=null&wired_passed=1')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.type.should.be.eql('text/html')
                    res.text.should.be.eql('Pong')
                    done()
                })
        })
    })

    describe('GET /wifidog/login', () => {
        it('it should GET login page', (done) => {
            chai.request(server)
                .get('/wifidog/login')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.type.should.be.eql('text/html')
                    done()
                })
        })
    })

    /*
    * Test the /POST VPN
    */
    describe('POST /wifidog/login', () => {
        it('it should redirect to http://192.168.1.1:6552', (done) => {
            chai.request(server)
                .post('/wifidog/login?gw_address=192.168.1.1&gw_port=6552&token=welcome_to_wifi')
                .redirects(0)
                .end((err, res) => {
                    // console.log(res)
                    res.should.redirectTo('http://192.168.1.1:6552/wifidog/auth?token=welcome_to_wifi')
                    done()
                })
        })
    })


    /*
    * Test the /GET/:id route
    */
    describe('GET /wifidog/auth', () => {
        it('it should get Auth: 1', (done) => {

            chai.request(server)
                .get('/wifidog/auth/?stage=login&ip=192.168.8.104&mac=14:d1:1f:2c:a9:a5&token=welcome_to_wifi&incoming=18120366&outgoing=2133348&first_login=1520036018&online_time=23468&gw_id=E4956E43595E&channel_path=null&name=android-6333b865a1741cc&wired=0')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.type.should.be.eql('text/html')
                    res.text.should.eql('Auth: 1')
                    done()
                })
        })

        it('it should get Auth: 0', (done) => {

            chai.request(server)
                .get('/wifidog/auth/?token=welcome_to_wifix')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.type.should.be.eql('text/html')
                    res.text.should.eql('Auth: 0')
                    done()
                })
        })
    })

    /*
    * Test the /POST VPN
    */
   describe('GET /wifidog/portal', () => {
        it('it should redirect to advertisement', (done) => {
            chai.request(server)
                .get('/wifidog/portal')
                .redirects(0)
                .end((err, res) => {
                    res.should.have.status(302)
                    console.log(res.text)
                    done()
                })
        })
    })

    after( (done) => {
        server.close(done)
    })
})