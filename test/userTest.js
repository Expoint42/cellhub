//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let User = require('../app/models/userModel')

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should()

chai.use(chaiHttp)

//Our parent block
describe('Users', () => {

    //Before each test we empty the database
    beforeEach((done) => {
        User.remove({}, (err) => { done() })
    })

    /*
    * Test the /GET user
    */
    describe('/GET user', () => {
        it('it should GET all the users', (done) => {
        chai.request(server)
                .get('/user')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.data.length.should.be.eql(0)
                    done()
                })
        })
    })


    /*
    * Test the /POST user
    */
    describe('/POST user', () => {
        it('it should not POST a user without [phone] field', (done) => {
            let user = { username: 'hexcola', password:'password' }
            chai.request(server)
                .post('/user')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message')
                    done()
                })
        })

        it('it should not POST a user because phone length not correct', (done) => {
            let user = { username: 'hexcola', password:'password', phone: '133' }
            chai.request(server)
                .post('/user')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message')
                    done()
                })
        })

        it('it should POST a user ', (done) => {
            let user = { username: 'hexcola', password:'password', phone: '15617816255' }
            chai.request(server)
                .post('/user')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('_id')
                    res.body.should.have.property('username')
                    res.body.should.have.property('password')
                    res.body.should.have.property('phone')
                    res.body.should.have.property('usertype')
                    res.body.should.have.property('createdAt')                                     
                    done()
                })
        })
    })


    /*
    * Test the /GET/:id route
    */
    describe('/GET/:id user', () => {
        it('it should GET a user by the given id', (done) => {
            let user = new User({ username: 'hexcola', password:'password', phone: '15617816255' })
            user.save((err, user) => {
                chai.request(server)
                    .get('/user/' + user.id)
                    .send(user)
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        res.body.should.have.property('username')
                        res.body.should.have.property('password')
                        res.body.should.have.property('phone')
                        res.body.should.have.property('usertype')
                        res.body.should.have.property('createdAt')
                        res.body.should.have.property('_id').eql(user.id)
                        done()
                    })
            })
        })
    })

    /*
    * Test the /PUT/:id route
    */
    describe('/PUT/:id user', () => {
        it('it should UPDATE a user given the id', (done) => {
            let user = new User({ username: 'hexcola', password:'password', phone: '15617816255' })
            user.save((err, user) => {
                chai.request(server)
                    .put('/user/' + user._id)
                    .send({ username: 'new_username' })
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        res.body.should.have.property('username').eql('new_username')
                        done()
                    })
            })
        })
    })

    /*
    * Test the /DELETE/:id route
    */
    describe('/DELETE/:id user', () => {
        it('it should DELETE a user given the id', (done) => {
            let user = new User({ username: 'hexcola', password:'password', phone: '15617816255' })
            user.save((err, user) => {
                chai.request(server)
                    .delete('/user/' + user._id)
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