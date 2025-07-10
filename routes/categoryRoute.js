const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/categorycontroller");
const { protect, adminOnly } = require('../middlewares/auth');

router.post("/", protect, adminOnly, categoryController.createCategory); // admin
router.get("/", categoryController.getAllCategories);               // public
router.get("/:slug", categoryController.getCategoryBySlug);        // public
router.delete("/:id", protect, adminOnly, categoryController.deleteCategory); // admin
router.get("/:slug/services", categoryController.getServicesByCategorySlug); //public

module.exports = router;