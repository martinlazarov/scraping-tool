import chai from 'chai';
import chaiHttp from 'chai-http';
import { User } from '../src/api/models/User';
const should = chai.should;
const expect = chai.expect;

chai.use(chaiHttp);

const environment = require(`./environment.local`);

const moduleUrl = environment.apiUrl + "user";

let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOjEsImV4cCI6MTYxMDYzNzEyNzAwM30.e2sT-Wvdoferrt3Hgjn2zK9pj9aaFyqIWgZ_lezLE9c';

// describe('Register user', () => {

//     const user = {
//         email: "test@user.com",
//         password: "123456",
//         firstName: "Georgi",
//         lastName: "Georgiev"
//     }

//     it("Successfull register", (done) => {
//         chai.request(`${moduleUrl}`)
//             .post(`/register`)
//             .send(user)
//             .end((err, res) => {
//                 res.should.have.status(200);
//                 done();
//             });
//       });
// });

// describe.only('Login user', () => {

//     const data = {
//         email: "test@user.com",
//         password: "123456"
//     }

//     it("Successfull login", (done) => {
//         chai.request(`${moduleUrl}`)
//             .post(`/login`)
//             .send(data)
//             .end((err, res) => {
//                 token = res.body.token;
//                 res.should.have.status(200);

//                 done();
//             });
//       });
// });

describe('Get user data', () => {

    it("Successfull", (done) => {
        chai.request(`${moduleUrl}`)
            .get(`/me`)
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
      });
});

describe('Update user data', () => {

    const user = {
        firstName: "Georgi",
        lastName: "Ivanov"
    }

    it("Successfull", (done) => {
        chai.request(`${moduleUrl}`)
            .put(`/me`)
            .set('x-access-token', token)
            .send({user})
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
      });
});

describe('Get restaurants', () => {

    it("Successfull", (done) => {
        chai.request(`${moduleUrl}`)
            .get(`/restaurants`)
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
      });
});

describe('Get products', () => {

    it("Successfull", (done) => {
        chai.request(`${moduleUrl}`)
            .get(`/restaurants/3`)
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
      });
});


describe('Create order', () => {

    const order = {
        productId: 1,
        totalPrice: 22,
        quantity: 1
    }

    it("Update ", (done) => {
    chai.request(`${moduleUrl}`)
        .post(`/order`)
        .set('x-access-token', token)
        .send(order)
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });
});