const db = require("../config/db");

const insertUser = ({_id, username, password}) => {
  return db.execute('INSERT INTO users VALUES(?,?,?)', [_id, username, password]);
}

const getUser = (user) => {
  return db.execute('SELECT * FROM users WHERE username=?', [user]);
}

const insertOrder = ({_id, price, expirationDate, userId}) => {
  return db.execute('INSERT INTO orders VALUES(?,?,?,?,?)', [_id, price, expirationDate, userId, null]);
}

const deleteOrder = (id) => {
  return db.execute('UPDATE orders SET deleted_at=? WHERE id=?', [new Date(), id])
}

const updateOrder = (id, price) => {
  return db.execute('UPDATE orders SET price=? WHERE id=?', [price, id])
}

const getOrderById = (id) => {
  return db.execute('SELECT * FROM orders WHERE id=? AND deleted_at IS NULL AND expiration_date >= CURRENT_TIMESTAMP', [id])
}

const getAllOrders = () => {
  return db.execute('SELECT * FROM orders WHERE deleted_at IS NULL AND expiration_date >= CURRENT_TIMESTAMP')
}

const getOrdersSum = (start, finish) => {
  return db.execute('SELECT SUM(DISTINCT price) AS sum FROM orders WHERE deleted_at IS NULL AND expiration_date >= ? AND expiration_date <= ?', [start, finish])
}

const getOrdersAvg = () => {
  return db.execute('SELECT AVG(DISTINCT price) AS avg FROM orders WHERE deleted_at IS NULL AND expiration_date >= CURRENT_TIMESTAMP')
}

const getTopUsers = () => {
  return db.execute('SELECT u.username, count(*) AS ordercount FROM orders JOIN users u on orders.user_id = u.id WHERE orders.deleted_at IS NULL AND orders.expiration_date >= CURRENT_TIMESTAMP GROUP BY user_id ORDER BY ordercount DESC')
}

module.exports = {
  insertUser,
  getUser,
  insertOrder,
  deleteOrder,
  updateOrder,
  getOrderById,
  getAllOrders,
  getOrdersSum,
  getOrdersAvg,
  getTopUsers
}
