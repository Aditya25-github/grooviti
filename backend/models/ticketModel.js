import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  isPaid: { type: Boolean, default: true },
  organizerEmail: { type: String, required: true },
  organizerContact: { type: String, default: "" },
  teamSizeLimit: { type: Number, default: 10 },
  teamSizeMinLimit: { type: Number, default: 1 },
  memberWisePayment: { type: Boolean, default: false },
  date: { type: Date, required: false },
  time: { type: String, required: false },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "organizer", required: true },
  coverImage: {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  otherImages: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    }
  ],
  rulebook: {
    url: { type: String },
    public_id: { type: String },
  },
  category: { type: String, required: true },
  totalTickets: { type: Number, required: true },
  ticketsSold: { type: Number, default: 0 },
  highlights: {
    type: [String],
    default: [],
  },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: false },
    country: { type: String, default: "India", required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String },
  },
}, { timestamps: true });

const ticketModel = mongoose.models.Event || mongoose.model("Event", ticketSchema);

export default ticketModel;
