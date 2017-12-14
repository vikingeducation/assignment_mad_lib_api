const app = require('../app');
const request = require('request');
const qs = require('qs');
const User = require('./../models').User;
const WordPOS = require('wordpos');
const wordpos = new WordPOS();


describe('App', () => {
  const baseUrl = 'http://localhost:8888';
  const apiUrl = baseUrl + '/api/v1/';
  let server;
  let user;
  const apiUrlFor = (type, params) => {
    params = params ? `&${ qs.stringify(params) }` : '';
    return `${ apiUrl }${ type }?access_token=${ user.token }${ params }`;
  };
  const j = (string) => JSON.parse(string);

  beforeAll((done) => {
    server = app.listen(8888, () => {
      done();
    });
  });

  afterAll((done) => {
    server.close();
    server = null;
    done();
  });

  beforeEach((done) => {
    User.create({
      firstName: 'Foo',
      lastName: 'Bar',
      email: 'foobar@gmail',
      password: 'password'
    })
      .then((result) => {
        user = result;
        done();
      })
      .catch(e => console.error(e.message));
  });

  it('renders the home page', (done) => {
    request.get(baseUrl, (err, res, body) => {
      expect(res.statusCode).toBe(200);
      expect(body).toMatch(/api/i);
      done();
    });
  });

  describe('GET words', () => {
    it('returns an array of words', done => {
      request.get(apiUrlFor('words/nouns'), (err, response, body) => {
        const result = j(body);
        expect(response.statusCode).toBe(200);
        expect(result.length).toEqual(10);
        done();
      });
    });

    it('returns a list of nouns', done => {
      request.get(apiUrlFor('words/nouns'), (err, response, body) => {
        const result = j(body);
        expect(response.statusCode).toBe(200);
        wordpos.isNoun(result[0])
          .then(answer => {
            expect(answer).toEqual(true);
            done();
          });
      });
    });

    it('returns a list of verbs', done => {
      request.get(apiUrlFor('words/verbs'), (err, response, body) => {
        const result = j(body);
        expect(response.statusCode).toBe(200);
        wordpos.isVerb(result[0])
          .then(answer => {
            expect(answer).toEqual(true);
            done();
          });
      });
    });

    it('returns a list of adverbs', done => {
      request.get(apiUrlFor('words/adverbs'), (err, response, body) => {
        const result = j(body);
        expect(response.statusCode).toBe(200);
        wordpos.isAdverb(result[0])
          .then(answer => {
            expect(answer).toEqual(true);
            done();
          });
      });
    });

    it('returns a list of adjectives', done => {
      request.get(apiUrlFor('words/adjectives'), (err, response, body) => {
        const result = j(body);
        expect(response.statusCode).toBe(200);
        wordpos.isAdjective(result[0])
          .then(answer => {
            expect(answer).toEqual(true);
            done();
          });
      });
    });

    it('does not allow requests with an unknown word type', done => {
      request.get(apiUrlFor('words/rando'), (err, response) => {
        expect(response.statusCode).toBe(400);
        done();
      });
    });

    it('returns the amount requested by the user', done => {
      request.get(apiUrlFor('words/nouns', { count: 5 }), (err, response, body) => {
        const result = j(body);
        expect(response.statusCode).toBe(200);
        expect(result.length).toEqual(5);
        done();
      });
    });

    it('does not allow requests without a valid token', done => {
      request.get(apiUrl + 'words/nouns', (err, response) => {
        expect(response.statusCode).toBe(401);
        done();
      });
    });
  });
});
