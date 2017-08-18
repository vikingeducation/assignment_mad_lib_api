const app = require("../app");
const request = require("request-promise");
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

  const requestResponse = (uri)=>{
    return {uri, resolveWithFullResponse: true}
  }

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

  afterAll(done => {
    server.close();
    server = null;
    done();
  });

  // ----------------------------------------
  // App
  // ----------------------------------------



  it("renders the home page", done => {
    // request.get(baseUrl, (err, res, body) => {
    //   expect(res.statusCode).toBe(200);
    //   expect(body).toMatch(/api/i);
    //   done();
    // })
    request(requestResponse(baseUrl)).then(res=>{
      expect(res.statusCode).toBe(200);
      expect(res).toMatch(/api/i);
      done();
    })
    .catch(err=>{
      console.error(err);
      expect(false);
      done();
    })
  });

  // ----------------------------------------
  // Furious Spinoffs API
  // ----------------------------------------
  it("returns an array with the given number of titles", done => {
    request.get(
      apiUrlFor("furious_spinoffs", { count: 10 }),
      (err, res, body) => {
        let result = j(body);
        expect(result.length).toEqual(10);
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
      done();
    });
  });
});
