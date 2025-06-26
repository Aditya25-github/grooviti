import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  organizerEmail: { type: String, required: true },
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
