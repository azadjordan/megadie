import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // ✅ Product Name
    name: { type: String, required: true, trim: true },

    // ✅ Categorization
    category: { type: String, required: true, index: true, trim: true },
    material: { type: String, required: false, index: true, trim: true },

    // ✅ Specifications
    size: { type: String, required: false, index: true, trim: true },
    color: { type: String, required: false, trim: true }, // Single color only

    // ✅ Identification & Description
    code: { type: String, unique: true, sparse: true, trim: true }, // Allows null values without enforcing uniqueness
    description: { type: String, required: true, trim: true, default: "" },

    // ✅ Image
    image: { type: String, required: true, trim: true, default: "https://via.placeholder.com/150" },

    // ✅ Pricing & Inventory
    price: { type: Number, required: true, min: 0 }, // Ensures price is never negative
    stock: { type: Number, required: true, default: 0, min: 0 }, // Ensures stock is never negative
    isAvailable: { type: Boolean, required: true, default: true },
  },
  { timestamps: true } // ✅ Auto-manages createdAt & updatedAt
);

// ✅ Allow Full Updates
productSchema.set("strict", false); // Allows updating all fields dynamically

const Product = mongoose.model("Product", productSchema);
export default Product;
