//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let VPN = require('../app/models/vpnModel')

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should()

chai.use(chaiHttp)

//Our parent block
describe('VPNs', () => {

    //Before each test we empty the database
    beforeEach((done) => {
        VPN.remove({}, (err) => { done() })
    })

    /*
    * Test the /GET VPN
    */
    describe('/GET VPN', () => {
        it('it should GET all the VPNs', (done) => {
        chai.request(server)
                .get('/vpn')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.data.length.should.be.eql(0)
                    done()
                })
        })
    })


    /*
    * Test the /POST VPN
    */
    describe('/POST VPN', () => {
        it('it should not POST a VPN without [gateway, subnet] field', (done) => {
            let vpn = { netname: 'g1', pubIp: '192.168.1.1' }
            chai.request(server)
                .post('/vpn')
                .send(vpn)
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message')
                    done()
                })
        })

        it('it should POST a VPN ', (done) => {
            let vpn = { 
                netname: 'g1', 
                gateway: '10.10.1.1', 
                pubIp: '192.168.1.1',
                subnet: '10.10.1.0/24'
            }
            chai.request(server)
                .post('/vpn')
                .send(vpn)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('_id')
                    res.body.should.have.property('netname')
                    res.body.should.have.property('gateway')
                    res.body.should.have.property('subnet')
                    res.body.should.have.property('pubIp')
                    res.body.should.have.property('inUse')
                    res.body.should.have.property('createdAt') 
                    done()
                })
        })
    })


    /*
    * Test the /GET/:id route
    */
    describe('/GET/:id VPN', () => {
        it('it should GET a VPN by the given id', (done) => {
            let vpn = new VPN({
                netname: 'g1', 
                gateway: '10.10.1.1', 
                pubIp: '192.168.1.1',
                subnet: '10.10.1.0/24'
            })
            vpn.save((err, vpn) => {
                chai.request(server)
                    .get('/vpn/' + vpn.id)
                    .send(vpn)
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        res.body.should.have.property('netname')
                        res.body.should.have.property('gateway')
                        res.body.should.have.property('subnet')
                        res.body.should.have.property('pubIp')
                        res.body.should.have.property('inUse')
                        res.body.should.have.property('createdAt') 
                        res.body.should.have.property('_id').eql(vpn.id)
                        done()
                    })
            })
        })
    })

    /*
    * Test the /PUT/:id route
    */
    describe('/PUT/:id VPN', () => {
        it('it should UPDATE a VPN given the id', (done) => {
            let vpn = new VPN({
                netname: 'g1', 
                gateway: '10.10.1.1', 
                pubIp: '192.168.1.1',
                subnet: '10.10.1.0/24'
            })

            vpn.save((err, vpn) => {
                chai.request(server)
                    .put('/vpn/' + vpn._id)
                    .send({ netname: 'g2' })
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        res.body.should.have.property('netname').eql('g2')
                        done()
                    })
            })
        })
    })

    /*
    * Test the /DELETE/:id route
    */
    describe('/DELETE/:id VPN', () => {
        it('it should DELETE a VPN given the id', (done) => {
            let vpn = new VPN({
                netname: 'g1', 
                gateway: '10.10.1.1', 
                pubIp: '192.168.1.1',
                subnet: '10.10.1.0/24'
            })

            vpn.save((err, vpn) => {
                chai.request(server)
                    .delete('/vpn/' + vpn._id)
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        res.body.should.have.property('ok').eql(1)
                        res.body.should.have.property('n').eql(1)
                        done()
                    })
            })
        })
    })

    after( (done) => {
        server.close(done)
    })
})