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

  // API Parts of Speech
  it('returns an array with a given number of nouns', done => {
    request.get(apiUrlFor('nouns', { count: 5 }), (err, res, body) => {
      const result = j(body);
      expect(res.statusCode).toBe(200);
      expect(result.length).toEqual(5);
      done();
    });
  });

  it('returns an array with a given number of verbs', done => {
    request.get(apiUrlFor('verbs', { count: 7 }), (err, res, body) => {
      const result = j(body);
      expect(res.statusCode).toBe(200);
      expect(result.length).toEqual(7);
      done();
    });
  });

  it('returns an array with a given number of adverbs', done => {
    request.get(apiUrlFor('adverbs', { count: 11 }), (err, res, body) => {
      const result = j(body);
      expect(res.statusCode).toBe(200);
      expect(result.length).toEqual(11);
      done();
    });
  });

  it('returns an array with a default of 10 adjectives when no count is given', done => {
    request.get(apiUrlFor('adjectives'), (err, res, body) => {
      const result = j(body);
      expect(res.statusCode).toBe(200);
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

  // API Madlibs
  const text =
    'Sentence with placeholders for {{ noun }} and {{ adjective }} and {{ verb }} and {{ adverb }}';
  const words = [
    'cat',
    'human',
    'goes',
    'red',
    'jumping',
    'went',
    'house',
    'splendidly',
    'creative'
  ];

  it('returns a generated text with placeholders replaced by provided words', done => {
    request.post(
      apiUrlFor('madlibs'),
      {
        form: {
          text: text,
          words: words
        }
      },
      (err, res, body) => {
        const result = j(body);
        expect(res.statusCode).toBe(200);
        expect(result).not.toMatch(/{/);
        done();
      }
    );
  });
});
