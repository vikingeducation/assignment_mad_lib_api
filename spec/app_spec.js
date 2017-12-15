// spec/app_spec.js
const app = require("../app");
const User = require("../models/user");
const request = require("request");
const qs = require("qs");

describe("App", () => {
  const baseUrl = "http://localhost:3000";
  const apiUrl = baseUrl + "/api/v1/";
  let server;

  let user;
  const apiUrlFor = (type, params) => {
    params = params ? `&${qs.stringify(params)}` : "";
    return `${apiUrl}${type}?access_token=${user.token}${params}`;
  };
  const j = str => JSON.parse(str);

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

  it("returns a list of nouns", done => {
    request.get(apiUrlFor("nouns"), (err, res, body) => {
      expect(Array.isArray(JSON.parse(body))).toBe(true);
      done();
    });
  });

  it("returns a different story", done => {
    request.get(
      apiUrlFor("story", { story: "The quick brown fox." }),
      (err, res, body) => {
        expect(body.length).toEqual(story.length);
        expect(body).notEqual(story);
      }
    );
  });
});
