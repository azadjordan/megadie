import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Satin", "Grosgrain", "Acrylic"

  productType: { 
    type: String, 
    enum: ["Ribbon", "Creasing Matrix", "Double Face Tape"], 
    required: true 
  }, // Ties this category to a specific product type

  filters: [
    {
      Key: { type: String, required: true }, // e.g., "Color", "Width"
      displayName: { type: String, required: true },
      values: { type: [String], required: true }, // e.g., ["Red", "Blue"] or ["1-inch", "2-inch"]
    },
  ],
});

// ✅ Index for fast filtering by productType
categorySchema.index({ productType: 1 });

const Category = mongoose.model("Category", categorySchema);
export default Category;
