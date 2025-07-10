const Category = require("../models/category.model");
const Service = require("../models/service.model")
exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json({ message: "Category created", category });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCategoryBySlug = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        if (!category) return res.status(404).json({ error: "Category not found" });

        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    };

    exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ error: "Category not found" });

        res.json({ message: "Category deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

    exports.getServicesByCategorySlug = async (req, res) => {
        const category = await Category.findOne({ slug: req.params.slug });
        if (!category) return res.status(404).json({ error: "Category not found" });
    
        const services = await Service.find({ category: category._id });
        res.json(services);
};
