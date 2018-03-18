/* global before describe it beforeEach after */

// JavaScript Standard Style does not recognize Mocha
// https://stackoverflow.com/a/30345170/5176750

//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let User = require('../app/models/userModel')

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
chai.should()
chai.use(chaiHttp)

/**
 * Without User Credentials
 */
describe('Users Without User Credentials', () => {

    /**
     * Before each test we empty the database
     */
    beforeEach((done) => {
        User.remove({ usertype: 3 }, (err) => {
            if(err) {
                console.error(err)
            } else {
                done()
            }
        })
    })

    /*
    * Test the /GET user
    */
    describe('/GET users', () => {
        it('it should GET all the users', (done) => {
            chai.request(server)
                .get('/user')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.data.length.should.be.eql(1)
                    done()
                })
        })
    })


    /*
    * Test the /POST user
    */
    describe('/POST user', () => {

        it('it should not POST a user since not authenticated', (done) => {
            let user = { username: 'hexcola', password:'password', phone: '15617816255' }
            chai.request(server)
                .post('/user')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql('no token provided')
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
        it('it should UPDATE a user given the id since not authenticated', (done) => {
            let user = new User({ username: 'hexcola', password:'password', phone: '15617816255' })
            user.save((err, user) => {
                chai.request(server)
                    .put('/user/' + user._id)
                    .send({ username: 'new_username' })
                    .end((err, res) => {
                        res.should.have.status(400)
                        res.body.should.be.a('object')
                        res.body.should.have.property('message').eql('no token provided')
                        done()
                    })
            })
        })
    })

    /*
    * Test the /DELETE/:id route
    */
    describe('/DELETE/:id user', () => {
        it('it should DELETE a user given the id since not authenticated', (done) => {
            let user = new User({ username: 'hexcola', password:'password', phone: '15617816258' })
            user.save((err, user) => {
                chai.request(server)
                    .delete('/user/' + user._id)
                    .end((err, res) => {
                        res.should.have.status(400)
                        res.body.should.be.a('object')
                        res.body.should.have.property('message').eql('no token provided')
                        done()
                    })
            })
        })
    })
})

/**
 * Without Right Permission
 */
describe('Users Without Right Permission', () => {

    let tempToken = null

    /**
     * Create the test user and login
     */
    before((done) => {
        let userObj  = { username: 'test', password:'password', phone: '15617816255' }
        let tempUser = new User(userObj)
        tempUser.save((err) => {
            if(err) {
                console.error(err)
            } else {
                chai.request(server)
                    .post('/auth')
                    .send(userObj)
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        res.body.should.have.property('token')
                        tempToken = res.body.token
                        done()
                    })
            }
        })
    })

    /**
     * Delete the test user
     */
    after((done) => {
        User.remove({ username: 'test', usertype: 3 }, (err) => {
            if(err) {
                console.error(err)
            } else {
                done()
            }
        })
    })

    /**
     * Before each test we empty the database
     */
    beforeEach((done) => {
        User.remove({ usertype: 3 }, (err) => {
            if(err) {
                console.error(err)
            } else {
                done()
            }
        })
    })

    /*
    * Test the /GET user
    */
    describe('/GET users', () => {
        it('it should GET all the users', (done) => {
            chai.request(server)
                .get('/user')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.data.length.should.be.eql(1)
                    done()
                })
        })
    })


    /*
    * Test the /POST user
    */
    describe('/POST user', () => {

        it('it should not POST a user since not authenticated', (done) => {
            let user = { 
                username: 'hexcola', 
                password:'password', 
                phone: '15617816255',
                token: tempToken
            }

            chai.request(server)
                .post('/user')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql('you do not have permission')
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
        it('it should UPDATE a user given the id since not authenticated', (done) => {
            let user = new User({ username: 'hexcola', password:'password', phone: '15617816255' })
            user.save((err, user) => {
                chai.request(server)
                    .put('/user/' + user._id)
                    .send({ username: 'new_username', token: tempToken })
                    .end((err, res) => {
                        res.should.have.status(400)
                        res.body.should.be.a('object')
                        res.body.should.have.property('message').eql('you do not have permission')
                        done()
                    })
            })
        })
    })

    /*
    * Test the /DELETE/:id route
    */
    describe('/DELETE/:id user', () => {
        it('it should DELETE a user given the id since not authenticated', (done) => {
            let user = new User({ username: 'hexcola', password:'password', phone: '15617816255' })
            user.save((err, user) => {
                chai.request(server)
                    .delete('/user/' + user._id)
                    .send({ token: tempToken })
                    .end((err, res) => {
                        res.should.have.status(400)
                        res.body.should.be.a('object')
                        res.body.should.have.property('message').eql('you do not have permission')
                        done()
                    })
            })
        })
    })
})

/**
 * With Rigth Permission
 */
//Our parent block
describe('Users With Rigth Permission', () => {

    //Before each test we empty the database
    let tempToken = null

    /**
     * Login as admin
     */
    before((done) => {
        let userObj  = { username: 'admin', password:'admin' }
        chai.request(server)
            .post('/auth')
            .send(userObj)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('token')
                tempToken = res.body.token
                done()
            })
    })

    /**
     * Before each test we empty the database
     */
    beforeEach((done) => {
        User.remove({ usertype: 3 }, (err) => {
            if(err) {
                console.error(err)
            } else {
                done()
            }
        })
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
                    // console.log(res.body)
                    res.body.should.be.a('object')
                    res.body.data.length.should.be.eql(1)
                    done()
                })
        })
    })


    /*
    * Test the /POST user
    */
    describe('/POST user', () => {
        it('it should not POST a user without [phone] field', (done) => {
            let user = { 
                username: 'hexcola', 
                password:'password',
                token: tempToken
            }

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
            let user = { 
                username: 'hexcola', 
                password:'password', 
                phone: '133',
                token: tempToken
            }

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
            let user = { 
                username: 'hexcola', 
                password:'password', 
                phone: '15617816255',
                token: tempToken
            }
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
                    .send({ username: 'new_username', token: tempToken })
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
                    .send({ token: tempToken })
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
