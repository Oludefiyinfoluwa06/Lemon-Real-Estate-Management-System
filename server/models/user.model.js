const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  propertiesOfInterest: {
    type: [String],
    required: () => this.role === "buyer",
    default: null,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  lastName: {
    type: String,
    required: () => this.role === "buyer" || this.role === "individual-agent",
  },
  firstName: {
    type: String,
    required: () => this.role === "buyer" || this.role === "individual-agent",
  },
  middleName: { type: String },
  companyName: {
    type: String,
    required: () =>
      this.role === "individual-agent" || this.role === "company-agent",
  },
  currentAddress: { type: String, required: true },
  country: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["buyer", "individual-agent", "company-agent"],
    required: true,
  },
  isIdVerified: {
    type: Boolean,
    default: false,
    required: () =>
      this.role === "individual-agent" || this.role === "company-agent",
  },
  hasPaid: {
    type: Boolean,
    default: false,
    required: () =>
      this.role === "individual-agent" || this.role === "company-agent",
  },
  paymentStartDate: {
    type: Date,
    default: null,
    required: () =>
      this.role === "individual-agent" || this.role === "company-agent",
  },
  paymentEndDate: {
    type: Date,
    default: null,
    required: () =>
      this.role === "individual-agent" || this.role === "company-agent",
  },
  isOnTrial: {
    type: Boolean,
    default: false,
    required: () =>
      this.role === "individual-agent" || this.role === "company-agent",
  },
  trialStartDate: {
    type: Date,
    default: null,
    required: () =>
      this.role === "individual-agent" || this.role === "company-agent",
  },
  trialEndDate: {
    type: Date,
    default: null,
    required: () =>
      this.role === "individual-agent" || this.role === "company-agent",
  },
});

const User = mongoose.model("users", userSchema);
module.exports = User;
