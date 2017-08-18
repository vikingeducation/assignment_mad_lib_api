const app = require("../app");
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
      fname: "Foo",
      lname: "Bar",
      email: "foobar@gmail",
      password: "password"
    })
      .then(result => {
        user = result;
        done();
      })
      .catch(e => console.error(e));
  });

  afterEach(done => {
    User.remove({}).then(() => done()).catch(e => console.error(e));
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

      expect(body).toMatch(/Mad Libs/);
      done();
    });
  });

  it("does not allow requests without an access_token", done => {
    request.get(apiUrl, (err, res, body) => {
      expect(res.statusCode).toBe(401);
      done();
    });
  });

  // ----------------------------------------
  // List API
  // ----------------------------------------
  describe("List APIs", () => {
    it("returns an array with the default number of nouns", done => {
      request.get(apiUrlFor("nouns"), (err, res, body) => {
        let result = j(body);

        expect(result.length).toEqual(10);
        done();
      });
    });

    it("returns an array with the specified number of nouns", done => {
      request.get(apiUrlFor("nouns", { count: 22 }), (err, res, body) => {
        let result = j(body);

        expect(result.length).toEqual(22);
        done();
      });
    });

    it("returns an array with the default number of verbs", done => {
      request.get(apiUrlFor("verbs"), (err, res, body) => {
        let result = j(body);

        expect(result.length).toEqual(10);
        done();
      });
    });

    it("returns an array with the specified number of verbs", done => {
      request.get(apiUrlFor("verbs", { count: 22 }), (err, res, body) => {
        let result = j(body);

        expect(result.length).toEqual(22);
        done();
      });
    });

    it("returns an array with the default number of adverbs", done => {
      request.get(apiUrlFor("adverbs"), (err, res, body) => {
        let result = j(body);

        expect(result.length).toEqual(10);
        done();
      });
    });

    it("returns an array with the specified number of adverbs", done => {
      request.get(apiUrlFor("adverbs", { count: 22 }), (err, res, body) => {
        let result = j(body);

        expect(result.length).toEqual(22);
        done();
      });
    });

    it("returns an array with the default number of adjectives", done => {
      request.get(apiUrlFor("adjectives"), (err, res, body) => {
        let result = j(body);

        expect(result.length).toEqual(10);
        done();
      });
    });

    it("returns an array with the specified number of adjectives", done => {
      request.get(apiUrlFor("adjectives", { count: 22 }), (err, res, body) => {
        let result = j(body);

        expect(result.length).toEqual(22);
        done();
      });
    });
  });

  // ----------------------------------------
  // Sentence API
  // ----------------------------------------
  describe("Sentence API", () => {
    it("requires both a list of words and a template sentence.", done => {
      request.post(apiUrlFor("sentences"), (err, res, body) => {
        expect(res.statusCode).toBe(400);
        done();
      });
    });

    it("requires that words be an array of strings and template is a string", done => {
      const formData = {
        form: {
          words: "this is not an array",
          template: ["this", "is", "not", "a", "string"]
        }
      };
      request.post(apiUrlFor("sentences"), formData, (err, res, body) => {
        expect(res.statusCode).toBe(400);
        done();
      });
    });

    it("returns a sentence", done => {
      const formData = {
        form: {
          words: ["this", "is", "an", "array"],
          template: "this is a string"
        }
      };
      request.post(apiUrlFor("sentences"), formData, (err, res, body) => {
        let result = j(body);

        expect(typeof result.sentence).toEqual("string");
        done();
      });
    });
  });
});
