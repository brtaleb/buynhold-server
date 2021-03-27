const requests = require("../sql");

module.exports = class Order {
  constructor(_id, price, expirationDate, userId) {
    this._id = _id;
    this.price = price;
    this.expirationDate = expirationDate;
    this.userId = userId;
  }

  save() {
    return requests.insertOrder(this);
  }

  static getOrderById(id) {
    return requests.getOrderById(id);
  }

  static deleteOrder(id) {
    return requests.deleteOrder(id);
  }

  static updateOrder(id, newPrice) {
    return requests.updateOrder(id, newPrice);
  }

  static fetchOrders() {
    return requests.getAllOrders();
  }

  static getOrdersSum(start, finish) {
    return requests.getOrdersSum(start, finish);
  }

  static getOrdersAvg() {
    return requests.getOrdersAvg();
  }

  static getTopUsers() {
    return requests.getTopUsers();
  }
}
