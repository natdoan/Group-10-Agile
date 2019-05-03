const request = require('supertest');
const assert = require('chai').assert;
const expect = require('chai').expect;
const chai = require('chai')
const chaiHttp = require('chai-http');
const should = require('should');

const {DateTime} = require('luxon');
const date = require('../forum').get_date;
const forum = require('../forum')

chai.use(chaiHttp);

function get_date_test() {
    return DateTime.local().toLocaleString(DateTime.DATETIME_SHORT);
}

describe('Date/Time Function', function(){
    it('app should return current date and time', function(){
        let result = date();
        assert.equal(result, get_date_test());
    })
})

describe('GET /', function () {
    it("should return homepage", function (done) {
        chai.request('http://localhost:8080')
            .get('/')
            .end(function(err, res) {
                expect('Content-Type', "text/html; charset=utf-8");
                expect(res).to.have.status(200);
                done()
            })
    });
});

describe('Login', function () {
    it('Should redirect to main page', function (done) {
        chai.request('http://localhost:8080')
            .post('/login')
            .type('form')
            .send({username: 'man', password: 'manly'})
            .then(function (res) {
                var str = res.text;
                var page_text = /Message Board/i;
                var result = page_text.test(str);
                assert.equal(result, true);
                done()
            });
    })
})

describe('Invalid login', function () {
    it('Should reload page', function (done) {
        chai.request('http://localhost:8080')
            .post('/login')
            .type('form')
            .send({username: '', password: ''})
            .end(function(err, res) {
                var url = /login/i;
                var result = url.test(res.redirects);
                assert.equal(result, true);
                done()
            })
    })
})

// describe('Add post', function () {
//     it('Should add post to database', function (done) {
//         chai.request('http://localhost:8080')
//             .post('/add_post')
//             .type('form')
//             .send({title: 'test title new', message: 'test message', username: 'man'})
//             .then(function (res) {
//                 var str = res.text;
//                 console.log(str)
//                 var page_text = /test title new/i;
//                 var result = page_text.test(str);
//                 assert.equal(result, true);
//                 done()
//             })
//     })
// })