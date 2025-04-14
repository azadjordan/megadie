import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    productType: {
      type: String,
      enum: ["Ribbon", "Creasing Matrix", "Double Face Tape"],
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    size: {
      type: String,
      enum: [
        "1-inch", // Ribbon sizes
        "0.5-inch",
        "0.4x1.5", // Creasing Matrix sizes
        "0.5x1.6",
        "0.5x1.6",
        "6mm", // Tape widths
        "9mm",
        "10mm",
        "12mm",
      ],
      required: true,
    },

    color: {
      type: String,
      default: "no-color",
    },

    code: {
      type: Number,
      unique: true,
      sparse: true, // allows code to be optional but still unique if present
    },

    displaySpecs: {
      type: String,
      default: "", // e.g. "Red | 10mm | Made in Japan"
    },

    stock: { type: Number, required: true, default: 0 },
    moq: { type: Number, required: true, default: 1 },
    isAvailable: { type: Boolean, default: true },
    origin: { type: String, required: true },
    storageLocation: { type: String, default: "Warehouse A - Shelf 1" },
    price: { type: Number, required: true },
    unit: { type: String, default: "roll" },
    images: { type: [String], default: [] },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

// Indexes for filtering
productSchema.index({ productType: 1 });
productSchema.index({ category: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
