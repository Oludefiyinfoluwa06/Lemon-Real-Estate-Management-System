const Transaction = require("../models/transaction.model");
const Property = require("../models/property.model");
const Payout = require("../models/payout.model");
const User = require("../models/user.model");
const Notification = require("../models/notification.model");
const Chat = require("../models/chat.model");
const payoutService = require("../services/payout.service");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const axios = require("axios");
const nodemailer = require("nodemailer");

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:3000";
const FRONTEND_CALLBACK_SUCCESS_URL =
  process.env.FRONTEND_CALLBACK_SUCCESS_URL ||
  `${APP_BASE_URL}/payment/success`;

// nodemailer transporter (Gmail example)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// helper: generate numeric OTP
const generateNumericCode = (length = 6) => {
  let code = "";
  for (let i = 0; i < length; i++)
    code += Math.floor(Math.random() * 10).toString();
  console.log({ code });
  return code;
};

// POST /transactions/generate-code
// body: { propertyId, userId }
const generateCode = async (req, res) => {
  const { propertyId, userId } = req.body;
  if (!propertyId || !userId)
    return res
      .status(400)
      .json({ success: false, message: "propertyId and userId required" });

  try {
    const property = await Property.findById(propertyId).lean();
    const buyer = await User.findById(userId).select(
      "email firstName lastName",
    );
    if (!property || !buyer)
      return res
        .status(404)
        .json({ success: false, message: "Property or buyer not found" });

    // create draft transaction
    const code = generateNumericCode(6);
    const salt = await bcrypt.genSalt(10);
    const codeHash = await bcrypt.hash(code, salt);
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const draftSnapshot = {
      title: property.title,
      ownerName: `${property.agentName || "Owner"}`,
      category: property.category || property.type || "Property",
      description: property.description || "",
      location: property.country || property.location || "",
      amount: property.price || 0,
      currency: property.currency || "NGN",
      photo:
        property.images && property.images.length > 0
          ? property.images[0]
          : null,
      ownerContact: property.agentContact || property.ownerContact || "",
      propertyStatus: property.status || "Sale",
    };

    const tx = await Transaction.create({
      propertyId,
      buyerId: userId,
      ownerId: property.agentId || property.ownerId,
      amount: property.price || 0,
      currency: property.currency || "NGN",
      draftSnapshot,
      codeHash,
      codeExpiry: expiry,
      status: "code_sent",
    });

    // send email to buyer (non-blocking)
    (async () => {
      try {
        if (buyer && buyer.email) {
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: buyer.email,
            subject: `Your LemonZee payment code`,
            html: `<p>Hi ${buyer.firstName || ""},</p><p>Your verification code is <strong>${code}</strong>. It expires in 15 minutes.</p>`,
          };
          await transporter.sendMail(mailOptions);
        }
      } catch (err) {
        console.log({ err });
        console.error("Error sending OTP email:", err?.message || err);
      }
    })();

    return res
      .status(200)
      .json({
        success: true,
        message: "Code sent to registered email",
        transactionId: tx._id,
      });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error generating code",
        error: err.message,
      });
  }
};

// POST /transactions/verify-code
// body: { transactionId, code }
const verifyCode = async (req, res) => {
  const { transactionId, code } = req.body;
  if (!transactionId || !code)
    return res
      .status(400)
      .json({ success: false, message: "transactionId and code required" });

  try {
    const tx = await Transaction.findById(transactionId);
    if (!tx)
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    if (tx.codeExpiry < new Date())
      return res.status(400).json({ success: false, message: "Code expired" });

    const valid = await bcrypt.compare(code, tx.codeHash);
    if (!valid)
      return res.status(400).json({ success: false, message: "Invalid code" });

    tx.status = "verified";
    await tx.save();

    // return draftSnapshot so frontend can show property details
    return res
      .status(200)
      .json({ success: true, message: "Code verified", transaction: tx });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error verifying code",
        error: err.message,
      });
  }
};

// POST /transactions/initiate
// body: { transactionId, buyerEmail }
// Response: { checkoutUrl, transactionId }
const initiatePayment = async (req, res) => {
  const { transactionId, buyerEmail } = req.body;
  if (!transactionId)
    return res
      .status(400)
      .json({ success: false, message: "transactionId required" });

  try {
    const tx = await Transaction.findById(transactionId);
    if (!tx)
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    if (tx.status !== "verified" && tx.status !== "initiated") {
      return res
        .status(400)
        .json({ success: false, message: "Transaction not ready for payment" });
    }

    // initialize Paystack transaction
    const amountInKobo = Math.round(tx.amount * 100); // Paystack expects amount in kobo (if NGN)
    const payload = {
      email: buyerEmail,
      amount: amountInKobo,
      metadata: {
        transactionId: tx._id.toString(),
        propertyId: tx.propertyId.toString(),
        buyerId: tx.buyerId.toString(),
        ownerId: tx.ownerId.toString(),
      },
      callback_url: FRONTEND_CALLBACK_SUCCESS_URL, // optional - Paystack will redirect here after payment
    };

    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      payload,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!paystackRes.data || !paystackRes.data.status) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Error initializing payment with Paystack",
        });
    }

    const checkoutUrl = paystackRes.data.data.authorization_url;
    tx.checkoutAuthorizationUrl = checkoutUrl;
    tx.status = "initiated_payment";
    await tx.save();

    return res
      .status(200)
      .json({ success: true, checkoutUrl, transactionId: tx._id });
  } catch (err) {
    console.error(
      "initiatePayment error:",
      err?.response?.data || err.message || err,
    );
    return res
      .status(500)
      .json({
        success: false,
        message: "Error initiating payment",
        error: err.message,
      });
  }
};

const linkPaymentToTransaction = async (req, res) => {
  try {
    const { transactionId, paymentReference } = req.body;
    if (!transactionId || !paymentReference)
      return res
        .status(400)
        .json({
          success: false,
          message: "transactionId and paymentReference required",
        });

    const tx = await Transaction.findById(transactionId);
    if (!tx)
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });

    tx.paymentReference = paymentReference;
    tx.status = "pending_confirmation";
    await tx.save();

    // Notify owner & buyer (reuse your Notification logic)
    // ... create Notification + create Chat bot message to owner etc.

    return res.status(200).json({ success: true, transaction: tx });
  } catch (err) {
    console.error("linkPaymentToTransaction error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/transaction/latest-for-user?propertyId=...&userId=...
 * Returns the latest transaction for a given user + property (buyer or owner).
 * Useful for chat screens that poll a user's latest transaction for a property.
 */
const getLatestForUser = async (req, res) => {
  try {
    const { propertyId, userId } = req.query;

    if (!propertyId || !userId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "propertyId and userId query params required",
        });
    }

    // Find the most recent transaction for that property where user is buyer or owner
    const tx = await Transaction.findOne({
      propertyId,
      $or: [{ buyerId: userId }, { ownerId: userId }],
    })
      .sort({ createdAt: -1 })
      .lean()
      .populate([
        {
          path: "buyerId",
          select: "firstName lastName email phone profilePicture",
        },
        {
          path: "ownerId",
          select: "firstName lastName email phone profilePicture",
        },
      ]);

    if (!tx) return res.status(200).json({ success: true, transaction: null });

    // attach payout snapshot if exists
    if (tx.payoutId) {
      try {
        const payout = await Payout.findById(tx.payoutId).lean();
        if (payout) {
          tx.payoutSnapshot = {
            _id: payout._id,
            status: payout.status,
            netAmount: payout.netAmount,
            currency: payout.currency,
            scheduledAt: payout.scheduledAt,
            providerReference: payout.providerReference,
          };
        }
      } catch (err) {
        console.warn(
          "getLatestForUser: payout lookup failed",
          err?.message || err,
        );
      }
    }

    return res.status(200).json({ success: true, transaction: tx });
  } catch (err) {
    console.error("getLatestForUser error:", err);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error fetching latest transaction",
        error: err.message,
      });
  }
};

/**
 * Helper: create in-app notification and optionally send email (best-effort)
 */
async function notifyUser({
  userId,
  title,
  body,
  data = {},
  sendEmail = false,
}) {
  try {
    await Notification.create({
      userId,
      type: data?.type || "system",
      title,
      body,
      data,
    });
  } catch (err) {
    console.warn(
      "notifyUser: notification creation failed",
      err?.message || err,
    );
  }

  if (sendEmail && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    try {
      const user = await User.findById(userId).select("email firstName");
      if (user && user.email) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: title,
          html: `<p>Hi ${user.firstName || ""},</p><p>${body}</p>`,
        });
      }
    } catch (err) {
      console.warn("notifyUser: email sending failed", err?.message || err);
    }
  }
}

// POST /transactions/confirm
// body: { transactionId, role } role = 'buyer' | 'owner'
/**
 * confirmTransaction
 * - buyers confirm -> mark transaction awaiting_disbursement
 * - create Payout entry for admins to process
 * - notify buyer and owner
 */
const confirmTransaction = async (req, res) => {
  const { transactionId, role } = req.body;
  if (!transactionId || !role)
    return res
      .status(400)
      .json({ success: false, message: "transactionId and role required" });

  try {
    const tx = await Transaction.findById(transactionId);
    if (!tx)
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });

    // set confirmations
    if (role === "buyer") {
      tx.confirmations = tx.confirmations || {};
      tx.confirmations.buyer = true;
    }

    // Only buyer confirmation triggers payout queue in your new flow
    if (role === "buyer") {
      // mark transaction awaiting admin disbursement
      tx.status = "awaiting_disbursement";

      // calculate commission 4%
      const commissionRate = 0.04;
      const commission = Math.round(tx.amount * commissionRate * 100) / 100; // 2dp
      const toOwner = Math.round((tx.amount - commission) * 100) / 100;

      // mark property taken now (you can choose to wait until disbursement completes)
      await Property.findByIdAndUpdate(tx.propertyId, { isTaken: true });

      // create a Payout record for admin queue (avoid duplicates)
      const owner = await User.findById(tx.ownerId).lean();
      const buyer = await User.findById(tx.buyerId).lean();

      let payout = await Payout.findOne({ transactionId: tx._id });
      if (!payout) {
        payout = await Payout.create({
          transactionId: tx._id,
          ownerId: tx.ownerId,
          buyerId: tx.buyerId,
          amount: tx.amount,
          amountMinor: Math.round(Number(tx.amount) * 100),
          commission,
          netAmount: toOwner,
          netAmountMinor: Math.round(Number(toOwner) * 100),
          currency: tx.currency || "NGN",
          status: "awaiting_disbursement",
          method: "bank_transfer",
          metadata: {
            propertyId: tx.propertyId,
            propertyTitle: tx.draftSnapshot?.title,
          },
        });
      }

      // create in-app notifications (buyer & owner)
      await notifyUser({
        userId: tx.buyerId,
        title: "Payment recorded — awaiting disbursement",
        body: `Your payment of ${tx.currency || "NGN"} ${tx.amount} for "${tx.draftSnapshot?.title}" has been received and is awaiting admin disbursement.`,
        data: {
          transactionId: tx._id,
          payoutId: payout._id,
          type: "transaction_awaiting_disbursement",
        },
        sendEmail: true,
      });

      await notifyUser({
        userId: tx.ownerId,
        title: "Payout queued",
        body: `A payout for your property "${tx.draftSnapshot?.title}" has been queued. Net amount: ${tx.currency || "NGN"} ${toOwner}. Admin will disburse soon.`,
        data: {
          transactionId: tx._id,
          payoutId: payout._id,
          type: "payout_queued",
        },
        sendEmail: true,
      });

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: "Payout queued (action required)",
          html: `<p>Payout queued for ${owner?.firstName || ""} ${owner?.lastName || ""} — ${tx.currency || "NGN"} ${toOwner}. Transaction: ${tx._id}</p>`,
        });
      } catch (e) {
        console.warn("Admin notification email failed", e?.message || e);
      }
    }

    await tx.save();

    return res.status(200).json({ success: true, transaction: tx });
  } catch (err) {
    console.error("confirmTransaction error:", err);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error confirming transaction",
        error: err.message,
      });
  }
};

/**
 * GET /api/transaction/:id
 * Returns a single transaction by id, populated with buyer/owner and basic payout info (if any).
 */
const getTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "transaction id required" });

    const tx = await Transaction.findById(id)
      .lean()
      .populate("buyerId ownerId propertyId");

    if (!tx)
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });

    // if there is a payoutId or payout stored, attach a snapshot (non-sensitive)
    if (tx.payoutId) {
      try {
        const payout = await Payout.findById(tx.payoutId).lean();
        if (payout) {
          tx.payoutSnapshot = {
            _id: payout._id,
            status: payout.status,
            netAmount: payout.netAmount,
            currency: payout.currency,
            scheduledAt: payout.scheduledAt,
            disbursedAt: payout.disbursedAt,
            providerReference: payout.providerReference,
          };
        }
      } catch (err) {
        // don't fail the whole request for payout lookup errors
        console.warn(
          "getTransaction: payout lookup failed",
          err?.message || err,
        );
      }
    }

    // Return transaction (lean object)
    return res.status(200).json({ success: true, transaction: tx });
  } catch (err) {
    console.error("getTransaction error:", err);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error fetching transaction",
        error: err.message,
      });
  }
};

// Paystack webhook handler
// IMPORTANT: To verify signature you must capture raw request body. See note below for how to setup body parser.
const handlePaystackWebhook = async (req, res) => {
  try {
    // rawBody must be available on req.rawBody (see app-level setup)
    const signature =
      req.headers["x-paystack-signature"] ||
      req.headers["X-Paystack-Signature"];
    if (!signature) {
      console.warn("No signature header on webhook");
      return res.status(400).send("No signature");
    }

    const computed = crypto
      .createHmac("sha512", PAYSTACK_SECRET)
      .update(req.rawBody)
      .digest("hex");
    if (signature !== computed) {
      console.warn("Invalid webhook signature");
      return res.status(400).send("Invalid signature");
    }

    const event = req.body;
    // handle charge.success (or transaction.status = 'success')
    const eventType = event.event || event.type || "";
    // if paystack returns { event: 'charge.success', data: { ... } }
    const data = event.data || event;

    // find transactionId from metadata (we set it during init)
    const metadata = data.metadata || {};
    const txId = metadata.transactionId || (data.reference && data.reference); // fallback

    if (!txId) {
      console.warn("Webhook: no transactionId metadata");
      return res.status(200).send("ok");
    }

    const tx = await Transaction.findById(txId);
    if (!tx) {
      console.warn("Webhook: tx not found", txId);
      return res.status(200).send("ok");
    }

    // If event indicates success, mark paid and pending confirmation
    // Note: adapt depending on exact Paystack payload shape (charge.success / transaction)
    if (
      eventType.includes("charge.success") ||
      (data.status && data.status === "success")
    ) {
      tx.status = "pending_confirmation";
      tx.paymentReference = data.reference || data.id || data.transaction;
      await tx.save();

      // notify owner in-app + email + create a chat message or notification
      await Notification.create({
        userId: tx.ownerId,
        type: "payment_pending",
        title: "Payment received (pending confirmation)",
        body: `A payment for ${tx.draftSnapshot.title} has been made and awaits your confirmation.`,
        data: { transactionId: tx._id },
      });

      // create chat message for owner (so he sees it in DM)
      await Chat.create({
        senderId: tx.buyerId,
        receiverId: tx.ownerId,
        message: `Payment made for ${tx.draftSnapshot.title}. Please confirm the transaction.`,
      });

      // email owner (non-blocking)
      (async () => {
        try {
          const owner = await User.findById(tx.ownerId).select(
            "email firstName",
          );
          if (owner && owner.email) {
            await transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: owner.email,
              subject: `Payment pending confirmation for ${tx.draftSnapshot.title}`,
              html: `<p>Hi ${owner.firstName || ""},</p>
              <p>A buyer has made payment for <strong>${tx.draftSnapshot.title}</strong>. Please confirm the transaction in the app to complete transfer.</p>`,
            });
          }
        } catch (err) {
          console.error("Error sending owner email on pending payment", err);
        }
      })();

      // Create a payout and attempt immediate disbursement (idempotent)
      (async () => {
        try {
          let payout = await Payout.findOne({ transactionId: tx._id });
          if (!payout) {
            const commissionRate = 0.04;
            const commission = Math.round(tx.amount * commissionRate * 100) / 100; // 2dp
            const toOwner = Math.round((tx.amount - commission) * 100) / 100;

            payout = await Payout.create({
              transactionId: tx._id,
              ownerId: tx.ownerId,
              buyerId: tx.buyerId,
              amount: tx.amount,
              amountMinor: Math.round(Number(tx.amount) * 100),
              commission,
              netAmount: toOwner,
              netAmountMinor: Math.round(Number(toOwner) * 100),
              currency: tx.currency || "NGN",
              status: "queued",
              method: "bank_transfer",
              metadata: {
                propertyId: tx.propertyId,
                propertyTitle: tx.draftSnapshot?.title,
              },
            });
            tx.payoutId = payout._id;
            await tx.save();
          }

          // Attempt disbursement (this will create recipient if missing)
          try {
            await payoutService.disbursePayout(payout._id);
          } catch (err) {
            console.warn("Immediate disbursement failed (will remain queued):", err?.message || err);
          }
        } catch (err) {
          console.error("Webhook payout creation error:", err?.message || err);
        }
      })();
    }

    // respond 200 quickly
    return res.status(200).send("ok");
  } catch (err) {
    console.error("webhook handler error:", err);
    return res.status(500).send("error");
  }
};

module.exports = {
  generateCode,
  verifyCode,
  initiatePayment,
  confirmTransaction,
  linkPaymentToTransaction,
  getLatestForUser,
  getTransaction,
  handlePaystackWebhook,
};
