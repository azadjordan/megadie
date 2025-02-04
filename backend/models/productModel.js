import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    name: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        default: "China",
    },
    category: {
        type: String,
        required: true,
        enum: ["Ribbons", "Tapes", "Creasing Channel", "Die Ejection Rubber", "Magnets", "Other"],
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    qty: {
        type: Number,
        required: true,
        default: 0,
    },
    image: {
        type: String,
        required: true,
    },
    inStock: {
        type: Boolean,
        required: true,
        default: true,
    },

    // ✅ Dynamic specifications field (admin-defined key-value pairs)
    specifications: {
        type: Map,
        of: String, // ✅ Allows storing { "Color": "Red", "Thickness": "2mm", "Hardness": "60 Shore A" }
        default: {},
    },

}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
