import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  totalTickets: { type: Number, required: true },
  ticketsSold: { type: Number, default: 0 }
})

const ticketModel = mongoose.models.ticket || mongoose.model("Event", ticketSchema)

export default ticketModel;