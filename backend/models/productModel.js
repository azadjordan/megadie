import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // ✅ Categorization
    category: { type: String, required: true, index: true },
    material: { type: String, required: false, index: true },
    // ✅ Specifications
    size: { type: String, required: false, index: true },
    color: { type: String, required: false }, // Single color only
    // ✅ Identification & Description
    code: { type: String, required: false, unique: true, index: true },
    description: { type: String, required: true },
    // ✅ Image
    image: { type: String, required: true },
    // ✅ Pricing & Inventory
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 }, // ✅ Tracks actual stock quantity
    isAvailable: { type: Boolean, required: true, default: true }, // ✅ Admin can manually enable/disable product availability
  },
  { timestamps: true } // ✅ Auto-manages createdAt & updatedAt
);

const Product = mongoose.model("Product", productSchema);
export default Product;
