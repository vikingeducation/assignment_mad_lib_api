const app = require("../app");
const request = require("request");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const qs = require("qs");
var WordPOS = require("wordpos"), wordpos = new WordPOS();

describe("App", () => {
  const baseUrl = "http://localhost:8888";
  const apiUrl = baseUrl + "/api/v1/";
  let server;
  let user;
  const apiUrlFor = (type, params) => {
    params = params ? `&${qs.stringify(params)}` : "";
    return `${apiUrl}${type}?token=${user.token}${params}`;
  };
  const j = str => JSON.parse(str);

  beforeAll(done => {
    server = app.listen(8888, () => {
      done();
    });
  });

  beforeEach(done => {
    User.create({
      fname: "Foo",
      lname: "Bar",
      email: "foobar@gmail",
      password: "password"
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
  it("renders the home page", done => {
    request.get(baseUrl, (err, res, body) => {
      expect(res.statusCode).toBe(200);
      expect(body).toMatch(/api/i);
      done();
    });
  });

  // // ----------------------------------------
  // // Mad Lib API
  // // ----------------------------------------
  it("returns an array with the given number of nouns", done => {
    request.get(apiUrlFor("nouns", { count: 1 }), (err, res, body) => {
      let result = j(body);
      wordpos.getNouns(result, function(res) {
        expect(res.length).toEqual(1);
        expect(result.length).toEqual(1);
        done();
      });
    });
  });

  it("returns an array with the given number of verbs", done => {
    request.get(apiUrlFor("verbs", { count: 11 }), (err, res, body) => {
      let result = j(body);
      wordpos.getVerbs(result, function(res) {
        expect(res.length).toEqual(11);
        expect(result.length).toEqual(11);
        done();
      });
    });
  });

  it("returns an array with the given number of adjectives", done => {
    request.get(apiUrlFor("adjectives", { count: 44 }), (err, res, body) => {
      let result = j(body);
      wordpos.getAdjectives(result, function(res) {
        expect(res.length).toEqual(44);
        expect(result.length).toEqual(44);
        done();
      });
    });
  });

  it("returns an array with the given number of adverbs", done => {
    request.get(apiUrlFor("adverbs", { count: 5 }), (err, res, body) => {
      let result = j(body);
      wordpos.getAdverbs(result, function(res) {
        expect(res.length).toEqual(5);
        expect(result.length).toEqual(5);
        done();
      });
    });
  });
  it("returns a sentence", done => {
    request.post(
      {
        url: apiUrlFor("mad_lib"),
        form: { words: ["dog", "ran"], story: "The {{noun}} {{verb}}" }
      },
      (err, res, body) => {
        let results = j(body);
        expect(results).toEqual("The dog ran");
        done();
      }
    );
  });
});
