const app = require("../index");
const request = require("request");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const qs = require("qs");
const madlib = require("../utils/madlib");

describe("App", () => {
  const baseUrl = "http://localhost:8888";
  const apiUrl = baseUrl + "/login";
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

  // beforeEach(done => {
  //   User.create({
  //     username: "Foo",
  //     password: "Bar"
  //   }).then(result => {
  //     user = result;
  //     done();
  //   });
  // });

  it("give a madlib", function(done) {
    madlib.PoopMadlibOut("story {{ noun }}", "word").then(function(result) {
      expect(result).toBe("story word");
      done();
    });
  });
  it("takes no words", function(done) {
    madlib.PoopMadlibOut("{{ noun }}").then(function(result) {
      expect(result).toBe("word");
      done();
    });
  });

  afterAll(done => {
    server.close();
    server = null;
    done();
  });

  it("render the home page", done => {
    request.get(baseUrl, (err, res, body) => {
      expect(res.statusCode).toBe(200);
      done();
    });
  });
});
