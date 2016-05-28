var request = require("request"),
  cheerio = require("cheerio"),
  fs = require("fs"),
  moment = require("moment");
  Order = require("./order");

var user = process.env.USER || "gfring",
  pass = process.env.PASS || "ilovefriedchicken",
  url = process.env.URL || "https://los-pollos-hermanos.herokuapp.com";

var allOrder = [];

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
  }
}, (err, res, body) => {
  if (err) {
    console.error(err);
  }
  var redirectURL = res.headers.location;
  
  request(redirectURL, (err, res, body) => {
    if (err) {
      console.log(err);
    }
    
    var $ = cheerio.load(body);
    
    $(".table tbody").nextAll().each(function (i, e) {
      var data = $(this).children();
      
      var order_id = data.eq(0).text(),
          delivery_time = data.eq(1).text(),
          customer_name = data.eq(2).text(),
          company_name = data.eq(3).text(),
          tip_amount = data.eq(4).text(),
          total = data.eq(5).text(),
          created_at = data.eq(6).text();
          
      var orderLink = redirectURL + "/" + order_id;
      request(orderLink, (err, res, body) => {
        console.log(body);
        $ = cheerio.load(body);
        $_clone = $.clone();
        console.log($(".customer").html());
        var phone_number = 
      })
      
    })
  })
})