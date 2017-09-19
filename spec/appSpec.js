const app = require("../app");
const request = require("request");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const qs = require("qs");

process.env.NODE_ENV = "test";

describe("MAD LIB", () => {
  const baseUrl = "http://localhost:3000";
  const apiUrl = baseUrl + "/api/v1/";
  let server;
  let user;
  const apiUrlFor = (type, params) => {
    console.log(user);
    params = params ? `&${qs.stringify(params)}` : "";
    return `${apiUrl}${type}?access_token=898996${params}`;
  };

  beforeEach(done => {
    server = app.listen(3000, () => {
      console.log(`listening on 3000`);
      done();
    });
  });

  // beforeEach(done => {
  //   User.create({
  //     email: "bob@aol.com",
  //     password: "BOBRULES"
  //   }).then(newUser => {
  //     console.log("Made a user! ", newUser);
  //     user = newUser;
  //     done();
  //   });
  // });

  // afterEach(done => {
  //   User.find({ email: "bob@aol.com" }).remove().then(() => {
  //     user = null;
  //     server.close();
  //     done();
  //   });
  // });

  it("gives an unauthorized error if there is no token", done => {
    request.get(
      "http://localhost:3000/api/v1/nouns",
      (error, response, body) => {
        expect(response.statusCode).toEqual(401);
        done();
      }
    );
  });

  it("gives an unauthorized error if the token doesn't match any in the database", done => {
    request.get(
      "http://localhost:3000/api/v1/nouns?access_token=zzzzzzzzz",
      (error, response, body) => {
        expect(response.statusCode).toEqual(401);
        done();
      }
    );
  });

  it("returns a list of strings", done => {
    request.get(apiUrlFor("nouns", ""), (error, response, body) => {
      let result = JSON.parse(body);
      console.log(result);
      let areStrings = result.every((el, i, arr) => {
        return typeof el === "string";
      });
      expect(areStrings).toBe(true);
      done();
    });
  });

  xit("grabs a random list of 10 nouns", done => {
    request.get(apiUrlFor("nouns", ""), (error, response, body) => {
      let result = JSON.parse(body);
      expect(result.length).toEqual(10);
      done();
    });
  });

  xit("grabs a specified number of nouns", done => {
    request.get(apiUrlFor("nouns", { count: 12 }), (error, response, body) => {
      let result = JSON.parse(body);
      expect(result.length).toEqual(12);
      done();
    });
  });

  xit("grabs a random list of 10 verbs", done => {
    request.get(apiUrlFor("verbs", ""), (error, response, body) => {
      let result = JSON.parse(body);
      expect(result.length).toEqual(10);
      done();
    });
  });

  xit("grabs a specified number of verbs", done => {
    request.get(apiUrlFor("verbs", { count: 8 }), (error, response, body) => {
      let result = JSON.parse(body);
      expect(result.length).toEqual(8);
      done();
    });
  });

  xit("grabs a random list of 10 adjectives", done => {
    request.get(apiUrlFor("adjectives", ""), (error, response, body) => {
      let result = JSON.parse(body);
      expect(result.length).toEqual(10);
      done();
    });
  });

  xit("grabs a specified number of adjectives", done => {
    request.get(
      apiUrlFor("adjectives", { count: 17 }),
      (error, response, body) => {
        let result = JSON.parse(body);
        expect(result.length).toEqual(17);
        done();
      }
    );
  });

  xit("grabs a random list of 10 adverbs", done => {
    request.get(apiUrlFor("adverbs"), (error, response, body) => {
      let result = JSON.parse(body);
      expect(result.length).toEqual(10);
      done();
    });
  });

  xit("grabs a specified number of adverbs", done => {
    request.get(
      apiUrlFor("adverbs", { count: 72 }),
      (error, response, body) => {
        let result = JSON.parse(body);
        expect(result.length).toEqual(72);
        done();
      }
    );
  });

  xit("creates a mad lib with a given template and word list", done => {
    request.post(
      {
        url: "http://localhost:3000/madlibs",
        form: {
          template:
            "She {{verbs}} seashells by the {{adjective}} {{noun}}, and Peter Piper {{verbed}} a peck of {{adjective}} {{nouns}}.",
          words: ["destroy", "purple", "child"]
        }
      },
      function(err, httpResponse, body) {
        result = JSON.parse(body);
        expect(result.madlib).toEqual(
          "She destroys seashells by the purple child, and Peter Piper destroyed a peck of purple children."
        );
        done();
      }
    );
  });
});
