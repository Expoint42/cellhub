//During the test the env variable is set to test
process.env.NODE_ENV = 'test'
let Ad = require('../app/models/adModel')

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should()

chai.use(chaiHttp)

//Our parent block
describe('Ads', () => {
    beforeEach((done) => { //Before each test we empty the database
        Ad.remove({}, (err) => { done() })  
    })

    /*
    * Test the /GET route
    */
    describe('/GET ad', () => {
        it('it should GET all the Ads', (done) => {
            chai.request(server)
                .get('/ad')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(0)
                    done()
                })
        })
    })


    /*
    * Test the /POST route
    */
    describe('/POST ad', () => {
        it('it should not POST a ad without links field', (done) => {
            let ad = { note: 'just for fun' }
            chai.request(server)
                .post('/ad')
                .send(ad)
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message')
                    // res.body.errors.should.have.property('link')
                    // res.body.errors.link.should.have.property('kind').eql('required')
                    done()
                })
        })

        it('it should POST a ad ', (done) => {
            let ad = {
                link: 'The Lord of the Rings',
                note: 'just for test'
            }
            chai.request(server)
                .post('/ad')
                .send(ad)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    // res.body.should.have.property('message').eql('ad successfully added!');
                    res.body.should.have.property('link')
                    res.body.should.have.property('views')
                    res.body.should.have.property('note')
                    res.body.should.have.property('createdAt')
                    done()
            })
        })
    })


    /*
    * Test the /GET/:id route
    */
    describe('/GET/:id ad', () => {
        it('it should GET a ad by the given id', (done) => {
            let ad = new Ad({ link: 'http://www.baidu.com', note: 'just for test 2' })
            ad.save((err, ad) => {
                chai.request(server)
                    .get('/ad/' + ad.id)
                    .send(ad)
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        res.body.should.have.property('link')
                        res.body.should.have.property('views')
                        res.body.should.have.property('note')
                        res.body.should.have.property('createdAt')
                        res.body.should.have.property('_id').eql(ad.id)
                        done()
                    })
            })
        })
    })

    /*
    * Test the /PUT/:id route
    */
    describe('/PUT/:id ad', () => {
        it('it should UPDATE a ad given the id', (done) => {
            let ad = new Ad({ link: 'The Chronicles of Narnia' })
            ad.save((err, ad) => {
                chai.request(server)
                    .put('/ad/' + ad._id)
                    .send({ note: 'just for fun test 3', views: 778})
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        // res.body.should.have.property('message').eql('ad updated!');
                        res.body.should.have.property('views').eql(778)
                        done()
                    })
            })
        })
    })

    /*
    * Test the /DELETE/:id route
    */
    describe('/DELETE/:id ad', () => {
        it('it should DELETE a ad given the id', (done) => {
            let ad = new Ad({ link: 'The Chronicles of Narnia', note: 'what the heck it is?' })
            ad.save((err, ad) => {
                chai.request(server)
                    .delete('/ad/' + ad._id)
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
})