import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        invoice: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Invoice",
            required: true,
          },          
        amount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["Cash", "Bank Transfer", "Credit Card", "Cheque", "Other"],
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
            enum: ["Received", "Refunded"], // ✅ New status field
            default: "Received",
        },
    },
    { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
