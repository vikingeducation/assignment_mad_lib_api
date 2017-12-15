// spec/app_spec.js
const app = require("../app");
const User = require("../models/user");
const request = require("request");

describe("App", () => {
  const baseUrl = "http://localhost:3000";
  const apiUrl = baseUrl + "/api/v1/";
  let server;

  let user;

  beforeEach(done => {
    User.create({
      fname: "Foo",
      lname: "Bar",
      email: "foobar@gmail.com",
      password: "password1234"
    }).then(result => {
      user = result;
      done();
    });
  });

  beforeAll(done => {
    server = app.listen(3000, () => {
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

  it("returns a list of nouns"),
    done => {
      request.get(`baseUrl/nouns`, (err, res, body) => {
        expect(body).isArray(body);
      });
    };
});