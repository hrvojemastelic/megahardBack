// models/Warehouse.js

class Warehouse {
    constructor(id,name,value,quantity,category,qToPay) {
      this.id = id;
      this.name = name;
      this.value = value;
      this.quantity = quantity;
      this.category = category;
      this.qToPay = qToPay;
    }
  }
  
  module.exports = Warehouse;