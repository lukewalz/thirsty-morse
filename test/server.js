// Import the dependencies for testing
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../express/server');

// Configure chai
chai.use(chaiHttp);
chai.should();



describe("Auth", () => {
    describe("POST /", () => {
        const path = '/.netlify/functions/server/auth';
        // Test to get all students record
        it("should get auth token", (done) => {
            chai.request(server)
                .post(path)
                .set('content-type', 'application/json')
                .send({ username: 'lukewalz1@gmail.com', password: '1234' })
                .end(function (error, res, body) {
                    if (error) {
                        done(error);
                    } else {
                        res.should.have.status(200);
                        res.body.should.be.a('string');
                        done();
                    }
                });
        });
    });
});

describe('Users', () => {
    const path = '/.netlify/functions/server/users';
    var token;
    var _id;
    describe("POST /", () => {
        it('should add a new user', (done) => {
            chai.request(server)
                .post(path)
                .set('content-type', 'application/json')
                .send({ username: 'test_account', password: '1234', firstName: 'luke', lastName: 'walz' })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    token = JSON.parse(res.text).token;
                    _id = JSON.parse(res.text)._id;
                    done();
                });
        });
    })

    describe("GET /", () => {
        it('should get a user', (done) => {
            chai.request(server)
                .get(`${path}/?username=test_account`)
                .set('content-type', 'application/json')
                .set('x-auth-token', token)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    done();
                });
        });
    })

    describe("PUT /", () => {
        it('should update a user', (done) => {
            chai.request(server)
                .put(path)
                .set('content-type', 'application/json')
                .set('x-auth-token', token)
                .send({ _id: _id, e: { endpoint: '/', keys: [] } })
                .end(function (err, res) {
                    res.should.have.status(204);
                    done();
                });
        });
    })

    describe("DELETE /", () => {
        it('should delete a user', (done) => {
            chai.request(server)
                .delete(`${path}/?username=test_account`)
                .set('content-type', 'application/json')
                .set('x-auth-token', token)
                .end(function (err, res) {
                    res.should.have.status(200);
                    done();
                });
        });
    })
});

describe('Wagers', () => {
    const path = '/.netlify/functions/server/wagers';

    const testUser = {
        "_id": "602da1916a54cf00095e17c4",
        "username": "test_wager",
        "firstName": "Test",
        "lastName": "Wager",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDJkYTE5MTZhNTRjZjAwMDk1ZTE3YzQiLCJpYXQiOjE2MTM2MDMyMTd9.so_J2cURqMyu1zB4auZF_A5QA_g4Yg8Z-Ve_-z6vxPA"
    };

    const testWager = {
        'amount': "50",
        'boost': -133,
        'game_date': 1613592900000,
        'game_id': "579050",
        'matchup': "BOU vs ROT",
        'outcome': "tbd",
        'selection': "BOU@0.5",
        'sport': "soccer",
        'status': "pending",
        'wager_type': "sp"
    }


    describe("POST /", () => {
        it('should add a new wager', (done) => {
            chai.request(server)
                .post(path)
                .set('content-type', 'application/json')
                .set('x-auth-token', testUser.token)
                .send({
                    "_id": testUser._id,
                    "wagers": testWager
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    done();
                });
        });
    })


    describe("GET /", () => {
        it('should get wagers and determine results', (done) => {
            chai.request(server)
                .get(`${path}/?id=${testUser._id}`)
                .set('content-type', 'application/json')
                .set('x-auth-token', testUser.token)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    done();
                });
        });
    })

})

