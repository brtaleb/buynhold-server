const requests = require('../sql');

module.exports = class User {
  constructor(_id, username, password) {
    this._id = _id;
    this.username = username;
    this.password = password;
  }

  save() {
    return requests.insertUser(this);
  }

  static findByUsername(username) {
    return requests.getUser(username);
  }
}
