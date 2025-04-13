import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requestedItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        qty: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        qtyPrice: { type: Number, default: 0 },
      },
    ],
    deliveryCharge: { type: Number, required: true, default: 0.0 },
    extraFee: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },

    status: {
      type: String,
      enum: ["Pending", "Quoted", "Confirmed", "Rejected"],
      default: "Pending",
    },

    adminToAdminNote: { type: String, default: "" },
    clientToAdminNote: { type: String, default: "" },
    AdminToClientNote: { type: String, default: "" },

    isConvertedToOrder: { type: Boolean, default: false },
    convertedOrderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  },
  { timestamps: true }
);

const Quote = mongoose.model("Quote", quoteSchema);
export default Quote;
