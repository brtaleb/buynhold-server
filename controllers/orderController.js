const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const {v4} = require('uuid');
const moment = require('moment');

const jwtVerify = (token, callback) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  jwt.verify(token, JWT_SECRET, callback);
}

const postOrder = (req, res) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  token = token.replace(/^Bearer\s+/, "");

  if (!token) return res.status(401).json({
    auth: false,
    message: "No token provided."
  });

  jwtVerify(token, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        auth: false,
        message: "Failed to authenticate token."
      });
    }

    const price = req.body.price;

    const newOrder = new Order(
      v4(),
      price,
      moment().add(14, 'days').format(),
      decoded.id
    );

    newOrder.save()
      .then(() => {
        res.status(200).json({
          error: false,
          order: newOrder,
          message: "Order created successfully."
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: true,
          message: "Internal Server Error"
        })
      })
  })
}

const deleteOrder = (req, res) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  token = token.replace(/^Bearer\s+/, "");

  if (!token) return res.status(401).json({
    auth: false,
    message: "No token provided."
  });

  jwtVerify(token, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        auth: false,
        message: "Failed to authenticate token."
      });
    }

    const user = decoded.id;
    const orderToDelete = req.body.id;

    Order.getOrderById(orderToDelete)
      .then(([rows]) => {
        if (rows.length === 0) return res.status(404).json({
          error: true,
          message: "Ressource does not exist on server."
        })

        if (rows[0].user_id !== user) return res.status(401).json({
          error: true,
          message: "Access to ressource unauthorized."
        })

        Order.deleteOrder(orderToDelete)
          .then(() => {
            return res.status(200).json({
              error: false,
              message: "Order deleted successfully.",
            })
          })
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: true,
          message: "Internal Server Error"
        })
      })
  })
}

const updateOrder = (req, res) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  token = token.replace(/^Bearer\s+/, "");

  if (!token) return res.status(401).json({
    auth: false,
    message: "No token provided."
  });

  jwtVerify(token, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        auth: false,
        message: "Failed to authenticate token."
      });
    }

    const user = decoded.id;
    const orderToUpdate = req.body.id;
    const newPrice = req.body.price;

    Order.getOrderById(orderToUpdate)
      .then(([rows]) => {
        if (rows.length === 0) return res.status(404).json({
          error: true,
          message: "Ressource does not exist on server."
        })

        if (rows[0].user_id !== user) return res.status(401).json({
          error: true,
          message: "Access to ressource unauthorized."
        })

        Order.updateOrder(orderToUpdate, newPrice)
          .then(() => {
            return res.status(200).json({
              error: false,
              message: "Order updated successfully.",
              id: orderToUpdate
            })
          })
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: true,
          message: "Internal Server Error"
        })
      })
  })
}

const fetchAllOrders = (req, res) => {
  Order.fetchOrders()
    .then(([rows]) => {

      rows = rows.map(row => {
        const {deleted_at, ...data} = row;
        return data;
      })

      res.status(200).json({
        error: false,
        data: rows
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: true,
        message: "Internal Server Error"
      })
    })
}

const getOrdersSum = (req, res) => {
  const {
    start,
    finish
  } = req.body;

  Order.getOrdersSum(moment(start).format(), moment(finish).format())
    .then(([rows]) => {
      res.status(200).json({
        error: false,
        sum: rows[0].sum
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: true,
        message: "Internal Server Error"
      })
    })
}

const getOrdersAvg = (req, res) => {
  Order.getOrdersAvg()
    .then(([rows]) => {
      res.status(200).json({
        error: false,
        avg: rows[0].avg
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: true,
        message: "Internal Server Error"
      })
    })
}

const getTopUsers = (req, res) => {
  Order.getTopUsers()
    .then(([rows]) => {
      res.status(200).json({
        error: false,
        data: rows
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: true,
        message: "Internal Server Error"
      })
    })
}

module.exports = {
  postOrder,
  deleteOrder,
  updateOrder,
  fetchAllOrders,
  getOrdersSum,
  getOrdersAvg,
  getTopUsers
}
