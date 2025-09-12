const cron = require("node-cron");
const Transaction = require("../models/transaction.model");
const Property = require("../models/property.model");
const User = require("../models/user.model");
const Notification = require("../models/notification.model");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// run every day at 02:00
cron.schedule("0 2 * * *", async () => {
  console.log("Running transactions cron job:", new Date().toISOString());
  try {
    const now = new Date();
    // find pending_confirmation transactions
    const pending = await Transaction.find({ status: "pending_confirmation" }).lean();

    for (const tx of pending) {
      const created = new Date(tx.createdAt);
      // find property to know Sale vs Rent
      const property = await Property.findById(tx.propertyId).lean();
      const isSale = (property && (property.status === "Sale" || property.type === "Sale" || property.category === "Sale"));
      const deadlineDays = isSale ? 21 : 5;
      const deadline = new Date(created.getTime() + deadlineDays * 24 * 60 * 60 * 1000);

      if (now > deadline) {
        // perform reversal
        console.log(`Reversing tx ${tx._id} due to timeout`);

        // Business rule: if reversalCountForBuyer >= 2 then this is 3rd reversal -> 2% penalty
        const reversalCount = tx.reversalCountForBuyer || 0;
        const isThird = reversalCount >= 2;
        const penaltyRate = isThird ? 0.02 : 0;
        const amountToReturn = Math.round(((1 - penaltyRate) * tx.amount) * 100) / 100;

        // TODO: Implement actual refund via payment provider (Paystack refund or transfer back).
        // For now mark tx reversed and notify buyer + owner.
        await Transaction.findByIdAndUpdate(tx._id, { status: "reversed", reversalCountForBuyer: reversalCount + 1 });

        // mark property free
        await Property.findByIdAndUpdate(tx.propertyId, { status: "Free", tagColor: "green" });

        // notify buyer & owner
        await Notification.create({
          userId: tx.buyerId,
          type: "transaction_reversed",
          title: "Payment Reversed",
          body: `Your payment for ${tx.draftSnapshot.title} has been reversed. Amount returned: ${amountToReturn} ${tx.currency}.`,
          data: { transactionId: tx._id },
        });
        await Notification.create({
          userId: tx.ownerId,
          type: "transaction_reversed_owner",
          title: "Payment Reversed",
          body: `Payment for ${tx.draftSnapshot.title} was reversed after timeout.`,
          data: { transactionId: tx._id },
        });

        // send emails (non-blocking)
        (async () => {
          try {
            const buyer = await User.findById(tx.buyerId).select("email firstName");
            if (buyer && buyer.email) {
              await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: buyer.email,
                subject: "Payment Reversed",
                html: `<p>Your payment for ${tx.draftSnapshot.title} was reversed. Amount returned: ${amountToReturn} ${tx.currency}.</p>`,
              });
            }
          } catch (err) {
            console.error("Error sending reversal email:", err);
          }
        })();
      }
    }
  } catch (err) {
    console.error("cron error", err);
  }
});
