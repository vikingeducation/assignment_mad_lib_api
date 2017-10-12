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

  //––––––––––––––––––––––––––––
  // Mad Lib API
  //––––––––––––––––––––––––––––
  it("returns an array of nouns", done => {
    request.get(
      apiUrlFor("madlib", { pos: "nouns", count: 8 }),
      (err, res, body) => {
        let result = j(body);
        expect(result.length).toEqual(8);
        expect(res.statusCode).toBe(200);
        done();
      }
    );
  });

  it("returns an new sentence without added words", done => {
    request.get(
      apiUrlFor("madlib", {
        story: "This {{ noun }} was {{ adjective }}",
        words: ""
      }),
      (err, res, body) => {
        let result = j(body);
        console.log(body);
        expect(res.statusCode).toBe(200);
        done();
      }
    );
  });

  it("returns a sentence with added word", done => {
    request.get(
      apiUrlFor("madlib", {
        story: "This story needs a {{ noun }}",
        words: "book"
      }),
      (err, res, body) => {
        let result = j(body);
        expect(result).toEqual("This story needs a book");
        expect(res.statusCode).toBe(200);
        done();
      }
    );
  });

  it("returns a sentence with added words", done => {
    request.get(
      apiUrlFor("madlib", {
        story: "This {{ noun }} needs to {{ verb }}",
        words: "[computer, admit]"
      }),
      (err, res, body) => {
        let result = j(body);
        expect(result).toEqual("This computer needs to admit");
        expect(res.statusCode).toBe(200);
        done();
      }
    );
  });

  it("returns an error without formatting", done => {
    request.get(
      apiUrlFor("madlib", {
        story: "",
        words: "[Lorry]"
      }),
      (err, res, body) => {
        expect(res.statusCode).toBe(400);
        done();
      }
    );
  });

  it("returns an orginal sentence without words", done => {
    request.get(
      apiUrlFor("madlib", {
        story: "This house",
        words: ""
      }),
      (err, res, body) => {
        let result = j(body);
        expect(result).toEqual("This house");
        expect(res.statusCode).toBe(200);
        done();
      }
    );
  });

  it("does not allow requests without an access_token", done => {
    request.get(apiUrl, (err, res, body) => {
      // Note, this SHOULD have a status code of 401
      // however something is not working right with
      // the Passport HTTP Bearer package in setting
      // the correct status code
      // See Github issue:
      // https://github.com/jaredhanson/passport-http-bearer/issues/11
      expect(res.statusCode).toBe(404);
      expect(body).toMatch(/error/i);
      done();
    });
  });
});
