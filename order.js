"use strict";
module.exports = class Order {
  constructor(options) {
    this._order_id = options.order_id;
    this._created_at = options.created_at;
    this._delivery_time = options.delivery_time;
    this._customer = options.customer;
    this._items = options.items;
    this._tip_amount = options.tip_amount;
    this._total = options.total;
    this._payment_type = options.payment_type;
  }
  get order_id() {
    return this._order_id;
  }
}