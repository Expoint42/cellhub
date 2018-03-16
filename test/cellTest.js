//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let Cell = require('../app/models/cellModel')

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should()

chai.use(chaiHttp)

//Our parent block
describe('Cells', () => {

    //Before each test we empty the database
    beforeEach((done) => {
        Cell.remove({}, (err) => { done() })
    })

    /*
    * Test the /GET route
    */
    describe('/GET cell', () => {
        it('it should GET all the cells', (done) => {
        chai.request(server)
                .get('/cell')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.data.length.should.be.eql(0)
                    done()
                })
        })
    })


    /*
    * Test the /POST cell
    */
    describe('/POST cell', () => {
        it('it should not POST a cell without [mac] field', (done) => {
            let cell = { hostname: 'just for fun' }
            chai.request(server)
                .post('/cell')
                .send(cell)
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message')
                    done()
                })
        })

        it('it should not POST a cell because mac lenth not correct', (done) => {
            let cell = { hostname: 'just for fun', mac: 'abc' }
            chai.request(server)
                .post('/cell')
                .send(cell)
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message')
                    done()
                })
        })

        it('it should POST a cell', (done) => {
            let cell = { hostname: 'just for fun', mac: 'AABBCCDDEEFF' }
            chai.request(server)
                .post('/cell')
                .send(cell)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('_id')
                    res.body.should.have.property('hostname')
                    res.body.should.have.property('mac')
                    res.body.should.have.property('netname')
                    res.body.should.have.property('tIp')
                    res.body.should.have.property('subnet')                                     
                    done()
                })
        })
    })


    /*
    * Test the /GET/:id route
    */
    describe('/GET/:id cell', () => {
        it('it should GET a cell by the given id', (done) => {
            let cell = new Cell({ hostname: 'just for fun', mac: 'AABBCCDDEEFF' })
            cell.save((err, cell) => {
                chai.request(server)
                    .get('/cell/' + cell.id)
                    .send(cell)
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        res.body.should.have.property('hostname')
                        res.body.should.have.property('mac')
                        res.body.should.have.property('netname')
                        res.body.should.have.property('tIp')
                        res.body.should.have.property('subnet')
                        res.body.should.have.property('_id').eql(cell.id)
                        done()
                    })
            })
        })
    })


    /*
    * Test the /PUT/:id route
    */
    describe('/POST/status cell', () => {
        it('it should UPDATE a cell status given the id', (done) => {
            let cell = new Cell({ hostname: 'just for fun', mac: 'AABBCCDDEEFF' })
            cell.save((err, cell) => {
                chai.request(server)
                    .post('/cell/status')
                    .send({ _id: cell.id, status: '1' })
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        res.body.should.have.property('status').eql(true)
                        done()
                    })
            })
        })
    })

    /*
    * Test the /PUT/:id route
    */
    describe('/PUT/:id cell', () => {
        it('it should UPDATE a cell given the id', (done) => {
            let cell = new Cell({ hostname: 'just for fun', mac: 'AABBCCDDEEFF' })
            cell.save((err, cell) => {
                chai.request(server)
                    .put('/cell/' + cell._id)
                    .send({ hostname: 'just for fun test 3' })
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        res.body.should.have.property('hostname').eql('just for fun test 3')
                        done()
                    })
            })
        })
    })

    /*
    * Test the /DELETE/:id route
    */
    describe('/DELETE/:id cell', () => {
        it('it should DELETE a cell given the id', (done) => {
            let cell = new Cell({ hostname: 'just for fun', mac: 'AABBCCDDEEFF' })
            cell.save((err, cell) => {
                chai.request(server)
                    .delete('/cell/' + cell._id)
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