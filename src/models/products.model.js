const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    code: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: Boolean,
      default: true
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    thumbnails: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);
productSchema.plugin(mongoosePaginate);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;