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

  beforeAll(done => {
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

  it("renders the home page", done => {
    request.get(baseUrl, (err, res, body) => {
      expect(res.statusCode).toBe(200);
      expect(body).toMatch(/api/i);
      done();
    });
  });

  it("returns an array with the given number of nouns", done => {
    request.get(apiUrlFor("nouns"), (err, res, body) => {
      let result = j(body);
      expect(result.length).toEqual(10);
      done();
    });
  });

  it("returns an array with the given number of nouns", done => {
    request.get(apiUrlFor("nouns", { count: 8 }), (err, res, body) => {
      let result = j(body);
      expect(result.length).toEqual(8);
      done();
    });
  });

  it("returns an array with the given number of verbs", done => {
    request.get(apiUrlFor("verbs"), (err, res, body) => {
      let result = j(body);
      expect(result.length).toEqual(10);
      done();
    });
  });

  it("returns an array with the given number of verbs", done => {
    request.get(apiUrlFor("verbs", { count: 8 }), (err, res, body) => {
      let result = j(body);
      expect(result.length).toEqual(8);
      done();
    });
  });

  it("returns an array with the given number of adjectives", done => {
    request.get(apiUrlFor("adjectives"), (err, res, body) => {
      let result = j(body);
      expect(result.length).toEqual(10);
      done();
    });
  });

  it("returns an array with the given number of adjectives", done => {
    request.get(apiUrlFor("adjectives", { count: 8 }), (err, res, body) => {
      let result = j(body);
      expect(result.length).toEqual(8);
      done();
    });
  });

  it("returns an array with the given number of adverbs", done => {
    request.get(apiUrlFor("adverbs"), (err, res, body) => {
      let result = j(body);
      expect(result.length).toEqual(10);
      done();
    });
  });

  it("returns an array with the given number of adverbs", done => {
    request.get(apiUrlFor("adverbs", { count: 8 }), (err, res, body) => {
      let result = j(body);
      expect(result.length).toEqual(8);
      done();
    });
  });

  it("returns a sentence using the words provided", done => {
    request.post(
      apiUrlFor("", {
        form: {
          words: ["bruise", "lurk", "obese", "faddishly"],
          sentence:
            "I have {{an_adjective}} {{noun}}, and it tends to {{verb}} {{adverb}}"
        }
      }),
      (err, res, body) => {
        console.log(body);
        const expectedResult = {
          sentence: "I have an obese bruise, and it tends to lurk faddishly"
        };
        let result = j(body);
        expect(result).toEqual(expectedResult);
        done();
      }
    );
  });

  it("does not allow requests without an access_token", done => {
    request.get(apiUrlFor("nouns"), (err, res, body) => {
      expect(res.statusCode).toBe(401);
      done();
    });
  });
});
