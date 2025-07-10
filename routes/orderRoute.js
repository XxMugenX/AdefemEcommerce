const express = require('express');
const router = express.Router();
const orderController = require("../controllers/ordercontroller");
const { protect, adminOnly } = require('../middlewares/auth');

router.use(protect)

router.post("/", orderController.placeOrder);
router.get("/getall", adminOnly, orderController.getAllOrders);
router.get("/", orderController.getUserOrders);
router.get("/:id", orderController.getOrderById);
router.put("/:id", adminOnly, orderController.updateOrderStatusDelivered); // admin
router.put("/update/:id", adminOnly, orderController.updateOrderStatusProcessing);// admin
router.delete("/:id", orderController.cancelOrder);    // user


module.exports = router;