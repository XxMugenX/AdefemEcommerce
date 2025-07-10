const express = require('express');
const router = express.Router();
const cartController = require("../controllers/cartcontroller");
const { protect, adminOnly } = require('../middlewares/auth');

//only allows logged-in users to access route
router.use(protect)

router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.put("/update", cartController.updateCartItem);
router.delete("/remove/:serviceId", cartController.removeItem);
router.delete("/clear", cartController.clearCart);

module.exports = router;