import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    orderItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
            name: { type: String, required: true },
            image: { type: String, required: true },
            qty: { type: Number, required: true },
            price: { type: Number, required: true },
            specifications: { type: Map, of: String, default: {} },
        }
    ],
    shippingAddress: { type: String, required: true, default: "No Address Provided" },
    totalPrice: { type: Number, required: true, default: 0.0 },
    deliveryCharge: { type: Number, required: true, default: 0.0 }, // ✅ Added Delivery Charge
    extraFee: { type: Number, required: true, default: 0.0 },
    deliveredBy: { type: String, default: "" }, // ✅ Added delivery person
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    status: { type: String, enum: ["Pending", "Quoted", "Processing", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
    clientNote: { type: String, default: "" }, // ✅ Renamed field for client note
    adminNote: { type: String, default: "" },  // ✅ Admin-only note
    sellerNote: { type: String, default: "" }, // ✅ NEW - Seller's Note (Visible to user)
    stockUpdated: { type: Boolean, required: true, default: false },
    isQuoted: { type: Boolean, default: false },
    isDebtAssigned: { type: Boolean, default: false },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
