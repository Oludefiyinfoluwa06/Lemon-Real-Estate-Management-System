const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true }, // stored in base currency units (e.g., Naira)
  currency: { type: String, default: "NGN" },
  paymentReference: { type: String }, // Paystack reference
  checkoutAuthorizationUrl: { type: String }, // returned to client to open WebView
  status: {
    type: String,
    enum: ["initiated", "code_sent", "verified", "initiated_payment", "paid", "pending_confirmation", "completed", "reversed", "failed", "awaiting_disbursement"],
    default: "initiated",
  },
  draftSnapshot: { type: Object }, // small snapshot of property (title, ownerName, photo, category, contact)
  codeHash: { type: String }, // hashed OTP for verification
  codeExpiry: { type: Date },
  confirmations: {
    buyer: { type: Boolean, default: false },
    owner: { type: Boolean, default: false },
  },
  reversalCountForBuyer: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

transactionSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Transaction", transactionSchema);
