"use strict"
var request = require("request"),
  cheerio = require("cheerio"),
  fs = require("fs"),
  moment = require("moment"),
  Order = require("./order.js");

var user = process.env.USER || "gfring",
  pass = process.env.PASS || "ilovefriedchicken",
  url = process.env.URL || "https://los-pollos-hermanos.herokuapp.com",
  redirectURL;

var allOrders = [];

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

  redirectURL = res.headers.location;
  fetchHTML(redirectURL, checkOrders);
  setInterval(() => {
    fetchHTML(redirectURL, checkOrders);
  }, 5000)
})

function fetchHTML(url, cb) {
  request(url, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    // try {
    var $ = cheerio.load(body);
    // } catch (err) {
    //   console.error("error loading body onto cheerio" + err)
    // }


    if ($("h1").text() == "¡Ay, caramba!") {
      fetchHTML(url, cb);
    } else {
      cb($);
    }
  })
}

function checkOrders($) {
  /*
    At the current state, the arrow function 'this' value refers to the lexical 'this' value
    in the .each function call.
    Use parameters in arrow function or use the functional expresssion.
  */
  $(".table tbody").nextAll().each((i, e) => {
    var data = $(e).children();
    var order_id = data.eq(0).text();

    if (isDuplicate(order_id)) {
      return;
    } else {
      console.log("Scraping Order ID: " + order_id);
      scrapeNewOrder(data);
    }
  })
}

function isDuplicate(order_id) {
  for (var i = 0; i < allOrders.length; i++) {
    if (allOrders[i].order_id === order_id) {
      return true;
    }
  }
  return false;
}

function scrapeNewOrder(data) {
  var order_id = data.eq(0).text(),
    delivery_time = data.eq(1).text(),
    customer_name = data.eq(2).text(),
    company_name = data.eq(3).text(),
    tip_amount = parseFloat(data.eq(4).text().replace(/[$]/g, "")),
    created_at = data.eq(6).text();
    
  var orderLink = redirectURL + "/" + order_id;
  fetchHTML(orderLink, ($) => {
    var phone_number, customer_address;
    if (!!company_name) {
      phone_number = $(".customer").html().split("<br>")[3];
      customer_address = $(".customer").html().split("<br>")[4]
    } else {
      phone_number = $(".customer").html().split("<br>")[2];
      customer_address = $(".customer").html().split("<br>")[3]
    }

    var order_items = [], total_of_items = 0, total;
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
      total_of_items += price;
    })
    total = tip_amount + total_of_items;

    var payment_type = $(".payment").text().split(" ")[2].replace(/\./g, "");

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
      total: total,
      payment_type: payment_type
    }

    var order = new Order(options);
    allOrders.push(order);
    console.log(allOrders.length);
    console.log(order);
  })
}