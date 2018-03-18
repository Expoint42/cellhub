/* global before describe it beforeEach after */

// JavaScript Standard Style does not recognize Mocha
// https://stackoverflow.com/a/30345170/5176750

//During the test the env variable is set to test
process.env.NODE_ENV = 'test'
let Ad = require('../app/models/adModel')
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
describe('Ads Without User Credentials', () => {

    /**
     * Before each test we empty the database
     */
    beforeEach((done) => {
        Ad.remove({}, (err) => {
            if(err) {
                console.error(err)
            } else {
                done()
            }
        })  
    })

    /*
    * Test the /GET ad
    */
    describe('/GET ads', () => {
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
    * Test the /POST ad
    */
    describe('/POST ad', () => {

        it('it should not POST a ad since not authenticated ', (done) => {
            let ad = {
                link: 'The Lord of the Rings',
                note: 'just for test'
            }
            chai.request(server)
                .post('/ad')
                .send(ad)
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql('no token provided')
                    done()
                })
        })
    })

    /*
    * Test the /GET/:id ad
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
    * Test the /PUT/:id ad
    */
    describe('/PUT/:id ad', () => {
        it('it should not UPDATE a ad given the id since not authenticated', (done) => {
            let ad = new Ad({ link: 'The Chronicles of Narnia' })
            ad.save((err, ad) => {
                chai.request(server)
                    .put('/ad/' + ad._id)
                    .send({ note: 'just for fun test 3', views: 778})
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
    * Test the /DELETE/:id ad
    */
    describe('/DELETE/:id ad', () => {
        it('it should DELETE a ad given the id since not authenticated', (done) => {
            let ad = new Ad({ link: 'The Chronicles of Narnia', note: 'what the heck it is?' })
            ad.save((err, ad) => {
                chai.request(server)
                    .delete('/ad/' + ad._id)
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
describe('Ads Without Right Permission', () => {

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
        Ad.remove({}, (err) => {
            if(err) {
                console.error(err)
            } else {
                done()
            }
        })
    })

    /*
    * Test the /GET ad
    */
    describe('/GET ads', () => {

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
    * Test the /POST ad
    */
    describe('/POST ad', () => {

        it('it should not POST a ad  since do not have permission', (done) => {
            let ad = {
                link: 'The Lord of the Rings',
                note: 'just for test',
                token: tempToken
            }
            chai.request(server)
                .post('/ad')
                .send(ad)
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql('you do not have permission')
                    done()
                })
        })
    })

    /*
    * Test the /GET/:id ad
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
    * Test the /PUT/:id ad
    */
    describe('/PUT/:id ad', () => {
        it('it should not UPDATE a ad given the id since do not have permission', (done) => {
            let ad = new Ad({ link: 'The Chronicles of Narnia' })
            ad.save((err, ad) => {
                chai.request(server)
                    .put('/ad/' + ad._id)
                    .send({ note: 'just for fun test 3', views: 778, token: tempToken})
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
    * Test the /DELETE/:id ad
    */
    describe('/DELETE/:id ad', () => {
        it('it should DELETE a ad given the id since do not have permission', (done) => {
            let ad = new Ad({ link: 'The Chronicles of Narnia', note: 'what the heck it is?' })
            ad.save((err, ad) => {
                chai.request(server)
                    .delete('/ad/' + ad._id)
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
 * Our Test Block
 */ 
describe('Ads With Right Permission', () => {

    let tempToken = null

    // create an normal user & login
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
        Ad.remove({}, (err) => {
            if(err) {
                console.error(err)
            } else {
                done()
            }
        })
    })

    /*
    * Test the /GET ad
    */
    describe('/GET ads', () => {
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
    * Test the /POST ad
    */
    describe('/POST ad', () => {
        it('it should not POST a ad without links field', (done) => {
            let ad = { note: 'just for fun', token: tempToken }
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
                note: 'just for test',
                token: tempToken
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
    * Test the /GET/:id ad
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
    * Test the /PUT/:id ad
    */
    describe('/PUT/:id ad', () => {
        it('it should UPDATE a ad given the id', (done) => {
            let ad = new Ad({ link: 'The Chronicles of Narnia' })
            ad.save((err, ad) => {
                chai.request(server)
                    .put('/ad/' + ad._id)
                    .send({ note: 'just for fun test 3', views: 778, token: tempToken })
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
    * Test the /DELETE/:id ad
    */
    describe('/DELETE/:id ad', () => {
        it('it should DELETE a ad given the id', (done) => {
            let ad = new Ad({ link: 'The Chronicles of Narnia', note: 'what the heck it is?' })
            ad.save((err, ad) => {
                chai.request(server)
                    .delete('/ad/' + ad._id)
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