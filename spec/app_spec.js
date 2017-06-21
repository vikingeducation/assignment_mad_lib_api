const app = require("../");
const request = require("request");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const qs = require("qs");

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

  // ----------------------------------------
  // Mad Lib API
  // ----------------------------------------
  it("returns an array of nouns", done => {
    request.get(apiUrlFor("nouns", { count: 15 }), (err, res, body) => {
      let result = j(body);
      expect(result.length).toEqual(15);
      expect(res.statusCode).toBe(200);
      done();
    });
  });
  
  it("returns a bad request when count is less than 1", done => {
    request.get(apiUrlFor("nouns", { count: -2 }), (err, res, body) => {
      let result = j(body);
      expect(res.statusCode).toBe(400);
      done();
    });
  });

  it("returns a bad request when count is not an integer", done => {
    request.get(apiUrlFor("nouns", { count: 1.2 }), (err, res, body) => {
      let result = j(body);
      expect(res.statusCode).toBe(400);
      done();
    });
  });

  it("returns a bad request when count is a string", done => {
    request.get(apiUrlFor("nouns", { count: "foobar" }), (err, res, body) => {
      let result = j(body);
      expect(res.statusCode).toBe(400);
      done();
    });
  });

  it("returns an array of verbs", done => {
    request.get(apiUrlFor("verbs", { count: 20 }), (err, res, body) => {
      let result = j(body);
      expect(result.length).toEqual(20);
      expect(res.statusCode).toBe(200);
      done();
    });
  });

  it("returns an array of adverbs", done => {
    request.get(apiUrlFor("adverbs", { count: 3 }), (err, res, body) => {
      let result = j(body);
      expect(result.length).toEqual(3);
      expect(res.statusCode).toBe(200);
      done();
    });
  });

  it("returns an array of adjectives", done => {
    request.get(apiUrlFor("adjectives", { count: 8 }), (err, res, body) => {
      let result = j(body);
      expect(result.length).toEqual(8);
      expect(res.statusCode).toBe(200);
      done();
    });
  });

  it("creates a mad lib with a post request", done => {
    let options = {
      url: apiUrlFor("madlibs"),
      form: {
        "sentence": "Noun: {{ noun }}, Verb: {{ verb }}, Adverb: {{ adverb }}, Adjective: {{ adjective }}",
        "nouns": ["ideas"],
        "verbs": ["sleep"],
        "adverbs": ["furiously"],
        "adjectives": ["green"]
      }
    };

    request.post(options, (err, res, body) => {
      let result = j(body);
      // expect(result.length).toEqual(8);
      expect(result).toEqual("Noun: ideas, Verb: sleep, Adverb: furiously, Adjective: green");
      expect(res.statusCode).toBe(200);
      done();
    });
  });
});
