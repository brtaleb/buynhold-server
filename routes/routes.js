const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const orderController = require("../controllers/orderController");

router.post('/signin', userController.postUser);

router.post('/new-order', orderController.postOrder);

router.post('/delete-order', orderController.deleteOrder);

router.post('/update-order', orderController.updateOrder);

router.get('/orders', orderController.fetchAllOrders);

router.get('/orders-sum', orderController.getOrdersSum);

router.get('/orders-avg', orderController.getOrdersAvg);

router.get('/top-users', orderController.getTopUsers);

module.exports = router;
