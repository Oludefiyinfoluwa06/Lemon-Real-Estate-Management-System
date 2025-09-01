const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: ["Rent", "Lease", "Sale"],
      default: null,
    },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    country: { type: String, required: true },
    images: { type: [String], required: true },
    video: { type: String, required: true },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    agentName: { type: String, required: true },
    agentContact: { type: String, required: true },
    companyName: { type: String, required: true },
    agentProfilePicture: { type: String },
    // property documents are confidential; store as array but control visibility in controllers
    documents: [{ type: String }],
    documentTypes: [{ type: String }],
    isDocumentPublic: { type: Boolean, default: false },
    // engagement metrics
    likes: { type: Number, default: 0 },
    videoViews: { type: Number, default: 0 },
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    coordinates: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    isOnAdvertisement: { type: Boolean, default: false },
    advertisementStartDate: { type: Date, default: null },
    advertisementEndDate: { type: Date, default: null },
  },
  { timestamps: true },
);

const Property = mongoose.model("properties", propertySchema);
module.exports = Property;
