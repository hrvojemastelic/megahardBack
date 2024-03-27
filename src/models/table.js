class Table {
    constructor(id,name,toPay,quantity,category,items,x,y) {
        this.id = id;
        this.name = name;
        this.toPay = toPay;
        this.quantity = quantity;
        this.category = category;
        this.items = items;
        this.x = x;
        this.y = y;
      }
  }

  module.exports = Table;