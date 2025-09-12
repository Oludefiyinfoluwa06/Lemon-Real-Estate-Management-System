const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    paystackReference: {
      type: String,
      required: true,
    },
    customReference: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Verified", "Unverified", "Failed"],
      required: true,
      default: "Unverified",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Payment", paymentSchema);
