"use strict";
class Order {
  constructor(options){
    this.order_id = options.order_id;
    this.created_at = options.created_at;
    this.customer_name = options.customer_name;
    this.company_name = options.company_name;
    this.delivery_time = options.delivery_time;
    this.delivery_address = options.delivery_address;
    this.tip_amount = options.tip_amount;
    this.total = options.total;
    this.items = options.items;
    this.payment_type = options.payment_type;
  }
  getValue (value){
    return this.value;
  }
}