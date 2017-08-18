const app = require('../app');
const request = require('request');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const qs = require('qs');

describe('App', () => {
  const baseUrl = 'http://localhost:8888';
  const apiUrl = baseUrl + '/login';
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
      username: 'Foo',
      password: 'Bar'
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

  it('render the home page', done => {
    request.get(baseUrl, (err, res, body) => {
      expect(res.statusCode).toBe(200);
      done();
    });
  });
});
