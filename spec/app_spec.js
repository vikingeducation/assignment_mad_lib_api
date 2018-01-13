const app = require('../app');
const request = require('request');
const mongoose = require('mongoose');
const qs = require('qs');

const User = mongoose.model('User');

describe('App', () => {
  const baseUrl = 'http://localhost:8888';
  const apiUrl = baseUrl + '/api/v1/';
  let server;
  let user;
  const apiUrlFor = (type, params) => {
    params = params ? `&${qs.stringify(params)}` : '';
    return `${apiUrl}${type}?access_token=${user.token}${params}`;
  };
  const j = str => JSON.parse(str);

  beforeAll(done => {
    server = app.listen(8888, () => {
      done();
    });
  });

  beforeEach(done => {
    User.create({
      fname: 'John',
      lname: 'Doe',
      email: 'john@mail.com',
      password: 'longenoughpassword'
    }).then(result => {
      user = result;
      done();
    });
  });

  afterAll(done => {
    server.close();
    server = null;
    done();
  });

  // App
  it('renders the home page', done => {
    request.get(baseUrl, (err, res, body) => {
      expect(res.statusCode).toBe(200);
      expect(body).toMatch(/api/i);
      done();
    });
  });
  // http://localhost:8888/api/v1/nouns?access_token=&count=10
  // API
  it('returns an array with a given number of nouns', done => {
    request.get(apiUrlFor('nouns', { count: 5 }), (err, res, body) => {
      const result = j(body);
      expect(result.length).toEqual(5);
      done();
    });
  });

  it('returns an array with a given number of verbs', done => {
    request.get(apiUrlFor('verbs', { count: 7 }), (err, res, body) => {
      const result = j(body);
      expect(result.length).toEqual(7);
      done();
    });
  });

  it('returns an array with a default of 10 words when no count is given', done => {
    request.get(apiUrlFor('adjectives'), (err, res, body) => {
      const result = j(body);
      expect(result.length).toEqual(10);
      done();
    });
  });

  it('returns a BAD REQUEST HTTP response when an invalid request is made', done => {
    request.get(apiUrlFor('kittens', { count: 5 }), (err, res, body) => {
      expect(res.statusCode).toBe(400);
      done();
    });
  });

  it('does not allow requests without an access_token', done => {
    request.get(apiUrl, (err, res, body) => {
      expect(res.statusCode).toBe(404);
      done();
    });
  });
});
