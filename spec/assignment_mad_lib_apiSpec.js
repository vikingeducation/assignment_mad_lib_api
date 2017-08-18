const app = require("../app");
const request = require("request");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const qs = require("qs");

describe("MAD LIB", () => {
  const baseUrl = "http://localhost:3000";
  const apiUrl = baseUrl + "/api/v1/";
  let server;
  let user;
  const apiUrlFor = (type, params) => {
    params = params ? `&${qs.stringify(params)}` : "";
    return `${apiUrl}${type}?access_token=${user.token}${params}`;
  };

  beforeAll(done => {
    server = app.listen(8888, () => {
      User.create({
        email: "bob@aol.com",
        password: "BOBRULES"
      }).then(user => {
        done();
      });
    });
  });

  //stuff for testing
});
