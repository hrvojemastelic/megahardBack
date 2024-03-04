// models/Warehouse.js

class Warehouse {
    constructor(id,name,value,quantity,category ) {
      this.id = id;
      this.name = name;
      this.value = value;
      this.quantity = quantity;
      this.category = category;
    }
  }
  
  module.exports = Warehouse;