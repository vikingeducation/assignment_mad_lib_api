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
    request.get(
      apiUrlFor("mad_lib", { noun: true, count: 10 }),
      (err, res, body) => {
        let result = j(body).nouns;
        wordpos.getNouns(result, function(res) {
          expect(res.length).toEqual(10);
          expect(result.length).toEqual(10);
          done();
        });
      }
    );
  });

  it("returns an array with the given number of adjectives", done => {
    request.get(
      apiUrlFor("mad_lib", { adjective: true, count: 10 }),
      (err, res, body) => {
        let result = j(body).adjectives;
        wordpos.getAdjectives(result, function(res) {
          expect(res.length).toEqual(10);
          expect(result.length).toEqual(10);
          done();
        });
      }
    );
  });
});
