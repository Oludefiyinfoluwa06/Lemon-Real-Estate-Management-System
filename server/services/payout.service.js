const axios = require("axios");
const Payout = require("../models/payout.model");
const User = require("../models/user.model");

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE = "https://api.paystack.co";

async function listBanks() {
  const url = `${PAYSTACK_BASE}/bank?country=nigeria`;
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
  });
  return res.data;
}

async function createTransferRecipient({ name, account_number, bank_code, currency = "NGN" }) {
  const url = `${PAYSTACK_BASE}/transferrecipient`;
  const payload = {
    type: "nuban",
    name,
    account_number,
    bank_code,
    currency,
  };

  const res = await axios.post(url, payload, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET}`, "Content-Type": "application/json" },
  });

  if (!res.data || !res.data.status) throw new Error("Failed to create transfer recipient");
  return res.data.data; // includes recipient_code
}

async function initiateTransfer({ amountMinor, recipient, reason = "Payout" }) {
  const url = `${PAYSTACK_BASE}/transfer`;
  const payload = {
    source: "balance",
    amount: amountMinor, // in kobo
    recipient,
    reason,
  };

  const res = await axios.post(url, payload, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET}`, "Content-Type": "application/json" },
  });

  if (!res.data || !res.data.status) throw new Error("Failed to initiate transfer");
  return res.data.data;
}

/**
 * Disburse a payout record: ensures recipient exists on Paystack and initiates transfer.
 * Accepts payoutId or a payout document.
 */
async function disbursePayout(payoutOrId) {
  let payout = null;
  if (typeof payoutOrId === "string" || payoutOrId instanceof String) {
    payout = await Payout.findById(payoutOrId);
  } else payout = payoutOrId;

  if (!payout) throw new Error("Payout not found");

  if (payout.status === "disbursed") return payout; // idempotent

  // fetch owner
  const owner = await User.findById(payout.ownerId);
  if (!owner) {
    payout.status = "failed";
    payout.failureReason = "Owner not found";
    await payout.save();
    throw new Error("Owner not found for payout");
  }

  // ensure recipient exists on Paystack
  let recipientCode = owner.paystackRecipientCode;
  if (!recipientCode) {
    if (!owner.bankAccountNumber || !owner.bankCode || !owner.bankAccountName) {
      payout.status = "failed";
      payout.failureReason = "Missing owner bank details";
      await payout.save();
      throw new Error("Owner missing bank details");
    }

    const recipient = await createTransferRecipient({
      name: owner.bankAccountName,
      account_number: owner.bankAccountNumber,
      bank_code: owner.bankCode,
    });

    recipientCode = recipient.recipient_code;
    // persist recipient code on user for future
    owner.paystackRecipientCode = recipientCode;
    await owner.save();
  }

  // initiate transfer
  try {
    payout.status = "processing";
    await payout.save();

    const transfer = await initiateTransfer({
      amountMinor: payout.netAmountMinor || payout.netAmount * 100,
      recipient: recipientCode,
      reason: `Payout for transaction ${payout.transactionId}`,
    });

    // update payout record
    payout.providerReference = transfer.reference || transfer.id || transfer.transfer_code || String(transfer.id || "");
    payout.status = "disbursed";
    payout.disbursedAt = new Date();
    await payout.save();

    return { payout, transfer };
  } catch (err) {
    payout.status = "failed";
    payout.failureReason = err.message || String(err);
    await payout.save();
    throw err;
  }
}

module.exports = {
  listBanks,
  createTransferRecipient,
  initiateTransfer,
  disbursePayout,
};
