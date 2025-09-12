const mongoose = require("mongoose");
const { Schema } = mongoose;

const payoutSchema = new Schema(
  {
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    buyerId: { type: Schema.Types.ObjectId, ref: "User" },

    // amounts (base currency). Consider storing in minor units only for financial correctness;
    // base fields are kept for convenience.
    amount: { type: Number, required: true }, // e.g. 1000.5 (NGN)
    amountMinor: { type: Number }, // e.g. 100050 (kobo) — computed from amount if not provided

    currency: { type: String, default: "NGN" },

    commission: { type: Number, default: 0 }, // platform commission in base currency
    netAmount: { type: Number, required: true }, // amount - commission (base currency)
    netAmountMinor: { type: Number }, // minor units

    // payout lifecycle status
    status: {
      type: String,
      enum: ["pending", "awaiting_disbursement", "queued", "processing", "disbursed", "failed", "reversed"],
      default: "awaiting_disbursement",
    },

    // preferred payout method / channel (bank transfer, wallet, manual, etc)
    method: { type: String, enum: ["bank_transfer", "wallet", "manual", "other"], default: "bank_transfer" },

    // admin who processed/queued/disbursed this payout (optional)
    processedBy: { type: Schema.Types.ObjectId, ref: "User" },

    // scheduling & outcome
    scheduledAt: { type: Date },
    disbursedAt: { type: Date },
    failureReason: { type: String },

    // provider response (e.g., disbursement id from payment provider)
    providerReference: { type: String },

    // arbitrary extra data
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

// compute minor units if missing (assume 2 decimal places)
payoutSchema.pre("save", function (next) {
  // amountMinor = Math.round(amount * 100)
  if (this.amount != null && (this.amountMinor == null || isNaN(this.amountMinor))) {
    this.amountMinor = Math.round(Number(this.amount) * 100);
  }
  if (this.netAmount != null && (this.netAmountMinor == null || isNaN(this.netAmountMinor))) {
    this.netAmountMinor = Math.round(Number(this.netAmount) * 100);
  }
  // guard: ensure commission present
  if (this.commission == null) this.commission = 0;
  next();
});

// indexes for efficient lookup
payoutSchema.index({ status: 1, scheduledAt: 1 });
payoutSchema.index({ ownerId: 1 });
payoutSchema.index({ transactionId: 1 });

/**
 * markDisbursed helper
 * usage: payout.markDisbursed({ providerReference, processedBy })
 */
payoutSchema.methods.markDisbursed = async function ({ providerReference = null, processedBy = null } = {}) {
  this.status = "disbursed";
  this.disbursedAt = new Date();
  if (providerReference) this.providerReference = providerReference;
  if (processedBy) this.processedBy = processedBy;
  await this.save();
  return this;
};

module.exports = mongoose.model("Payout", payoutSchema);
