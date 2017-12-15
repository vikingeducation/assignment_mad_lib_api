const app = require('../app');
const request = require('request');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const qs = require('qs');
var WordPOS = require('wordpos'),
  wordpos = new WordPOS();

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
      fname: 'Foo',
      lname: 'Bar',
      email: 'foobar@gmail',
      password: 'password'
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

  // ----------------------------------------
  // App
  // ----------------------------------------
  it('renders the home page', done => {
    request.get(baseUrl, (err, res, body) => {
      expect(res.statusCode).toBe(200);
      expect(body).toMatch(/api/i);
      done();
    });
  });

  // ----------------------------------------
  // Furious Spinoffs API
  // // ----------------------------------------
  // it("returns an array with the given number of titles", done => {
  //   request.get(
  //     apiUrlFor("furious_spinoffs", { count: 10 }),
  //     (err, res, body) => {
  //       console.log(body);
  //       let result = j(body);
  //       expect(result.length).toEqual(10);
  //       done();
  //     }
  //   );
  // });

  // 1. user (after login) submit sentence in clear text (in a textarea or something)
  // 2. call to BE and analyze the sentence and extract nouns/adverbs/adjectives/etc. (via wordpos and the APIs around that)
  // 3. replace every noun/adverb/verb/etc. with templates (eg: {{ noun}}) that sentencer knows
  // 4. let sentencer return the newly formed sentence
  // ----------------------------------------
  // WordPOS API
  // ----------------------------------------
  it('extract nouns/adverbs/adjectives/etc', async done => {
    let testStr = 'The angry bear chased the frightened little squirrel.';
    let wordPosObj = await wordpos.getPOS(testStr, console.log);
    expect(wordPosObj.nouns).toEqual(['bear', 'chased', 'little', 'squirrel']);
    expect(wordPosObj.verbs).toEqual(['bear']);
    expect(wordPosObj.adjectives).toEqual(['angry', 'frightened', 'little']);
    expect(wordPosObj.adverbs).toEqual(['little']);
    expect(wordPosObj.rest).toEqual(['The', '']);
    done();
  });
});
