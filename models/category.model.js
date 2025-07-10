const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    slug: {
        type: String,
        unique: true
    },
    image: {
        type: String,
        default: ""
    }
}, { timestamps: true, collection: "Categories"  });

categorySchema.pre("save", function (next) {
    if (!this.isModified("name")) return next();
    this.slug = slugify(this.name, { lower: true });
    next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
