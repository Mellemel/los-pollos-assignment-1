"use strict"
var request = require("request"),
  cheerio = require("cheerio"),
  fs = require("fs"),
  moment = require("moment"),
  Order = require("./order.js");

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

    $(".table tbody").nextAll().each(function () {
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
        var phone_number, customer_address, payment_type;
        $ = cheerio.load(body);
        if (!!company_name) {
          phone_number = $(".customer").html().split("<br>")[3];
          customer_address = $(".customer").html().split("<br>")[4]
        } else {
          phone_number = $(".customer").html().split("<br>")[2];
          customer_address = $(".customer").html().split("<br>")[3]
        }
        payment_type = $(".payment").text().split(" ")[2].replace(/\./g, "");
        $(".table tbody tr").each(function () {
          var data = $(this).children();
          var quantity = parseInt(data.eq(0).text().replace(/[a-x]/g, ""));
          var items = data.eq(1).text();
          var price = parseFloat(data.eq(2).text().replace(/[$]/g, ""));
        })
        
        var order = {
          order_id: order_id,
          created_at: created_at,
          customer: {
            customer_name: customer_name,
            customer_address: customer_address,
            phone_number: phone_number
          },
          company_name: company_name,
          delivery_time: delivery_time,
          items: items,
          tip_amount: tip_amount,
          total: total,
        }
        
        console.log(order);
        allOrder.push(new Order(order));
      })
    })
  })
})