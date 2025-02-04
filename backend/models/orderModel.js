import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User", // ✅ Links order to the user who placed it
    },
    orderItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Product", // ✅ Links to the ordered product
            },
            name: { type: String, required: true },
            image: { type: String, required: true },
            qty: { type: Number, required: true },
            price: { type: Number, required: true },
            specifications: { 
                type: Map, 
                of: String, // ✅ Stores selected product specifications
                default: {} 
            },
        }
    ],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false,
    },
    deliveredAt: {
        type: Date,
    },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending", // ✅ Default order status
    },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;
