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

      // acquiring /order data
      var order_id = data.eq(0).text(),
        delivery_time = data.eq(1).text(),
        customer_name = data.eq(2).text(),
        company_name = data.eq(3).text(),
        tip_amount = parseFloat(data.eq(4).text().replace(/[$]/g, "")),
        created_at = data.eq(6).text();

      var orderLink = redirectURL + "/" + order_id;

      // acquiring /order/order_id data
      request(orderLink, (err, res, body) => {
        if (err) {
          console.log(err);
        }

        try {
          $ = cheerio.load(body);
        } catch (err) {
          console.log(err);
          console.log(body);
        }

        var phone_number, customer_address, payment_type;
        if (company_name) {
          try {
            phone_number = $(".customer").html().split("<br>")[3];
            customer_address = $(".customer").html().split("<br>")[4]
          } catch (err) {
            console.log(err);
            console.log($(".customer"));
          }
        } else {
          try {
            phone_number = $(".customer").html().split("<br>")[2];
            customer_address = $(".customer").html().split("<br>")[3]
          } catch (err) {
            console.log(err);
            console.log($(".customer"));
          }
        }

        var order_items = [], total = 0;
        $(".table tbody tr").each(function () {
          var data = $(this).children();
          var quantity = parseInt(data.eq(0).text().replace(/[x]/g, ""));
          var items = data.eq(1).text();
          var price = parseFloat(data.eq(2).text().replace(/[$]/g, ""));

          order_items.push({
            quantity: quantity,
            items: items,
            price: price
          })
          total += price;
        })

        try {
          payment_type = $(".payment").text().split(" ")[2].replace(/\./g, "");
        } catch (err) {
          console.log(err);
          console.log($(".payment"));
        }


        var options = {
          order_id: order_id,
          created_at: created_at,
          delivery_time: delivery_time,
          customer: {
            customer_name: customer_name,
            company_name: company_name,
            customer_address: customer_address,
            phone_number: phone_number
          },
          items: order_items,
          tip_amount: tip_amount,
          total: tip_amount + total,
        }

        console.log("Order coming in:");
        console.dir(options);

        var order = new Order(options);
        allOrder.push(order);
        console.log("Total Number of Orders: " + allOrder.length + "\n");
      })
    })
  })
})