var user = "gfring",
    pass = "ilovefriedchicken",
    url = "https://los-pollos-hermanos.herokuapp.com";
var request = require("request");
var cheerio = require("cheerio");

request = request.defaults({
  jar: true, 
  baseUrl: url,
  forever: true
})

request.post({
  url: "/login", 
  form: {
    username: user,
    password: pass
  }}, function(err, res, body){ 
    if (err){
      console.error(err);
    }
    console.log(res.headers)
    console.log(body);
    request(res.headers.location, function (err, res, body) {
      if (err){
        console.log(err);
      }
      var $ = cheerio.load(body);
    })
  })