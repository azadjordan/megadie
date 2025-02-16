import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["Cash", "Bank Transfer", "Credit Card", "Other"],
            required: true,
        },
        paymentDate: {
            type: Date,
            default: Date.now,
        },
        note: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["Received", "Cancelled"], // ✅ New status field
            default: "Received",
        },
    },
    { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
